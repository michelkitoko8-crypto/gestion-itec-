import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { List, X, GraduationCap, Sun, Moon, UserCircle, Clipboard, Phone, DownloadSimple, Printer } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenInstall?: () => void;
  onOpenPrint?: () => void;
}

const navItems = [
  { id: "dashboard", label: "Tableau de bord" },
  { id: "apprenants", label: "Apprenants" },
  { id: "formations", label: "Formations" },
  { id: "paiements", label: "Paiements" },
];

export default function Navbar({ currentPage, onNavigate, darkMode, onToggleDarkMode, onOpenInstall, onOpenPrint }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-emerald-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <List size={22} />}
          </Button>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate("dashboard")}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600">
              <GraduationCap size={20} weight="bold" className="text-white" />
            </div>
            <span className="hidden sm:inline font-bold text-lg text-slate-900 dark:text-white">
              ITEC <span className="text-emerald-600 dark:text-emerald-400">KINSHASA</span>
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === item.id
                  ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <a
          href="tel:+243818741094"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
        >
          <Phone size={16} weight="bold" />
          +243 818 741 094
        </a>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPrint}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Imprimer la liste des apprenants"
          >
            <Printer size={16} weight="bold" />
            Imprimer
          </button>
          <button
            onClick={onOpenInstall}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
            title="Installer l'application"
          >
            <DownloadSimple size={16} weight="bold" />
            <span className="hidden sm:inline">Installer</span>
          </button>
          <Button variant="ghost" size="icon" onClick={onToggleDarkMode}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <UserCircle size={22} />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-emerald-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              <div className="flex items-center gap-2 pb-1">
                <button
                  onClick={() => { onOpenInstall?.(); setMobileOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30"
                >
                  <DownloadSimple size={16} weight="bold" />
                  Installer l'application
                </button>
                <button
                  onClick={() => { onOpenPrint?.(); setMobileOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Printer size={16} weight="bold" />
                  Imprimer
                </button>
              </div>
              <a
                href="tel:+243818741094"
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30"
              >
                <Phone size={16} weight="bold" />
                +243 818 741 094
              </a>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { onNavigate(item.id); setMobileOpen(false); }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === item.id
                      ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}