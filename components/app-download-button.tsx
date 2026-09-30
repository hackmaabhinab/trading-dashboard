import { Download } from "lucide-react";
import { ANDROID_APP_DOWNLOAD_URL } from "@/lib/app-download";

type AppDownloadButtonProps = {
  className?: string;
};

export default function AppDownloadButton({ className = "" }: AppDownloadButtonProps) {
  const buttonClassName = [
    "app-download-button inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 text-xs font-extrabold text-emerald-300 transition-colors",
    ANDROID_APP_DOWNLOAD_URL ? "hover:border-emerald-300/70 hover:bg-emerald-400/20" : "cursor-not-allowed opacity-65",
    className,
  ].filter(Boolean).join(" ");

  return (
    <a
      href={ANDROID_APP_DOWNLOAD_URL}
      className={buttonClassName}
      aria-label="Download the VAULT Android app"
    >
      <Download className="h-4 w-4" aria-hidden="true" />
      Download App
    </a>
  );
}
