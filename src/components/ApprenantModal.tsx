import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "@phosphor-icons/react";
import type { Apprenant, Formation } from "@/types/iteckinshasa";
import { ANNEES_PROMOTIONS, PROMOTIONS, PROMOTIONS_PAR_ANNEE } from "@/constants/initialData";


interface ApprenantModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Apprenant, "id">) => void;
  editApprenant: Apprenant | null;
  formations: Formation[];
}

const communes = ["Gombe", "Lemba", "Bandal", "Kalamu", "Limete", "Ngaliema", "Kinshasa", "Matete", "Ndjili", "Masina", "Barumbu", "Makala", "Selembao", "Bumbu", "Mont Ngafula", "Nsele", "Kisenso", "Ngiri-Ngiri", "Ngaba", "Maluku"];

export default function ApprenantModal({ open, onClose, onSave, editApprenant, formations }: ApprenantModalProps) {
  const [nom, setNom] = useState("");
  const [postnom, setPostnom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [sexe, setSexe] = useState<"M" | "F">("M");
  const [telephone, setTelephone] = useState("");
  const [commune, setCommune] = useState(communes[0]);
  const [formationId, setFormationId] = useState(formations[0]?.id || "");
  const [promotion, setPromotion] = useState(PROMOTIONS[12]);
  const [statutApprenant, setStatutApprenant] = useState<"actif" | "diplome" | "abandon">("actif");

  useEffect(() => {
    if (editApprenant) {
      setNom(editApprenant.nom);
      setPostnom(editApprenant.postnom);
      setPrenom(editApprenant.prenom);
      setSexe(editApprenant.sexe);
      setTelephone(editApprenant.telephone);
      setCommune(editApprenant.commune);
      setFormationId(editApprenant.formationId);
      setPromotion(editApprenant.promotion);
      setStatutApprenant(editApprenant.statutApprenant);
    } else {
      setNom(""); setPostnom(""); setPrenom(""); setSexe("M");
      setTelephone(""); setCommune(communes[0]);
      setFormationId(formations[0]?.id || ""); setPromotion(PROMOTIONS[12]);
      setStatutApprenant("actif");
    }
  }, [editApprenant, open, formations]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !prenom || !telephone) return;
    const formation = formations.find((f) => f.id === formationId);
    onSave({
      matricule: editApprenant?.matricule || `ITK-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999)).padStart(3, "0")}`,
      nom, postnom, prenom, sexe, telephone, commune, formationId, promotion,
      dateInscription: editApprenant?.dateInscription || new Date().toISOString().split("T")[0],
      statutApprenant,
      fraisFormationPayerCDF: editApprenant?.fraisFormationPayerCDF || 0,
      fraisTechniquePayerUSD: editApprenant?.fraisTechniquePayerUSD || 0,
    });
    onClose();
  };

  const selectedFormation = formations.find((f) => f.id === formationId);

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
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {editApprenant ? "Modifier l'apprenant" : "Nouvel apprenant"}
              </h2>
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Nom</label>
                  <input value={nom} onChange={(e) => setNom(e.target.value)} required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Postnom</label>
                  <input value={postnom} onChange={(e) => setPostnom(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Prénom</label>
                  <input value={prenom} onChange={(e) => setPrenom(e.target.value)} required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Sexe</label>
                  <select value={sexe} onChange={(e) => setSexe(e.target.value as "M" | "F")}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                    <option value="M">Masculin</option><option value="F">Féminin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Téléphone</label>
                  <input value={telephone} onChange={(e) => setTelephone(e.target.value)} required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Commune</label>
                  <select value={commune} onChange={(e) => setCommune(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                    {communes.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Formation</label>
                  <select value={formationId} onChange={(e) => setFormationId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                    {formations.map((f) => <option key={f.id} value={f.id}>{f.nom}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Promotion</label>
                  <select value={promotion} onChange={(e) => setPromotion(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                    {ANNEES_PROMOTIONS.map((annee) => (
                      <optgroup key={annee} label={`Année ${annee}`}>
                        {PROMOTIONS_PAR_ANNEE[annee].map((p) => <option key={p} value={p}>{p}</option>)}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Statut</label>
                  <select value={statutApprenant} onChange={(e) => setStatutApprenant(e.target.value as "actif" | "diplome" | "abandon")}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                    <option value="actif">Actif</option><option value="diplome">Diplômé</option><option value="abandon">Abandon</option>
                  </select>
                </div>
              </div>

              {selectedFormation && (
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 text-sm">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Frais de formation</p>
                  <p className="text-slate-700 dark:text-slate-300">
                    {selectedFormation.fraisFormationCDF.toLocaleString()} FC + {selectedFormation.fraisTechniqueUSD}$ frais tech
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  Annuler
                </button>
                <button type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors">
                  {editApprenant ? "Enregistrer" : "Ajouter"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}