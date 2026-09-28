-- Affiliate links, earned commissions, and withdrawal requests.
-- Server-side payment submission + manual approval trigger own all credits.

create table if not exists public.affiliate_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  referral_code text not null unique,
  created_at timestamptz not null default now()
);

alter table public.payment_submissions
  add column if not exists affiliate_code text,
  add column if not exists original_amount numeric(10,2),
  add column if not exists discount_amount numeric(10,2);

create table if not exists public.affiliate_commissions (
  id uuid primary key default gen_random_uuid(),
  payment_submission_id uuid not null unique references public.payment_submissions(id) on delete cascade,
  affiliate_user_id uuid not null references auth.users(id) on delete restrict,
  original_amount numeric(10,2) not null check (original_amount > 0),
  discount_amount numeric(10,2) not null check (discount_amount >= 0),
  amount_paid numeric(10,2) not null check (amount_paid > 0),
  commission_amount numeric(10,2) not null check (commission_amount > 0),
  status text not null default 'available' check (status in ('available', 'void')),
  created_at timestamptz not null default now()
);

create table if not exists public.affiliate_withdrawals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric(10,2) not null check (amount > 0),
  payout_upi text not null check (length(trim(payout_upi)) between 3 and 120),
  status text not null default 'pending' check (status in ('pending', 'paid', 'rejected')),
  requested_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create index if not exists affiliate_commissions_owner_status_idx on public.affiliate_commissions (affiliate_user_id, status);
create index if not exists affiliate_withdrawals_owner_status_idx on public.affiliate_withdrawals (user_id, status);

alter table public.affiliate_accounts enable row level security;
alter table public.affiliate_commissions enable row level security;
alter table public.affiliate_withdrawals enable row level security;

drop policy if exists "Users can read their affiliate account" on public.affiliate_accounts;
create policy "Users can read their affiliate account" on public.affiliate_accounts for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists "Users can read their commissions" on public.affiliate_commissions;
create policy "Users can read their commissions" on public.affiliate_commissions for select to authenticated using (affiliate_user_id = (select auth.uid()));
drop policy if exists "Users can read their withdrawals" on public.affiliate_withdrawals;
create policy "Users can read their withdrawals" on public.affiliate_withdrawals for select to authenticated using (user_id = (select auth.uid()));

revoke all on public.affiliate_accounts, public.affiliate_commissions, public.affiliate_withdrawals from anon, authenticated;
grant select on public.affiliate_accounts, public.affiliate_commissions, public.affiliate_withdrawals to authenticated;

create or replace function public.ensure_affiliate_account()
returns text language plpgsql security definer set search_path = '' as $$
declare v_user_id uuid := auth.uid(); v_code text;
begin
  if v_user_id is null then raise exception 'Sign in is required'; end if;
  select referral_code into v_code from public.affiliate_accounts where user_id = v_user_id;
  if v_code is not null then return v_code; end if;
  loop
    v_code := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10));
    insert into public.affiliate_accounts(user_id, referral_code) values (v_user_id, v_code) on conflict do nothing;
    if found then return v_code; end if;
    select referral_code into v_code from public.affiliate_accounts where user_id = v_user_id;
    if v_code is not null then return v_code; end if;
  end loop;
end;
$$;
revoke all on function public.ensure_affiliate_account() from public, anon;
grant execute on function public.ensure_affiliate_account() to authenticated;

create or replace function public.request_affiliate_withdrawal(p_amount numeric, p_payout_upi text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare v_user_id uuid := auth.uid(); v_available numeric(10,2); v_id uuid;
begin
  if v_user_id is null then raise exception 'Sign in is required'; end if;
  if p_amount is null or p_amount <= 0 or p_amount <> round(p_amount, 2) then raise exception 'Enter a valid withdrawal amount'; end if;
  if p_payout_upi is null or length(trim(p_payout_upi)) not between 3 and 120 then raise exception 'Enter a valid UPI ID'; end if;
  perform pg_advisory_xact_lock(hashtextextended(v_user_id::text, 0));
  select coalesce((select sum(c.commission_amount) from public.affiliate_commissions c where c.affiliate_user_id = v_user_id and c.status = 'available'), 0)
       - coalesce((select sum(w.amount) from public.affiliate_withdrawals w where w.user_id = v_user_id and w.status in ('pending', 'paid')), 0)
    into v_available;
  if p_amount > v_available then raise exception 'Withdrawal exceeds your available balance'; end if;
  insert into public.affiliate_withdrawals(user_id, amount, payout_upi) values (v_user_id, p_amount, trim(p_payout_upi)) returning id into v_id;
  return v_id;
end;
$$;
revoke all on function public.request_affiliate_withdrawal(numeric, text) from public, anon;
grant execute on function public.request_affiliate_withdrawal(numeric, text) to authenticated;

create or replace function public.credit_affiliate_on_payment_approval()
returns trigger language plpgsql security definer set search_path = '' as $$
declare v_affiliate_user_id uuid; v_original numeric(10,2); v_discount numeric(10,2);
begin
  if lower(trim(coalesce(new.status, ''))) in ('approved', 'paid')
     and lower(trim(coalesce(old.status, ''))) not in ('approved', 'paid')
     and new.affiliate_code is not null then
    select user_id into v_affiliate_user_id from public.affiliate_accounts where referral_code = upper(trim(new.affiliate_code));
    v_original := coalesce(new.original_amount, new.amount);
    v_discount := coalesce(new.discount_amount, 0);
    if v_affiliate_user_id is not null and v_original > 0 and new.amount > 0 then
      insert into public.affiliate_commissions(payment_submission_id, affiliate_user_id, original_amount, discount_amount, amount_paid, commission_amount)
      values (new.id, v_affiliate_user_id, v_original, v_discount, new.amount, round(v_original * 0.30, 2))
      on conflict (payment_submission_id) do update set status = 'available';
    end if;
  elsif lower(trim(coalesce(new.status, ''))) in ('rejected', 'declined', 'refunded') then
    update public.affiliate_commissions set status = 'void' where payment_submission_id = new.id;
  end if;
  return new;
end;
$$;
drop trigger if exists payment_approval_affiliate_credit on public.payment_submissions;
create trigger payment_approval_affiliate_credit after update of status on public.payment_submissions
  for each row execute function public.credit_affiliate_on_payment_approval();
revoke all on function public.credit_affiliate_on_payment_approval() from public, anon, authenticated;
