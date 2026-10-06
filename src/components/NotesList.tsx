import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, MagnifyingGlass, Plus, Trash } from "@phosphor-icons/react";
import type { Note, Apprenant, Filiere } from "@/types/apprenant";

interface NotesListProps {
  notes: Note[];
  apprenants: Apprenant[];
  filieres: Filiere[];
  onAdd: (note: Omit<Note, "id">) => void;
  onDelete: (id: string) => void;
}

export default function NotesList({ notes, apprenants, filieres, onAdd, onDelete }: NotesListProps) {
  const [search, setSearch] = useState("");
  const [filiereFilter, setFiliereFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ apprenantId: "", matiere: "", note: 0, coeff: 1, date: "" });

  const getApprenant = (id: string) => apprenants.find((a) => a.id === id);

  const filtered = notes
    .filter((n) => {
      const app = getApprenant(n.apprenantId);
      const q = search.toLowerCase();
      const matchesSearch = app ? `${app.nom} ${app.prenom} ${n.matiere}`.toLowerCase().includes(q) : true;
      const matchesFiliere = filiereFilter === "all" || (app?.filiereId === filiereFilter);
      return matchesSearch && matchesFiliere;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(form);
    setForm({ apprenantId: "", matiere: "", note: 0, coeff: 1, date: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notes</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{notes.length} note{notes.length !== 1 ? "s" : ""} enregistrée{notes.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={18} />
          Ajouter
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="Rechercher..." />
        </div>
        <select value={filiereFilter} onChange={(e) => setFiliereFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
          <option value="all">Toutes filières</option>
          {filieres.map((f) => (<option key={f.id} value={f.id}>{f.nom}</option>))}
        </select>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <form onSubmit={handleSubmit} className="space-y-3">
            <select required value={form.apprenantId} onChange={(e) => setForm({ ...form, apprenantId: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
              <option value="">Sélectionner un apprenant</option>
              {apprenants.filter((a) => a.statut === "Actif" || a.statut === "En stage").map((a) => (
                <option key={a.id} value={a.id}>{a.prenom} {a.nom} - {a.filiere}</option>
              ))}
            </select>
            <div className="grid grid-cols-3 gap-3">
              <input required value={form.matiere} onChange={(e) => setForm({ ...form, matiere: e.target.value })}
                placeholder="Matière" className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
              <input type="number" min={0} max={20} step={0.5} required value={form.note || ""} onChange={(e) => setForm({ ...form, note: parseFloat(e.target.value) || 0 })}
                placeholder="Note /20" className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
              <input type="number" min={1} max={5} value={form.coeff} onChange={(e) => setForm({ ...form, coeff: parseInt(e.target.value) || 1 })}
                placeholder="Coeff" className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
            </div>
            <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-sm">Annuler</button>
              <button type="submit" className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm">Enregistrer</button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Apprenant</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Matière</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Note</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Coeff</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filtered.map((n, i) => {
                const app = getApprenant(n.apprenantId);
                return (
                  <motion.tr key={n.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{app ? `${app.prenom} ${app.nom}` : "Inconnu"}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{n.matiere}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-bold px-2 py-0.5 rounded ${n.note >= 14 ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700" : n.note >= 10 ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700" : "bg-red-100 dark:bg-red-900/40 text-red-700"}`}>
                        {n.note}/20
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{n.coeff}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{new Date(n.date).toLocaleDateString("fr-FR")}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => onDelete(n.id)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-red-600 transition-colors">
                        <Trash size={14} />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-400">
            <CheckCircle size={40} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucune note trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
}