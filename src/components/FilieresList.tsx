import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpenText, Plus, PencilSimple, Trash, Users } from "@phosphor-icons/react";
import type { Filiere, Apprenant } from "@/types/apprenant";

interface FilieresListProps {
  filieres: Filiere[];
  apprenants: Apprenant[];
  onAdd: (filiere: Omit<Filiere, "id">) => void;
  onUpdate: (id: string, data: Partial<Filiere>) => void;
  onDelete: (id: string) => void;
}

const defaultColors = ["#059669", "#6366f1", "#d97706", "#dc2626", "#0891b2", "#7c3aed", "#db2777", "#65a30d"];

export default function FilieresList({ filieres, apprenants, onAdd, onUpdate, onDelete }: FilieresListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ nom: "", description: "", duree: "2 ans", couleur: "#059669" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      onUpdate(editId, form);
    } else {
      onAdd(form);
    }
    setForm({ nom: "", description: "", duree: "2 ans", couleur: "#059669" });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (f: Filiere) => {
    setForm({ nom: f.nom, description: f.description || "", duree: f.duree || "2 ans", couleur: f.couleur });
    setEditId(f.id);
    setShowForm(true);
  };

  const durees = ["1 an", "2 ans", "3 ans", "6 mois"];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Filières</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{filieres.length} filières</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ nom: "", description: "", duree: "2 ans", couleur: "#059669" }); }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={18} />
          Ajouter
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nom</label>
                <input required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" placeholder="Nom de la filière" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Durée</label>
                <select value={form.duree} onChange={(e) => setForm({ ...form, duree: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
                  {durees.map((d) => (<option key={d} value={d}>{d}</option>))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm resize-none" placeholder="Description" />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Couleur</label>
              <div className="flex gap-1.5">
                {defaultColors.map((c) => (
                  <button key={c} type="button" onClick={() => setForm({ ...form, couleur: c })}
                    className={`w-6 h-6 rounded-full border-2 ${form.couleur === c ? "border-slate-900 dark:border-white" : "border-transparent"}`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => { setShowForm(false); setEditId(null); }}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-sm">Annuler</button>
              <button type="submit" className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm">{editId ? "Modifier" : "Ajouter"}</button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filieres.map((f, i) => {
          const count = apprenants.filter((a) => a.filiereId === f.id).length;
          return (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${f.couleur}20` }}>
                    <BookOpenText size={20} style={{ color: f.couleur }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{f.nom}</h3>
                    <p className="text-xs text-slate-400">{f.duree}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(f)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-600">
                    <PencilSimple size={14} />
                  </button>
                  <button onClick={() => onDelete(f.id)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-red-600">
                    <Trash size={14} />
                  </button>
                </div>
              </div>
              {f.description && <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{f.description}</p>}
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Users size={16} />
                <span>{count} apprenant{count !== 1 ? "s" : ""}</span>
              </div>
            </motion.div>
          );
        })}
        {filieres.length === 0 && (
          <div className="col-span-full p-8 text-center text-slate-400">
            <BookOpenText size={40} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucune filière créée</p>
          </div>
        )}
      </div>
    </div>
  );
}