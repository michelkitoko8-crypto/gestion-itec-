import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  DownloadSimple,
  DeviceMobile,
  Monitor,
  ShareFat,
  CheckCircle,
} from "@phosphor-icons/react";
import { toast } from "sonner";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface InstallPromptModalProps {
  open: boolean;
  onClose: () => void;
  deferredPrompt: BeforeInstallPromptEvent | null;
  isStandalone: boolean;
}

type Platform = "android" | "ios" | "windows" | "mac";

const PLATFORMS: { id: Platform; label: string; icon: typeof DeviceMobile }[] = [
  { id: "android", label: "Android", icon: DeviceMobile },
  { id: "ios", label: "iPhone / iPad", icon: DeviceMobile },
  { id: "windows", label: "Windows", icon: Monitor },
  { id: "mac", label: "Mac", icon: Monitor },
];

const STEPS: Record<Platform, string[]> = {
  android: [
    "Ouvrez l'application dans le navigateur Chrome ou Edge.",
    "Appuyez sur le menu ⋮ en haut à droite de l'écran.",
    "Sélectionnez « Ajouter à l'écran d'accueil » puis « Installer ».",
  ],
  ios: [
    "Ouvrez l'application dans Safari (navigateur par défaut).",
    "Appuyez sur le bouton Partager en bas de l'écran.",
    "Sélectionnez « Sur l'écran d'accueil » puis « Ajouter ».",
  ],
  windows: [
    "Ouvrez l'application dans Chrome, Edge ou Firefox.",
    "Cliquez sur le bouton Installer dans la barre de navigation (icône ,] ou +).",
    "Confirmez avec « Installer » dans la boîte de dialogue du navigateur.",
  ],
  mac: [
    "Ouvrez l'application dans Chrome, Edge ou Safari.",
    "Cliquez sur le bouton Partager ou le bouton Installer dans la barre d'adresse.",
    "Confirmez avec « Installer » et retrouvez l'application dans vos applications.",
  ],
};

export default function InstallPromptModal({
  open,
  onClose,
  deferredPrompt,
  isStandalone,
}: InstallPromptModalProps) {
  const [platform, setPlatform] = useState<Platform>("android");

  const handleInstall = async () => {
    if (!deferredPrompt) {
      toast.info("Utilisez les instructions ci-dessous selon votre appareil pour installer l'application.");
      return;
    }
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        toast.success("Application installée avec succès !");
      }
    } catch {
      toast.error("L'installation n'a pas pu être lancée. Suivez le guide ci-dessous.");
    }
    onClose();
  };

  const active = PLATFORMS.find((p) => p.id === platform);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Installer l'application</h2>
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                <DownloadSimple size={22} weight="bold" className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                    {isStandalone
                      ? "ITEC Kinshasa est déjà installée sur cet appareil."
                      : "Installez ITEC Kinshasa pour un accès rapide et hors ligne depuis votre écran d'accueil."}
                  </p>
                  {deferredPrompt && (
                    <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                      Votre navigateur permet une installation en 1 clic.
                    </p>
                  )}
                </div>
              </div>

              {!isStandalone && (
                <>
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Choisissez votre appareil</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {PLATFORMS.map((p) => {
                        const Icon = p.icon;
                        const isActive = platform === p.id;
                        return (
                          <button
                            key={p.id}
                            onClick={() => setPlatform(p.id)}
                            className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-lg border text-xs font-medium transition-colors ${
                              isActive
                                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                                : "border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                            }`}
                          >
                            <Icon size={20} />
                            {p.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {active && (
                    <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/40">
                      <p className="text-sm font-medium text-slate-900 dark:text-white mb-3">Guide pour {active.label}</p>
                      <ol className="space-y-3">
                        {STEPS[active.id].map((step, i) => (
                          <li key={i} className="flex gap-3 items-start">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold shrink-0">
                              {i + 1}
                            </span>
                            <span className="text-sm text-slate-700 dark:text-slate-300">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleInstall}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
                    >
                      <DownloadSimple size={18} />
                      {deferredPrompt ? "Installer maintenant" : "Voir le guide complet"}
                    </button>
                    {active?.id === "ios" && (
                      <p className="flex items-center gap-1.5 text-xs text-slate-400">
                        <ShareFat size={14} className="shrink-0" />
                        Appliquez les étapes dans Safari uniquement.
                      </p>
                    )}
                    {active?.id === "windows" && (
                      <p className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Monitor size={14} className="shrink-0" />
                        Le bouton Installer apparaît dans la barre d'adresse de Chrome/Edge.
                      </p>
                    )}
                  </div>
                </>
              )}

              {isStandalone && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/40">
                  <CheckCircle size={22} weight="bold" className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    L'application fonctionne en mode autonome. Retrouvez-la comme une application native sur votre appareil.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Fermer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}