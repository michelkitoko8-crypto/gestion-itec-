// ITEC Kinshasa — Gestion des Apprenants (PWA)
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";
import { toast } from "sonner";
import type { Apprenant, Formation, Paiement } from "@/types/iteckinshasa";
import { getITECApprenants as getApprenants, getFormations, getPaiements, saveITECApprenant as saveApprenant, deleteITECApprenant as deleteApprenant } from "@/services/storage";
import Navbar from "@/components/Navbar";
import Dashboard from "@/components/Dashboard";
import ApprenantsList from "@/components/ApprenantsList";
import FormationsList from "@/components/FormationsList";
import PaiementsHistory from "@/components/PaiementsHistory";
import InstallPromptModal from "@/components/InstallPromptModal";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type Page = "dashboard" | "apprenants" | "formations" | "paiements";

function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("itec_darkMode") === "true";
    }
    return false;
  });
  const [apprenants, setApprenants] = useState<Apprenant[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [installOpen, setInstallOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [printFormationId, setPrintFormationId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const isStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  const handleOpenPrint = useCallback((formationId?: string) => {
    setPage("apprenants");
    setPrintFormationId(formationId);
    window.setTimeout(() => setPrintFormationId(undefined), 300);
  }, []);

  const refreshData = useCallback(() => {
    try {
      setApprenants(getApprenants());
      setFormations(getFormations());
      setPaiements(getPaiements());
    } catch (error: any) {
      toast.error(error.message || "Erreur lors du chargement des données");
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("itec_darkMode", String(darkMode));
  }, [darkMode]);

  const handleAddApprenant = useCallback((data: Omit<Apprenant, "id">) => {
    try {
      const apprenant: Apprenant = { ...data, id: crypto.randomUUID() };
      saveApprenant(apprenant);
      refreshData();
      toast.success("Apprenant ajouté avec succès");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'ajout");
    }
  }, [refreshData]);

  const handleUpdateApprenant = useCallback((id: string, data: Partial<Apprenant>) => {
    try {
      const existing = apprenants.find((a) => a.id === id);
      if (existing) {
        saveApprenant({ ...existing, ...data });
        refreshData();
        toast.success("Apprenant modifié avec succès");
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la modification");
    }
  }, [apprenants, refreshData]);

  const handleDeleteApprenant = useCallback((id: string) => {
    try {
      deleteApprenant(id);
      refreshData();
      toast.success("Apprenant supprimé");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression");
    }
  }, [refreshData]);

  const apprenantsCount = Object.fromEntries(
    formations.map((f) => [f.id, apprenants.filter((a) => a.formationId === f.id).length])
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors">
      <Toaster position="top-right" richColors closeButton />
      <Navbar
        currentPage={page}
        onNavigate={(page: string) => setPage(page as Page)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenInstall={() => setInstallOpen(true)}
        onOpenPrint={() => handleOpenPrint(undefined)}
      />
      <main className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {page === "dashboard" && (
              <Dashboard
                apprenants={apprenants}
                formations={formations}
                paiements={paiements}
                onNavigate={(page: string) => setPage(page as Page)}
              />
            )}
            {page === "apprenants" && (
              <ApprenantsList
                apprenants={apprenants}
                formations={formations}
                onAdd={handleAddApprenant}
                onUpdate={handleUpdateApprenant}
                onDelete={handleDeleteApprenant}
                onSelect={() => {}}
                printFormationId={printFormationId}
                onOpenPrint={handleOpenPrint}
              />
            )}
            {page === "formations" && (
              <FormationsList
                formations={formations}
                apprenantsCount={apprenantsCount}
              />
            )}
            {page === "paiements" && (
              <PaiementsHistory
                paiements={paiements}
                apprenants={apprenants}
                formations={formations}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      <InstallPromptModal
        open={installOpen}
        onClose={() => setInstallOpen(false)}
        deferredPrompt={deferredPrompt}
        isStandalone={isStandalone}
      />
    </div>
  );
}

export default App;