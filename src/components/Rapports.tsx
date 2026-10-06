import { motion } from "framer-motion";
import { ChartBar, ChartLine, Users, GraduationCap, ClockCountdown, CheckCircle, UserCheck, UserMinus } from "@phosphor-icons/react";
import type { Apprenant, Filiere, Absence, Note, Stage } from "@/types/apprenant";

interface RapportsProps {
  apprenants: Apprenant[];
  filieres: Filiere[];
  absences: Absence[];
  notes: Note[];
  stages: Stage[];
}

export default function Rapports({ apprenants, filieres, absences, notes, stages }: RapportsProps) {
  const total = apprenants.length;
  const actifs = apprenants.filter((a) => a.statut === "Actif").length;
  const enStage = apprenants.filter((a) => a.statut === "En stage").length;
  const diplomes = apprenants.filter((a) => a.statut === "Diplômé").length;
  const abandons = apprenants.filter((a) => a.statut === "Abandon").length;

  const absencesNonJustifiees = absences.filter((a) => !a.justifiee).length;
  const tauxAbsent = total > 0 ? Math.round((absencesNonJustifiees / (total * 30)) * 100) : 0;

  const statsFiliere = filieres.map((f) => {
    const apps = apprenants.filter((a) => a.filiereId === f.id);
    const notesFiliere = notes.filter((n) => apps.some((a) => a.id === n.apprenantId));
    const moyenne = notesFiliere.length > 0
      ? Math.round((notesFiliere.reduce((sum, n) => sum + n.note, 0) / notesFiliere.length) * 10) / 10
      : null;
    return { ...f, count: apps.length, moyenne };
  });

  const reussite = notes.length > 0
    ? Math.round((notes.filter((n) => n.note >= 10).length / notes.length) * 100)
    : 0;

  const cardClass = "p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Rapports & Statistiques</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Vue d'ensemble du centre de formation</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { label: "Total", value: total, icon: Users, color: "text-slate-600", bg: "bg-slate-100 dark:bg-slate-700" },
          { label: "Actifs", value: actifs, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/40" },
          { label: "En stage", value: enStage, icon: GraduationCap, color: "text-indigo-600", bg: "bg-indigo-100 dark:bg-indigo-900/40" },
          { label: "Diplômés", value: diplomes, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/40" },
          { label: "Abandons", value: abandons, icon: UserMinus, color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/40" },
          { label: "Taux abs.", value: `${tauxAbsent}%`, icon: ClockCountdown, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/40" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cardClass}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-lg ${stat.bg}`}>
                <stat.icon size={16} className={stat.color} />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-4">
            <ChartBar size={18} className="text-emerald-600" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Répartition par filière</h3>
          </div>
          <div className="space-y-3">
            {statsFiliere.map((f) => {
              const pct = total > 0 ? Math.round((f.count / total) * 100) : 0;
              return (
                <div key={f.id}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-slate-700 dark:text-slate-300">{f.nom}</span>
                    <span className="text-slate-500">{f.count} apprenants{f.moyenne !== null ? ` · Moy. ${f.moyenne}/20` : ""}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: f.couleur }}
                    />
                  </div>
                </div>
              );
            })}
            {statsFiliere.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">Aucune filière</p>
            )}
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-4">
            <ChartLine size={18} className="text-indigo-600" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Indicateurs clés</h3>
          </div>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Taux de réussite</span>
                <span className="text-lg font-bold text-emerald-600">{reussite}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-600 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${reussite}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full bg-emerald-500"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">{notes.filter((n) => n.note >= 10).length} notes sur {notes.length} au-dessus de 10/20</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                <p className="text-xs text-slate-400 mb-1">Absences totales</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{absences.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                <p className="text-xs text-slate-400 mb-1">Stages en cours</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{stages.filter((s) => s.statut === "En cours").length}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                <p className="text-xs text-slate-400 mb-1">Notes enregistrées</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{notes.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                <p className="text-xs text-slate-400 mb-1">Taux d'encadrement</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{total > 0 ? `${Math.round((total / Math.max(1, filieres.length)) * 10) / 10}` : "0"}/filière</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}