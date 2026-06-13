import type { Language } from "@/lib/i18n/translations";

export interface LanguageSwitcherProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export function LanguageSwitcher({ language, onLanguageChange }: LanguageSwitcherProps) {
  return (
    <div className="flex items-center gap-1 rounded-md border border-white/10 bg-[#101217] p-1">
      <button
        onClick={() => onLanguageChange("en")}
        className={`rounded px-2 py-1 text-xs font-bold transition ${
          language === "en"
            ? "bg-[#39ff88]/10 text-[#39ff88]"
            : "text-zinc-500 hover:text-zinc-300"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => onLanguageChange("az")}
        className={`rounded px-2 py-1 text-xs font-bold transition ${
          language === "az"
            ? "bg-[#39ff88]/10 text-[#39ff88]"
            : "text-zinc-500 hover:text-zinc-300"
        }`}
      >
        AZ
      </button>
    </div>
  );
}
