import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlass, UserPlus, Trash, PencilSimple, UserCircle, CaretDown, CaretUp, Eye, Printer, Check, X, FileText } from "@phosphor-icons/react";
import { toast } from "sonner";
import type { Apprenant, Formation } from "@/types/iteckinshasa";
import { getFormation } from "@/services/storage";
import { ANNEES_PROMOTIONS, PROMOTIONS_PAR_ANNEE } from "@/constants/initialData";
import ApprenantModal from "./ApprenantModal";
import PaiementModal from "./PaiementModal";
import ReceiptModal from "./ReceiptModal";
import PrintApprenantsModal from "./PrintApprenantsModal";

interface QuickEditForm {
  nom: string;
  postnom: string;
  prenom: string;
  matricule: string;
}

function QuickEditModal({ apprenant, onClose, onSave }: { apprenant: Apprenant; onClose: () => void; onSave: (data: Partial<Apprenant>) => void; }) {
  const [form, setForm] = useState<QuickEditForm>(() => ({
    nom: apprenant.nom,
    postnom: apprenant.postnom || "",
    prenom: apprenant.prenom,
    matricule: apprenant.matricule,
  }));
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    const nom = form.nom.trim();
    const prenom = form.prenom.trim();
    const matricule = form.matricule.trim();
    if (!nom || !prenom) {
      setError("Le nom et le prénom sont obligatoires.");
      return;
    }
    if (!matricule) {
      setError("Le matricule est obligatoire.");
      return;
    }
    onSave({ nom, postnom: form.postnom.trim(), prenom, matricule });
    toast.success("Informations corrigées avec succès");
  };

  const field = (label: string, value: string, key: keyof QuickEditForm, placeholder: string) => (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
      />
    </div>
  );

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
          className="w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Corriger les informations</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{apprenant.matricule} - {apprenant.prenom} {apprenant.nom}</p>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400">
              <X size={20} />
            </button>
          </div>
          <div className="p-6 space-y-4">
            {field("Nom", form.nom, "nom", "Ex : KABANGE")}
            {field("Post-nom", form.postnom, "postnom", "Ex : MUKENDI")}
            {field("Prénom", form.prenom, "prenom", "Ex : Jean")}
            {field("Matricule", form.matricule, "matricule", "Ex : ITEC-2024-001")}
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          </div>
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
            >
              <Check size={18} />
              Enregistrer
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

interface ApprenantsListProps {
  apprenants: Apprenant[];
  formations: Formation[];
  onAdd: (apprenant: Omit<Apprenant, "id">) => void;
  onUpdate: (id: string, data: Partial<Apprenant>) => void;
  onDelete: (id: string) => void;
  onSelect: (apprenant: Apprenant) => void;
  printFormationId?: string;
  onOpenPrint?: (formationId?: string) => void;
}

export default function ApprenantsList({ apprenants, formations, onAdd, onUpdate, onDelete, onSelect, printFormationId, onOpenPrint }: ApprenantsListProps) {
  const [search, setSearch] = useState("");
  const [formationFilter, setFormationFilter] = useState("all");
  const [statutFilter, setStatutFilter] = useState("all");
  const [promotionFilter, setPromotionFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editApprenant, setEditApprenant] = useState<Apprenant | null>(null);
  const [quickEdit, setQuickEdit] = useState<Apprenant | null>(null);
  const [paiementModal, setPaiementModal] = useState<Apprenant | null>(null);
  const [receiptModal, setReceiptModal] = useState<Apprenant | null>(null);
  const [printModal, setPrintModal] = useState(false);
  const [sortField, setSortField] = useState<keyof Apprenant>("nom");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    if (printFormationId) {
      setFormationFilter(printFormationId);
      setPrintModal(true);
      onOpenPrint?.(printFormationId);
    }
  }, [printFormationId, onOpenPrint]);

  const filtered = apprenants
    .filter((a) => {
      const q = search.toLowerCase();
      const formation = getFormation(a.formationId);
      const formationNom = formation?.nom || a.formationId;
      const matchesSearch = `${a.nom} ${a.postnom} ${a.prenom} ${a.matricule} ${formationNom}`.toLowerCase().includes(q);
      const matchesFormation = formationFilter === "all" || a.formationId === formationFilter;
      const matchesStatut = statutFilter === "all" || a.statutApprenant === statutFilter;
      const matchesPromotion = promotionFilter === "all" || a.promotion === promotionFilter;
      return matchesSearch && matchesFormation && matchesStatut && matchesPromotion;
    })
    .sort((a, b) => {
      const aVal = String(a[sortField] || "");
      const bVal = String(b[sortField] || "");
      return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

  const handleSort = (field: keyof Apprenant) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const handleEdit = (app: Apprenant) => {
    setEditApprenant(app);
    setModalOpen(true);
  };

  const handleSave = (data: Omit<Apprenant, "id">) => {
    if (editApprenant) onUpdate(editApprenant.id, data);
    else onAdd(data);
    setEditApprenant(null);
  };

  const statuts = ["actif", "diplome", "abandon"];
  const formationMap = Object.fromEntries(formations.map((f) => [f.id, f]));

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortDir === "asc" ? <CaretUp size={12} className="inline" /> : <CaretDown size={12} className="inline" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Apprenants</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{apprenants.length} inscrits</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPrintModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors"
          >
            <FileText size={18} className="text-emerald-600 dark:text-emerald-400" />
            Imprimer
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <UserPlus size={18} />
            Ajouter
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="Rechercher un apprenant..."
          />
        </div>
        <select
          value={formationFilter}
          onChange={(e) => setFormationFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
        >
          <option value="all">Toutes formations</option>
          {formations.map((f) => <option key={f.id} value={f.id}>{f.nom}</option>)}
        </select>
        <select
          value={promotionFilter}
          onChange={(e) => setPromotionFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
        >
          <option value="all">Toutes promotions</option>
          {ANNEES_PROMOTIONS.map((annee) => (
            <optgroup key={annee} label={`Année ${annee}`}>
              {PROMOTIONS_PAR_ANNEE[annee].map((p) => <option key={p} value={p}>{p}</option>)}
            </optgroup>
          ))}
        </select>
        <select
          value={statutFilter}
          onChange={(e) => setStatutFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
        >
          <option value="all">Tous statuts</option>
          {statuts.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("matricule")}>
                  Matricule <SortIcon field="matricule" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("nom")}>
                  Apprenant <SortIcon field="nom" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("formationId")}>
                  Formation <SortIcon field="formationId" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("statutApprenant")}>
                  Statut <SortIcon field="statutApprenant" />
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Solde</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filtered.map((app, i) => {
                const formation = formationMap[app.formationId];
                const totalFormation = formation?.fraisFormationCDF || 0;
                const totalTechnique = formation?.fraisTechniqueUSD || 0;
                const resteFormation = totalFormation - app.fraisFormationPayerCDF;
                const resteTechnique = totalTechnique - app.fraisTechniquePayerUSD;
                return (
                  <motion.tr
                    key={app.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer"
                    onClick={() => onSelect(app)}
                  >
                    <td className="px-4 py-3 text-sm font-mono text-slate-500 dark:text-slate-400">{app.matricule}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-700 dark:text-emerald-300 text-sm font-bold shrink-0">
                          {app.prenom[0]}{app.nom[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{app.prenom} {app.nom} {app.postnom}</p>
                          <p className="text-xs text-slate-400 truncate">{app.commune} — {app.telephone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-600 dark:text-slate-400">{formation?.nom || app.formationId}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        app.statutApprenant === "actif" ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300" :
                        app.statutApprenant === "diplome" ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300" :
                        "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                      }`}>{app.statutApprenant}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {resteFormation > 0 || resteTechnique > 0 ? (
                        <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                          {resteFormation > 0 ? `${resteFormation.toLocaleString()} FC` : ""}
                          {resteFormation > 0 && resteTechnique > 0 ? " / " : ""}
                          {resteTechnique > 0 ? `$${resteTechnique}` : ""}
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-emerald-600">Soldé</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setQuickEdit(app)}
                          className="p-1.5 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-slate-400 hover:text-emerald-600 transition-colors" title="Corriger les informations / noms">
                          <PencilSimple size={16} />
                        </button>
                        <button onClick={() => { setEditApprenant(app); setModalOpen(true); }}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-600 transition-colors" title="Modifier (détails complets)">
                          <UserCircle size={16} />
                        </button>
                        <button onClick={() => setPaiementModal(app)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-emerald-600 transition-colors" title="Paiement">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => setReceiptModal(app)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-amber-600 transition-colors" title="Reçu">
                          <Printer size={16} />
                        </button>
                        <button onClick={() => onDelete(app.id)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-red-600 transition-colors" title="Supprimer">
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-400">
            <UserCircle size={40} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucun apprenant trouvé</p>
          </div>
        )}
      </div>

      <ApprenantModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditApprenant(null); }}
        onSave={handleSave}
        editApprenant={editApprenant}
        formations={formations}
      />

      {quickEdit && (
        <QuickEditModal
          apprenant={quickEdit}
          onClose={() => setQuickEdit(null)}
          onSave={(data) => {
            onUpdate(quickEdit.id, data);
            setQuickEdit(null);
          }}
        />
      )}

      <PrintApprenantsModal
        open={printModal}
        onClose={() => setPrintModal(false)}
        apprenants={apprenants}
        formations={formations}
        initialFormationId={formationFilter !== "all" ? formationFilter : undefined}
      />

      {paiementModal && (
        <PaiementModal
          apprenant={paiementModal}
          formations={formations}
          onClose={() => setPaiementModal(null)}
        />
      )}

      {receiptModal && (
        <ReceiptModal
          apprenant={receiptModal}
          onClose={() => setReceiptModal(null)}
        />
      )}
    </div>
  );
}