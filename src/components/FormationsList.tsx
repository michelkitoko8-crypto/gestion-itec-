import { motion } from "framer-motion";
import { BookOpenText, Clock, Users, Money, Bank, HandCoins, CalendarCheck } from "@phosphor-icons/react";
import type { Formation } from "@/types/iteckinshasa";

interface FormationsListProps {
  formations: Formation[];
  apprenantsCount: Record<string, number>;
}

export default function FormationsList({ formations, apprenantsCount }: FormationsListProps) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Formations</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{formations.length} programmes disponibles</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {formations.map((f, i) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="h-2" style={{ backgroundColor: f.couleurBadge || "#059669" }} />
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: f.couleurBadge ? `${f.couleurBadge}20` : "#05966920" }}>
                  <BookOpenText size={20} style={{ color: f.couleurBadge || "#059669" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white truncate">{f.nom}</h3>
                  <p className="text-xs text-slate-400">
                    {f.niveauPrecision || `${f.dureeMois} mois`}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Clock size={14} className="text-slate-400" />
                  <span>{f.dureeMois} mois</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Users size={14} className="text-slate-400" />
                  <span>{apprenantsCount[f.id] || 0} apprenants</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Money size={14} className="text-emerald-500" /> Frais pédagogiques
                  </span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300">{f.fraisFormationCDF.toLocaleString()} FC</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Bank size={14} className="text-amber-500" /> Frais techniques
                  </span>
                  <span className="font-semibold text-amber-700 dark:text-amber-300">${f.fraisTechniqueUSD}</span>
                </div>
                {f.acompteCDF > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <HandCoins size={14} className="text-indigo-500" /> Acompte d'inscription
                    </span>
                    <span className="font-semibold text-indigo-700 dark:text-indigo-300">{f.acompteCDF.toLocaleString()} FC</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <CalendarCheck size={14} className="text-sky-500" /> Mensualité
                  </span>
                  <span className="font-semibold text-sky-700 dark:text-sky-300">{f.mensualiteCDF.toLocaleString()} FC
                    <span className="text-xs font-normal text-slate-400"> /mois</span>
                  </span>
                </div>
              </div>

              {f.detailsEcheancier && (
                <div className="text-xs text-slate-500 dark:text-slate-400 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg px-3 py-2 border border-emerald-100 dark:border-emerald-800/40">
                  <span className="font-medium text-emerald-700 dark:text-emerald-300">Échéancier : </span>
                  {f.detailsEcheancier}
                </div>
              )}

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                  f.actif ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300" : "bg-slate-100 dark:bg-slate-700 text-slate-500"
                }`}>{f.actif ? "Actif" : "Inactif"}</span>
                {f.description && <span className="truncate">{f.description}</span>}
              </div>
            </div>
          </motion.div>
        ))}
        {formations.length === 0 && (
          <div className="col-span-full p-8 text-center text-slate-400">
            <BookOpenText size={40} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucune formation disponible</p>
          </div>
        )}
      </div>
    </div>
  );
}