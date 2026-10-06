import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Money, HandCoins, CalendarCheck, PiggyBank } from "@phosphor-icons/react";
import { toast } from "sonner";
import type { Apprenant, Formation, Paiement } from "@/types/iteckinshasa";
import { addPaiement, getPaiements } from "@/services/storage";

interface PaiementModalProps {
  apprenant: Apprenant;
  formations: Formation[];
  onClose: () => void;
}

const modesPaiement = ["Especes", "M-Pesa", "Airtel Money", "Orange Money", "Virement BCDC"] as const;

export default function PaiementModal({ apprenant, formations, onClose }: PaiementModalProps) {
  const formation = formations.find((f) => f.id === apprenant.formationId);
  const paiements = getPaiements(apprenant.id);

  const totalFormation = formation?.fraisFormationCDF || 0;
  const totalTechnique = formation?.fraisTechniqueUSD || 0;
  const resteFormation = totalFormation - apprenant.fraisFormationPayerCDF;
  const resteTechnique = totalTechnique - apprenant.fraisTechniquePayerUSD;

  const [typeFrais, setTypeFrais] = useState<"formation" | "technique">("formation");
  const [montant, setMontant] = useState("");
  const [modePaiement, setModePaiement] = useState<string>(modesPaiement[0]);
  const [agentCaisse, setAgentCaisse] = useState("M. Kabongo");
  const [loading, setLoading] = useState(false);

  const raccourcis =
    typeFrais === "formation"
      ? [
          ...(formation?.acompteCDF ? [{ libelle: `Acompte (${formation.acompteCDF.toLocaleString()} FC)`, valeur: formation.acompteCDF }] : []),
          ...(formation?.mensualiteCDF ? [{ libelle: `Mensualité (${formation.mensualiteCDF.toLocaleString()} FC)`, valeur: formation.mensualiteCDF }] : []),
          { libelle: "Solde total restant", valeur: resteFormation },
        ].filter((r) => r.valeur > 0)
      : (formation?.fraisTechniqueUSD
          ? [{ libelle: `Frais techniques ($${formation.fraisTechniqueUSD})`, valeur: formation.fraisTechniqueUSD }]
          : []
        ).filter((r) => r.valeur > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const montantNum = Number(montant);
    if (!montantNum || montantNum <= 0) {
      toast.error("Veuillez entrer un montant valide");
      return;
    }

    const reste = typeFrais === "formation" ? resteFormation : resteTechnique;
    if (montantNum > reste) {
      toast.error("Le montant dépasse le solde restant");
      return;
    }

    setLoading(true);
    try {
      const paiement: Paiement = {
        id: `p${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        apprenantId: apprenant.id,
        typeFrais,
        montantCDF: typeFrais === "formation" ? montantNum : (formation?.fraisTechniqueCDF || 0) * (montantNum / (formation?.fraisTechniqueUSD || 1)),
        montantUSD: typeFrais === "technique" ? montantNum : (formation?.fraisFormationUSD || 0) * (montantNum / (formation?.fraisFormationCDF || 1)),
        devisePaiement: typeFrais === "formation" ? "CDF" : "USD",
        modePaiement,
        datePaiement: new Date().toISOString().split("T")[0],
        recuNumero: `REC-ITK-${Date.now().toString().slice(-6)}`,
        agentCaisse,
      };
      addPaiement(paiement);
      toast.success(`Paiement enregistré — ${paiement.recuNumero}`);
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
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
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Enregistrer un paiement</h2>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"><X size={20} /></button>
          </div>

          <div className="px-6 py-3 bg-slate-50 dark:bg-slate-700/30 border-b border-slate-200 dark:border-slate-700">
            <p className="text-sm font-medium text-slate-900 dark:text-white">{apprenant.prenom} {apprenant.nom} {apprenant.postnom}</p>
            <p className="text-xs text-slate-400">{apprenant.matricule} — {formation?.nom || apprenant.formationId}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 px-6 py-3 border-b border-slate-200 dark:border-slate-700">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
              <p className="text-xs text-slate-500">Frais Formation (CDF)</p>
              <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">{totalFormation.toLocaleString()} FC</p>
              <p className="text-xs text-amber-500">Reste: {resteFormation.toLocaleString()} FC</p>
            </div>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
              <p className="text-xs text-slate-500">Frais Technique (USD)</p>
              <p className="text-sm font-bold text-amber-700 dark:text-amber-300">${totalTechnique}</p>
              <p className="text-xs text-amber-500">Reste: ${resteTechnique}</p>
            </div>
          </div>

          {formation?.detailsEcheancier && (
            <div className="px-6 py-2.5 bg-sky-50 dark:bg-sky-900/20 border-b border-slate-200 dark:border-slate-700 flex items-start gap-2">
              <CalendarCheck size={16} className="text-sky-600 dark:text-sky-400 mt-0.5 shrink-0" />
              <p className="text-xs text-slate-600 dark:text-slate-300">
                <span className="font-medium text-sky-700 dark:text-sky-300">Échéancier : </span>
                {formation.detailsEcheancier}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Type de frais</label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setTypeFrais("formation")}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium border transition-colors ${
                    typeFrais === "formation"
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                      : "border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}>
                  <Money size={18} /> Formation (CDF)
                </button>
                <button type="button" onClick={() => setTypeFrais("technique")}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium border transition-colors ${
                    typeFrais === "technique"
                      ? "border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                      : "border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}>
                  <HandCoins size={18} /> Technique (USD)
                </button>
              </div>
            </div>

            {raccourcis.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5 flex items-center gap-1.5">
                  <PiggyBank size={14} /> Montants rapides
                </label>
                <div className="flex flex-wrap gap-2">
                  {raccourcis.map((r) => (
                    <button key={r.libelle} type="button" onClick={() => setMontant(String(r.valeur))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        montant === String(r.valeur)
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                          : "border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                      }`}>
                      {r.libelle}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Montant</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                    {typeFrais === "formation" ? "FC" : "$"}
                  </span>
                  <input value={montant} onChange={(e) => setMontant(e.target.value.replace(/\D/g, ""))} required
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="0" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Mode de paiement</label>
                <select value={modePaiement} onChange={(e) => setModePaiement(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                  {modesPaiement.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Agent de caisse</label>
              <input value={agentCaisse} onChange={(e) => setAgentCaisse(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                Annuler
              </button>
              <button type="submit" disabled={loading}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium transition-colors">
                {loading ? "Enregistrement..." : "Enregistrer le paiement"}
              </button>
            </div>
          </form>

          {paiements.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-xs font-medium text-slate-500 mb-2">Historique des paiements</p>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {paiements.slice(-5).reverse().map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">{p.datePaiement} — {p.modePaiement}</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {p.typeFrais === "formation" ? `${p.montantCDF.toLocaleString()} FC` : `$${p.montantUSD}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}