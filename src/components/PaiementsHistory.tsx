import { useState } from "react";
import { motion } from "framer-motion";
import { MagnifyingGlass, Money, Bank, Funnel, CaretDown, CaretUp } from "@phosphor-icons/react";
import { toast } from "sonner";
import type { Apprenant, Paiement, Formation } from "@/types/iteckinshasa";
import { getFormation } from "@/services/storage";

interface PaiementsHistoryProps {
  paiements: Paiement[];
  apprenants: Apprenant[];
  formations: Formation[];
}

export default function PaiementsHistory({ paiements, apprenants, formations }: PaiementsHistoryProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "formation" | "technique">("all");
  const [sortField, setSortField] = useState<keyof Paiement>("datePaiement");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const apprenantMap = Object.fromEntries(apprenants.map((a) => [a.id, a]));

  const filtered = paiements
    .filter((p) => {
      const app = apprenantMap[p.apprenantId];
      if (!app) return false;
      const q = search.toLowerCase();
      const matchesSearch = `${app.prenom} ${app.nom} ${app.postnom} ${app.matricule} ${p.recuNumero}`.toLowerCase().includes(q);
      const matchesType = typeFilter === "all" || p.typeFrais === typeFilter;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      const aVal = String(a[sortField] || "");
      const bVal = String(b[sortField] || "");
      return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

  const handleSort = (field: keyof Paiement) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const totalCDF = paiements.filter((p) => p.typeFrais === "formation").reduce((s, p) => s + p.montantCDF, 0);
  const totalUSD = paiements.filter((p) => p.typeFrais === "technique").reduce((s, p) => s + p.montantUSD, 0);

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortDir === "asc" ? <CaretUp size={12} className="inline" /> : <CaretDown size={12} className="inline" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Paiements</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{paiements.length} transactions</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20">
          <p className="text-xs text-slate-500 dark:text-slate-400">Total Frais Formation (CDF)</p>
          <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">{totalCDF.toLocaleString()} FC</p>
        </div>
        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
          <p className="text-xs text-slate-500 dark:text-slate-400">Total Frais Technique (USD)</p>
          <p className="text-xl font-bold text-amber-700 dark:text-amber-300">${totalUSD.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="Rechercher par apprenant ou reçu..." />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)}
          className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
          <option value="all">Tous types</option>
          <option value="formation">Frais Formation</option>
          <option value="technique">Frais Technique</option>
        </select>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("datePaiement")}>
                  Date <SortIcon field="datePaiement" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Apprenant</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("typeFrais")}>
                  Type <SortIcon field="typeFrais" />
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("montantCDF")}>
                  Montant <SortIcon field="montantCDF" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("modePaiement")}>
                  Mode <SortIcon field="modePaiement" />
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">N° Reçu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filtered.map((p, i) => {
                const app = apprenantMap[p.apprenantId];
                return (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/30"
                  >
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{p.datePaiement}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                          {app ? `${app.prenom[0]}${app.nom[0]}` : "?"}
                        </div>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {app ? `${app.prenom} ${app.nom}` : "Inconnu"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        p.typeFrais === "formation"
                          ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                          : "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                      }`}>
                        {p.typeFrais === "formation" ? "Formation" : "Technique"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm font-medium text-slate-700 dark:text-slate-300">
                      {p.typeFrais === "formation" ? `${p.montantCDF.toLocaleString()} FC` : `$${p.montantUSD}`}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{p.modePaiement}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-mono text-xs text-slate-500">{p.recuNumero}</span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-400">
            <Money size={40} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucun paiement trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}