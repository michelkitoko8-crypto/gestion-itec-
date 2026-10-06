import { useState } from "react";
import { motion } from "framer-motion";
import { ClockCountdown, MagnifyingGlass, Funnel, CalendarBlank, CheckCircle, XCircle, PencilSimple, Trash, Plus } from "@phosphor-icons/react";
import type { Absence, Apprenant } from "@/types/apprenant";

interface AbsencesListProps {
  absences: Absence[];
  apprenants: Apprenant[];
  onAdd: (absence: Omit<Absence, "id">) => void;
  onUpdate: (id: string, data: Partial<Absence>) => void;
  onDelete: (id: string) => void;
}

export default function AbsencesList({ absences, apprenants, onAdd, onUpdate, onDelete }: AbsencesListProps) {
  const [search, setSearch] = useState("");
  const [filterJustifiee, setFilterJustifiee] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ apprenantId: "", date: "", motif: "", justifiee: false });

  const getApprenant = (id: string) => apprenants.find((a) => a.id === id);

  const filtered = absences
    .filter((a) => {
      const app = getApprenant(a.apprenantId);
      const q = search.toLowerCase();
      const matchesSearch = app ? `${app.nom} ${app.prenom}`.toLowerCase().includes(q) : true;
      const matchesJustifiee = filterJustifiee === "all" || (filterJustifiee === "justifiee" && a.justifiee) || (filterJustifiee === "non" && !a.justifiee);
      return matchesSearch && matchesJustifiee;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(form);
    setForm({ apprenantId: "", date: "", motif: "", justifiee: false });
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Absences</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{absences.length} absence{absences.length !== 1 ? "s" : ""} enregistrée{absences.length !== 1 ? "s" : ""}</p>
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
            placeholder="Rechercher par apprenant..." />
        </div>
        <select value={filterJustifiee} onChange={(e) => setFilterJustifiee(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
          <option value="all">Toutes</option>
          <option value="justifiee">Justifiées</option>
          <option value="non">Non justifiées</option>
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
            <div className="grid grid-cols-2 gap-3">
              <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.justifiee} onChange={(e) => setForm({ ...form, justifiee: e.target.checked })}
                  className="rounded border-slate-300" />
                Justifiée
              </label>
            </div>
            <input value={form.motif} onChange={(e) => setForm({ ...form, motif: e.target.value })}
              placeholder="Motif de l'absence" className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
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
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Motif</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Statut</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filtered.map((abs, i) => {
                const app = getApprenant(abs.apprenantId);
                return (
                  <motion.tr key={abs.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-700 dark:text-emerald-300 text-sm font-bold">
                          {app ? `${app.prenom[0]}${app.nom[0]}` : "?"}
                        </div>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{app ? `${app.prenom} ${app.nom}` : "Inconnu"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <CalendarBlank size={14} />
                        {new Date(abs.date).toLocaleDateString("fr-FR")}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{abs.motif || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        abs.justifiee ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700" : "bg-amber-100 dark:bg-amber-900/40 text-amber-700"
                      }`}>
                        {abs.justifiee ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {abs.justifiee ? "Justifiée" : "Non justifiée"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => onUpdate(abs.id, { justifiee: !abs.justifiee })}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-600 transition-colors" title="Basculer statut">
                          <PencilSimple size={14} />
                        </button>
                        <button onClick={() => onDelete(abs.id)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-red-600 transition-colors" title="Supprimer">
                          <Trash size={14} />
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
            <ClockCountdown size={40} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucune absence trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
}