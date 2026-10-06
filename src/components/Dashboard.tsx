import { motion } from "framer-motion";
import { Users, GraduationCap, BookOpenText, Money, Receipt, UserPlus, ArrowUp, Bank, HandCoins, TrendUp } from "@phosphor-icons/react";
import type { Apprenant, Formation, Paiement } from "@/types/iteckinshasa";

interface DashboardProps {
  apprenants: Apprenant[];
  formations: Formation[];
  paiements: Paiement[];
  onNavigate: (page: string) => void;
}

export default function Dashboard({ apprenants, formations, paiements, onNavigate }: DashboardProps) {
  const total = apprenants.length;
  const actifs = apprenants.filter((a) => a.statutApprenant === "actif").length;
  const diplomes = apprenants.filter((a) => a.statutApprenant === "diplome").length;
  const abandons = apprenants.filter((a) => a.statutApprenant === "abandon").length;

  const totalFraisFormation = apprenants.reduce((s, a) => s + a.fraisFormationPayerCDF, 0);
  const totalFraisTechnique = apprenants.reduce((s, a) => s + a.fraisTechniquePayerUSD, 0);
  const totalPaiementsFormation = paiements.filter((p) => p.typeFrais === "formation").reduce((s, p) => s + p.montantCDF, 0);
  const totalPaiementsTechnique = paiements.filter((p) => p.typeFrais === "technique").reduce((s, p) => s + p.montantUSD, 0);
  const resteFormation = totalFraisFormation - totalPaiementsFormation;
  const resteTechnique = totalFraisTechnique - totalPaiementsTechnique;
  const tauxRecouvrement = totalFraisFormation > 0 ? Math.round((totalPaiementsFormation / totalFraisFormation) * 100) : 0;

  const stats = [
    { label: "Apprenants actifs", value: actifs, icon: Users, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/30", change: null, onClick: () => onNavigate("apprenants") },
    { label: "Formations", value: formations.length, icon: BookOpenText, color: "text-indigo-600", bg: "bg-indigo-100 dark:bg-indigo-900/30", change: null, onClick: () => onNavigate("formations") },
    { label: "Frais Formation (CDF)", value: totalPaiementsFormation.toLocaleString() + " FC", icon: Money, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/30", change: null, onClick: () => onNavigate("paiements") },
    { label: "Frais Technique (USD)", value: "$" + totalPaiementsTechnique.toLocaleString(), icon: Bank, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/30", change: null, onClick: () => onNavigate("paiements") },
    { label: "Taux recouvrement", value: tauxRecouvrement + "%", icon: TrendUp, color: "text-indigo-600", bg: "bg-indigo-100 dark:bg-indigo-900/30", change: null, onClick: () => {} },
    { label: "Total apprenants", value: total, icon: UserPlus, color: "text-slate-600", bg: "bg-slate-100 dark:bg-slate-800", change: null, onClick: () => onNavigate("apprenants") },
  ];

  const formationStats = formations.map((f) => ({
    nom: f.nom,
    count: apprenants.filter((a) => a.formationId === f.id).length,
    color: f.couleurBadge,
  }));

  const recentApprenants = [...apprenants].sort((a, b) => new Date(b.dateInscription).getTime() - new Date(a.dateInscription).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tableau de bord</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Aperçu général — ITEC KINSHASA</p>
        </div>
        <button
          onClick={() => onNavigate("apprenants")}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <UserPlus size={18} />
          Nouvel apprenant
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <motion.button
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={stat.onClick}
            className="text-left p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</span>
              {stat.change && (
                <span className="flex items-center gap-0.5 text-xs text-emerald-600">
                  <ArrowUp size={10} weight="bold" />
                  {stat.change}
                </span>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
        >
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Répartition par formation</h2>
          <div className="space-y-3">
            {formationStats.map((fs) => (
              <div key={fs.nom} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700 dark:text-slate-300">{fs.nom}</span>
                    <span className="font-medium text-slate-900 dark:text-white">{fs.count}</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${total > 0 ? (fs.count / total) * 100 : 0}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: fs.color || "#059669" }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {formationStats.length === 0 && <p className="text-sm text-slate-400">Aucune formation</p>}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
        >
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Derniers inscrits</h2>
          <div className="space-y-3">
            {recentApprenants.map((app, i) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer"
                onClick={() => onNavigate("apprenants")}
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-700 dark:text-emerald-300 text-sm font-bold">
                  {app.prenom[0]}{app.nom[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{app.prenom} {app.nom}</p>
                  <p className="text-xs text-slate-400">{app.formationId}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  app.statutApprenant === "actif" ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300" :
                  app.statutApprenant === "diplome" ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300" :
                  "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                }`}>
                  {app.statutApprenant}
                </span>
              </motion.div>
            ))}
            {recentApprenants.length === 0 && <p className="text-sm text-slate-400">Aucun apprenant inscrit</p>}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
        >
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Récapitulatif financier</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
              <p className="text-xs text-slate-500 dark:text-slate-400">Frais Formation (CDF)</p>
              <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">{totalPaiementsFormation.toLocaleString()} FC</p>
              <p className="text-xs text-slate-400">Reste: {resteFormation.toLocaleString()} FC</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
              <p className="text-xs text-slate-500 dark:text-slate-400">Frais Technique (USD)</p>
              <p className="text-lg font-bold text-amber-700 dark:text-amber-300">${totalPaiementsTechnique.toLocaleString()}</p>
              <p className="text-xs text-slate-400">Reste: ${resteTechnique.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
        >
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Statistiques</h2>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{actifs}</p>
              <p className="text-xs text-slate-500">Actifs</p>
            </div>
            <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
              <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">{diplomes}</p>
              <p className="text-xs text-slate-500">Diplômés</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{abandons}</p>
              <p className="text-xs text-slate-500">Abandons</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}