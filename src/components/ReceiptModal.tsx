import { motion, AnimatePresence } from "framer-motion";
import { X, Printer } from "@phosphor-icons/react";
import type { Apprenant } from "@/types/iteckinshasa";
import { getFormation, getPaiements } from "@/services/storage";

interface ReceiptModalProps {
  apprenant: Apprenant;
  onClose: () => void;
}

export default function ReceiptModal({ apprenant, onClose }: ReceiptModalProps) {
  const formation = getFormation(apprenant.formationId);
  const paiements = getPaiements(apprenant.id);
  const lastPaiement = paiements.length > 0 ? paiements[paiements.length - 1] : null;

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const paiementRows = paiements.map((p) => `
      <tr>
        <td style="padding:4px 8px;border:1px solid #ddd;text-align:center">${p.datePaiement}</td>
        <td style="padding:4px 8px;border:1px solid #ddd;text-align:center">${p.modePaiement}</td>
        <td style="padding:4px 8px;border:1px solid #ddd;text-align:right">${p.montantCDF > 0 ? p.montantCDF.toLocaleString() + " FC" : "-"}</td>
        <td style="padding:4px 8px;border:1px solid #ddd;text-align:right">${p.montantUSD > 0 ? "$" + p.montantUSD : "-"}</td>
        <td style="padding:4px 8px;border:1px solid #ddd;text-align:center">${p.recuNumero}</td>
      </tr>
    `).join("");

    const totalFormation = formation?.fraisFormationCDF || 0;
    const totalTechnique = formation?.fraisTechniqueUSD || 0;
    const resteFormation = totalFormation - apprenant.fraisFormationPayerCDF;
    const resteTechnique = totalTechnique - apprenant.fraisTechniquePayerUSD;

    printWindow.document.write(`
      <html>
      <head>
        <title>Reçu ITEC KINSHASA - ${apprenant.prenom} ${apprenant.nom}</title>
        <style>
          body { font-family: 'Courier New', monospace; font-size: 12px; padding: 20px; color: #333; }
          .header { text-align: center; border-bottom: 2px solid #059669; padding-bottom: 10px; margin-bottom: 15px; }
          .header h1 { margin: 0; font-size: 18px; color: #059669; }
          .header p { margin: 2px 0; font-size: 11px; }
          .info { margin-bottom: 15px; }
          .info table { width: 100%; }
          .info td { padding: 2px 5px; font-size: 11px; }
          table { width: 100%; border-collapse: collapse; }
          th { background: #059669; color: white; padding: 6px 8px; font-size: 11px; }
          td { padding: 4px 8px; font-size: 11px; }
          .total { margin-top: 15px; border-top: 2px solid #059669; padding-top: 10px; }
          .footer { text-align: center; margin-top: 20px; font-size: 10px; color: #888; border-top: 1px dashed #ccc; padding-top: 10px; }
          .badge { display: inline-block; padding: 3px 8px; border-radius: 3px; font-size: 10px; }
          .badge-green { background: #d1fae5; color: #059669; }
          .badge-red { background: #fee2e2; color: #dc2626; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>ITEC KINSHASA</h1>
          <p>Institut Technique de Formation Professionnelle</p>
          <p>Réf: ${lastPaiement?.recuNumero || "N/A"} | ${new Date().toLocaleDateString("fr-FR")}</p>
        </div>

        <div class="info">
          <table>
            <tr><td><strong>Apprenant:</strong></td><td>${apprenant.prenom} ${apprenant.nom} ${apprenant.postnom}</td></tr>
            <tr><td><strong>Matricule:</strong></td><td>${apprenant.matricule}</td></tr>
            <tr><td><strong>Formation:</strong></td><td>${formation?.nom || apprenant.formationId}</td></tr>
            <tr><td><strong>Promotion:</strong></td><td>${apprenant.promotion}</td></tr>
            <tr><td><strong>Statut:</strong></td><td>${apprenant.statutApprenant}</td></tr>
          </table>
        </div>

        <h3 style="margin:10px 0 5px;font-size:12px;color:#059669;">Historique des paiements</h3>
        <table>
          <thead>
            <tr><th>Date</th><th>Mode</th><th>Formation (CDF)</th><th>Technique (USD)</th><th>N° Reçu</th></tr>
          </thead>
          <tbody>
            ${paiementRows || "<tr><td colspan='5' style='text-align:center;padding:10px;color:#999'>Aucun paiement</td></tr>"}
          </tbody>
        </table>

        <div class="total">
          <table>
            <tr>
              <td><strong>Frais Formation:</strong> ${totalFormation.toLocaleString()} FC</td>
              <td><strong>Payé:</strong> ${apprenant.fraisFormationPayerCDF.toLocaleString()} FC</td>
              <td><strong>Reste:</strong> <span class="${resteFormation > 0 ? 'badge badge-red' : 'badge badge-green'}">${resteFormation > 0 ? resteFormation.toLocaleString() + " FC" : "Soldé"}</span></td>
            </tr>
            <tr>
              <td><strong>Frais Technique:</strong> $${totalTechnique}</td>
              <td><strong>Payé:</strong> $${apprenant.fraisTechniquePayerUSD}</td>
              <td><strong>Reste:</strong> <span class="${resteTechnique > 0 ? 'badge badge-red' : 'badge badge-green'}">${resteTechnique > 0 ? "$" + resteTechnique : "Soldé"}</span></td>
            </tr>
          </table>
        </div>

        <div class="footer">
          <p>ITEC KINSHASA — Kinshasa, RDC</p>
          <p>Tel / WhatsApp : +243 818 741 094</p>
          <p>Document généré le ${new Date().toLocaleString("fr-FR")}</p>
          <p>Merci de votre confiance</p>
        </div>
        <script>
          window.onload = function() { window.print(); window.close(); }
        <\\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const totalFormation = formation?.fraisFormationCDF || 0;
  const totalTechnique = formation?.fraisTechniqueUSD || 0;
  const resteFormation = totalFormation - apprenant.fraisFormationPayerCDF;
  const resteTechnique = totalTechnique - apprenant.fraisTechniquePayerUSD;

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
          className="w-full max-w-2xl rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Reçu de paiement</h2>
            <div className="flex items-center gap-2">
              <button onClick={handlePrint}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors">
                <Printer size={16} /> Imprimer
              </button>
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"><X size={20} /></button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="text-center border-b border-emerald-200 dark:border-emerald-800 pb-4">
              <h3 className="text-xl font-bold text-emerald-600">ITEC KINSHASA</h3>
              <p className="text-xs text-slate-400">Institut Technique de Formation Professionnelle</p>
              {lastPaiement && <p className="text-xs text-slate-500 mt-1">Réf: {lastPaiement.recuNumero} | {new Date().toLocaleDateString("fr-FR")}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-slate-400">Apprenant</p>
                <p className="font-medium text-slate-900 dark:text-white">{apprenant.prenom} {apprenant.nom} {apprenant.postnom}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Matricule</p>
                <p className="font-medium text-slate-900 dark:text-white">{apprenant.matricule}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Formation</p>
                <p className="font-medium text-slate-900 dark:text-white">{formation?.nom || apprenant.formationId}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Promotion</p>
                <p className="font-medium text-slate-900 dark:text-white">{apprenant.promotion}</p>
              </div>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-emerald-600 text-white">
                    <th className="px-3 py-2 text-left text-xs font-medium">Date</th>
                    <th className="px-3 py-2 text-left text-xs font-medium">Mode</th>
                    <th className="px-3 py-2 text-right text-xs font-medium">Formation (CDF)</th>
                    <th className="px-3 py-2 text-right text-xs font-medium">Technique (USD)</th>
                    <th className="px-3 py-2 text-center text-xs font-medium">N° Reçu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {paiements.length === 0 ? (
                    <tr><td colSpan={5} className="px-3 py-6 text-center text-slate-400 text-xs">Aucun paiement</td></tr>
                  ) : paiements.slice().reverse().map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400">{p.datePaiement}</td>
                      <td className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400">{p.modePaiement}</td>
                      <td className="px-3 py-2 text-xs text-right font-mono text-slate-700 dark:text-slate-300">{p.montantCDF > 0 ? p.montantCDF.toLocaleString() + " FC" : "-"}</td>
                      <td className="px-3 py-2 text-xs text-right font-mono text-slate-700 dark:text-slate-300">{p.montantUSD > 0 ? "$" + p.montantUSD : "-"}</td>
                      <td className="px-3 py-2 text-xs text-center font-mono text-slate-500">{p.recuNumero}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30">
              <div>
                <p className="text-xs text-slate-400">Frais Formation</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{totalFormation.toLocaleString()} FC</p>
                <p className="text-xs">Payé: <span className="font-medium text-emerald-600">{apprenant.fraisFormationPayerCDF.toLocaleString()} FC</span></p>
                <p className="text-xs">Reste: <span className={`font-medium ${resteFormation > 0 ? "text-amber-600" : "text-emerald-600"}`}>{resteFormation > 0 ? resteFormation.toLocaleString() + " FC" : "Soldé ✓"}</span></p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Frais Technique</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">${totalTechnique}</p>
                <p className="text-xs">Payé: <span className="font-medium text-emerald-600">${apprenant.fraisTechniquePayerUSD}</span></p>
                <p className="text-xs">Reste: <span className={`font-medium ${resteTechnique > 0 ? "text-amber-600" : "text-emerald-600"}`}>{resteTechnique > 0 ? "$" + resteTechnique : "Soldé ✓"}</span></p>
              </div>
            </div>

            <div className="text-center text-xs text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-4">
              <p>ITEC KINSHASA — Kinshasa, RDC</p>
              <p className="font-medium text-emerald-600 dark:text-emerald-400">Tel / WhatsApp : +243 818 741 094</p>
              <p>Merci de votre confiance</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}