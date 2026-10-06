import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Printer, Users } from "@phosphor-icons/react";
import type { Apprenant, Formation } from "@/types/iteckinshasa";
import { toast } from "sonner";
import { ANNEES_PROMOTIONS, PROMOTIONS_PAR_ANNEE } from "@/constants/initialData";

interface PrintApprenantsModalProps {
  open: boolean;
  onClose: () => void;
  apprenants: Apprenant[];
  formations: Formation[];
  initialFormationId?: string;
}

const STATUT_LABEL: Record<string, string> = {
  actif: "Actif",
  diplome: "Diplômé",
  abandon: "Abandon",
};

export default function PrintApprenantsModal({
  open,
  onClose,
  apprenants,
  formations,
  initialFormationId,
}: PrintApprenantsModalProps) {
  const [formationId, setFormationId] = useState<string>(initialFormationId || "all");
  const [promotionFilter, setPromotionFilter] = useState<string>("all");

  const formation = formations.find((f) => f.id === formationId);

  const filtered = useMemo(() => {
    return apprenants
      .filter((a) => (formationId === "all" || a.formationId === formationId) && (promotionFilter === "all" || a.promotion === promotionFilter))
      .sort((a, b) => `${a.nom} ${a.prenom}`.localeCompare(`${b.nom} ${b.prenom}`));
  }, [apprenants, formationId, promotionFilter]);

  const stats = useMemo(() => {
    const garcons = filtered.filter((a) => a.sexe === "M").length;
    const filles = filtered.filter((a) => a.sexe === "F").length;
    const actifs = filtered.filter((a) => a.statutApprenant === "actif").length;
    const solde = filtered.filter((a) => {
      const f = formations.find((x) => x.id === a.formationId);
      const resteFormation = (f?.fraisFormationCDF || 0) - a.fraisFormationPayerCDF;
      const resteTechnique = (f?.fraisTechniqueUSD || 0) - a.fraisTechniquePayerUSD;
      return resteFormation <= 0 && resteTechnique <= 0;
    }).length;
    return { garcons, filles, actifs, solde };
  }, [filtered, formations]);

  const handlePrint = () => {
    if (filtered.length === 0) {
      toast.error("Aucun apprenant à imprimer pour cette sélection.");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Veuillez autoriser les fenêtres contextuelles pour imprimer.");
      return;
    }

    const titre = formationId === "all" ? "TOUTES LES FILIÈRES" : (formation?.nom || "Filière").toUpperCase();
    const date = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

    const rows = filtered
      .map((a, i) => {
        const f = formations.find((x) => x.id === a.formationId);
        const resteFormation = (f?.fraisFormationCDF || 0) - a.fraisFormationPayerCDF;
        const resteTechnique = (f?.fraisTechniqueUSD || 0) - a.fraisTechniquePayerUSD;
        const soldeOk = resteFormation <= 0 && resteTechnique <= 0;
        return `
          <tr>
            <td style="padding:5px 8px;border:1px solid #d1d5db;text-align:center">${i + 1}</td>
            <td style="padding:5px 8px;border:1px solid #d1d5db;text-align:center">${a.matricule}</td>
            <td style="padding:5px 8px;border:1px solid #d1d5db">${a.nom.toUpperCase()} ${a.postnom ? a.postnom.toUpperCase() : ""} ${a.prenom}</td>
            <td style="padding:5px 8px;border:1px solid #d1d5db;text-align:center">${a.sexe}</td>
            <td style="padding:5px 8px;border:1px solid #d1d5db;text-align:center">${a.promotion}</td>
            <td style="padding:5px 8px;border:1px solid #d1d5db;text-align:center">${STATUT_LABEL[a.statutApprenant] || a.statutApprenant}</td>
            <td style="padding:5px 8px;border:1px solid #d1d5db;text-align:center">${soldeOk ? "Soldé" : "Reste dû"}</td>
          </tr>`;
      })
      .join("");

    printWindow.document.write(`
      <html>
      <head>
        <title>Liste des apprenants - ITEC KINSHASA</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #1f2937; padding: 24px; }
          .page { max-width: 794px; margin: 0 auto; }
          .header { display: flex; align-items: center; gap: 14px; border-bottom: 3px solid #059669; padding-bottom: 12px; margin-bottom: 16px; }
          .logo { width: 56px; height: 56px; border-radius: 50%; background: #059669; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; flex-shrink: 0; }
          .header h1 { font-size: 20px; letter-spacing: 0.5px; color: #059669; }
          .header p { font-size: 10px; color: #6b7280; margin-top: 2px; }
          .doc-title { text-align: center; font-size: 13px; font-weight: bold; text-decoration: underline; margin-bottom: 12px; }
          .meta { display: flex; justify-content: space-between; font-size: 10px; color: #6b7280; margin-bottom: 12px; }
          table { width: 100%; border-collapse: collapse; }
          th { background: #059669; color: white; padding: 6px 8px; border: 1px solid #059669; font-size: 10px; text-transform: uppercase; }
          td { border: 1px solid #d1d5db; }
          .stats { display: flex; gap: 12px; margin-top: 12px; font-size: 10px; color: #4b5563; }
          .stats span { padding: 5px 10px; border: 1px solid #d1d5db; border-radius: 4px; }
          .sig { display: flex; justify-content: space-between; margin-top: 40px; font-size: 10px; color: #4b5563; }
          .sig div { text-align: center; }
          .sig .line { border-top: 1px solid #6b7280; margin-top: 32px; padding-top: 4px; width: 180px; }
          .footer { margin-top: 16px; text-align: center; font-size: 9px; color: #9ca3af; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="header">
            <div class="logo">ITEC</div>
            <div>
              <h1>ITEC KINSHASA</h1>
              <p>Institut Technique de Formation Professionnelle et Continue</p>
              <p>Avenue de la Paix n°45, Commune de la Gombe, Kinshasa / RDC</p>
            </div>
          </div>
          <div class="doc-title">LISTE OFFICIELLE DES APPRENANTS - ${titre}</div>
          <div class="meta">
            <span>Date d'édition : ${date}</span>
            <span>Effectif : ${filtered.length} apprenant(s)</span>
          </div>
          <table>
            <thead>
              <tr>
                <th style="width:28px">N°</th>
                <th style="width:70px">Matricule</th>
                <th>Noms et Post-noms</th>
                <th style="width:30px">Sexe</th>
                <th style="width:110px">Promotion</th>
                <th style="width:60px">Statut</th>
                <th style="width:60px">Paiement</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <div class="stats">
            <span>Garçons : <strong>${stats.garcons}</strong></span>
            <span>Filles : <strong>${stats.filles}</strong></span>
            <span>Actifs : <strong>${stats.actifs}</strong></span>
            <span>Soldes : <strong>${stats.solde}</strong></span>
          </div>
          <div class="sig">
            <div><div class="line">Le Directeur</div></div>
            <div><div class="line">Le Secrétaire de la Formation</div></div>
          </div>
          <div class="footer">Document généré par ITEC Kinshasa - ${date}</div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

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
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Imprimer la liste par filière</h2>
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Filière / Formation</label>
                  <select
                    value={formationId}
                    onChange={(e) => setFormationId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="all">Toutes les filières</option>
                    {formations.map((f) => (
                      <option key={f.id} value={f.id}>{f.nom}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Promotion</label>
                  <select
                    value={promotionFilter}
                    onChange={(e) => setPromotionFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="all">Toutes promotions</option>
                    {ANNEES_PROMOTIONS.map((annee) => (
                      <optgroup key={annee} label={`Année ${annee}`}>
                        {PROMOTIONS_PAR_ANNEE[annee].map((p) => <option key={p} value={p}>{p}</option>)}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/40">
                <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                  {formationId === "all" ? "Toutes les filières" : formation?.nom}
                </p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <p className="text-lg font-bold text-emerald-600">{filtered.length}</p>
                    <p className="text-xs text-slate-500">Effectif</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <p className="text-lg font-bold text-indigo-600">{stats.garcons} / {stats.filles}</p>
                    <p className="text-xs text-slate-500">G / F</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <p className="text-lg font-bold text-amber-600">{stats.solde}</p>
                    <p className="text-xs text-slate-500">Soldés</p>
                  </div>
                </div>
              </div>

              {filtered.length > 0 && (
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-700/40 border-b border-slate-200 dark:border-slate-700">
                    <Users size={14} className="text-slate-400" />
                    <p className="text-xs font-medium text-slate-500">Aperçu de la liste ({filtered.length})</p>
                  </div>
                  <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
                    {filtered.slice(0, 40).map((a) => (
                      <div key={a.id} className="flex items-center justify-between px-4 py-2 text-sm">
                        <span className="text-slate-700 dark:text-slate-300 truncate pr-3">
                          <span className="font-mono text-xs text-slate-400 mr-2">{a.matricule}</span>
                          {a.nom} {a.prenom}
                        </span>
                        <span className="text-xs text-slate-400 shrink-0">{a.sexe}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filtered.length === 0 && (
                <div className="p-8 text-center text-slate-400">
                  <p className="text-sm">Aucun apprenant pour cette filière</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handlePrint}
                disabled={filtered.length === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium transition-colors"
              >
                <Printer size={18} />
                Imprimer / Exporter PDF
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}