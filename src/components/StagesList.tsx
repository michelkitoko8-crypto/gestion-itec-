import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, MagnifyingGlass, Plus, Trash, BuildingOffice, MapPin, CalendarBlank } from "@phosphor-icons/react";
import type { Stage, Apprenant } from "@/types/apprenant";

interface StagesListProps {
  stages: Stage[];
  apprenants: Apprenant[];
  onAdd: (stage: Omit<Stage, "id">) => void;
  onUpdate: (id: string, data: Partial<Stage>) => void;
  onDelete: (id: string) => void;
}

export default function StagesList({ stages, apprenants, onAdd, onUpdate, onDelete }: StagesListProps) {
  const [search, setSearch] = useState("");
  const [statutFilter, setStatutFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ apprenantId: "", entreprise: "", lieu: "", dateDebut: "", dateFin: "", statut: "En cours" as const });

  const getApprenant = (id: string) => apprenants.find((a) => a.id === id);

  const filtered = stages
    .filter((s) => {
      const app = getApprenant(s.apprenantId);
      const q = search.toLowerCase();
      const matchesSearch = app ? `${app.nom} ${app.prenom} ${s.entreprise}`.toLowerCase().includes(q) : true;
      const matchesStatut = statutFilter === "all" || s.statut === statutFilter;
      return matchesSearch && matchesStatut;
    })
    .sort((a, b) => new Date(b.dateDebut).getTime() - new Date(a.dateDebut).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(form);
    setForm({ apprenantId: "", entreprise: "", lieu: "", dateDebut: "", dateFin: "", statut: "En cours" });
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Stages</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stages.length} stage{stages.length !== 1 ? "s" : ""}</p>
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
        <select value={statutFilter} onChange={(e) => setStatutFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
          <option value="all">Tous statuts</option>
          <option value="En cours">En cours</option>
          <option value="Terminé">Terminé</option>
          <option value="Annulé">Annulé</option>
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
              <input required value={form.entreprise} onChange={(e) => setForm({ ...form, entreprise: e.target.value })}
                placeholder="Nom de l'entreprise" className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
              <input value={form.lieu} onChange={(e) => setForm({ ...form, lieu: e.target.value })}
                placeholder="Lieu" className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="date" required value={form.dateDebut} onChange={(e) => setForm({ ...form, dateDebut: e.target.value })}
                className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
              <input type="date" value={form.dateFin} onChange={(e) => setForm({ ...form, dateFin: e.target.value })}
                className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-sm">Annuler</button>
              <button type="submit" className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm">Enregistrer</button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s, i) => {
          const app = getApprenant(s.apprenantId);
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                    <BuildingOffice size={20} className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{s.entreprise}</h3>
                    <p className="text-xs text-slate-400">{app ? `${app.prenom} ${app.nom}` : "Inconnu"}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  s.statut === "En cours" ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700" :
                  s.statut === "Terminé" ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700" :
                  "bg-amber-100 dark:bg-amber-900/40 text-amber-700"
                }`}>{s.statut}</span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <MapPin size={12} />
                  <span>{s.lieu}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CalendarBlank size={12} />
                  <span>{new Date(s.dateDebut).toLocaleDateString("fr-FR")} → {s.dateFin ? new Date(s.dateFin).toLocaleDateString("fr-FR") : "En cours"}</span>
                </div>
              </div>
              <div className="flex justify-end gap-1 mt-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                <button onClick={() => onUpdate(s.id, { statut: s.statut === "En cours" ? "Terminé" : "En cours" })}
                  className="px-2 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                  {s.statut === "En cours" ? "Terminer" : "Réouvrir"}
                </button>
                <button onClick={() => onDelete(s.id)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-red-600 transition-colors">
                  <Trash size={14} />
                </button>
              </div>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full p-8 text-center text-slate-400">
            <GraduationCap size={40} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucun stage trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}