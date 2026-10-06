import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, UserCircle, Envelope, Phone, CalendarBlank, MapPin, BookOpenText, ClockCountdown, GraduationCap, CheckCircle, Trash, PencilSimple, Plus } from "@phosphor-icons/react";
import type { Apprenant, Absence, Note, Stage, Filiere } from "@/types/apprenant";

interface ApprenantDetailProps {
  apprenant: Apprenant;
  absences: Absence[];
  notes: Note[];
  stages: Stage[];
  filieres: Filiere[];
  onBack: () => void;
  onUpdate: (id: string, data: Partial<Apprenant>) => void;
  onDelete: (id: string) => void;
  onAddAbsence: (absence: Omit<Absence, "id">) => void;
  onAddNote: (note: Omit<Note, "id">) => void;
  onAddStage: (stage: Omit<Stage, "id">) => void;
}

export default function ApprenantDetail({
  apprenant, absences, notes, stages, filieres,
  onBack, onUpdate, onDelete, onAddAbsence, onAddNote, onAddStage,
}: ApprenantDetailProps) {
  const [activeTab, setActiveTab] = useState<"absences" | "notes" | "stages">("absences");
  const [showAbsenceForm, setShowAbsenceForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showStageForm, setShowStageForm] = useState(false);

  const appAbsences = absences.filter((a) => a.apprenantId === apprenant.id);
  const appNotes = notes.filter((n) => n.apprenantId === apprenant.id);
  const appStages = stages.filter((s) => s.apprenantId === apprenant.id);

  const moyenne = appNotes.length > 0
    ? Math.round((appNotes.reduce((sum, n) => sum + n.note, 0) / appNotes.length) * 10) / 10
    : null;

  const [newAbsence, setNewAbsence] = useState({ date: "", motif: "", justifiee: false });
  const [newNote, setNewNote] = useState({ matiere: "", note: 0, coeff: 1, date: "" });
  const [newStage, setNewStage] = useState({ entreprise: "", lieu: "", dateDebut: "", dateFin: "", statut: "En cours" as const });

  const handleAddAbsence = () => {
    onAddAbsence({
      apprenantId: apprenant.id,
      date: newAbsence.date,
      motif: newAbsence.motif,
      justifiee: newAbsence.justifiee,
    });
    setNewAbsence({ date: "", motif: "", justifiee: false });
    setShowAbsenceForm(false);
  };

  const handleAddNote = () => {
    onAddNote({
      apprenantId: apprenant.id,
      matiere: newNote.matiere,
      note: newNote.note,
      coeff: newNote.coeff,
      date: newNote.date,
    });
    setNewNote({ matiere: "", note: 0, coeff: 1, date: "" });
    setShowNoteForm(false);
  };

  const handleAddStage = () => {
    onAddStage({
      apprenantId: apprenant.id,
      entreprise: newStage.entreprise,
      lieu: newStage.lieu,
      dateDebut: newStage.dateDebut,
      dateFin: newStage.dateFin || undefined,
      statut: newStage.statut,
    });
    setNewStage({ entreprise: "", lieu: "", dateDebut: "", dateFin: "", statut: "En cours" });
    setShowStageForm(false);
  };

  const tabs = [
    { id: "absences" as const, label: "Absences", count: appAbsences.length, icon: ClockCountdown },
    { id: "notes" as const, label: "Notes", count: appNotes.length, icon: CheckCircle },
    { id: "stages" as const, label: "Stages", count: appStages.length, icon: GraduationCap },
  ];

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
        <ArrowLeft size={16} />
        Retour à la liste
      </button>

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-700 dark:text-emerald-300 text-2xl font-bold shrink-0">
              {apprenant.prenom[0]}{apprenant.nom[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">{apprenant.prenom} {apprenant.nom}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  apprenant.statut === "Actif" ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300" :
                  apprenant.statut === "En stage" ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300" :
                  apprenant.statut === "Suspendu" ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300" :
                  "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
                }`}>{apprenant.statut}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Envelope size={14} />
                  <span className="truncate">{apprenant.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Phone size={14} />
                  <span>{apprenant.telephone || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <BookOpenText size={14} />
                  <span>{apprenant.filiere} - {apprenant.niveau}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <CalendarBlank size={14} />
                  <span>Inscrit le {new Date(apprenant.dateInscription).toLocaleDateString("fr-FR")}</span>
                </div>
              </div>
              {apprenant.adresse && (
                <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                  <MapPin size={14} />
                  <span>{apprenant.adresse}</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-600 transition-colors" title="Modifier">
                <PencilSimple size={18} />
              </button>
              <button onClick={() => { onDelete(apprenant.id); onBack(); }} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-red-600 transition-colors" title="Supprimer">
                <Trash size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-emerald-600 text-emerald-700 dark:text-emerald-300"
                    : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700">{tab.count}</span>
              </button>
            ))}
            {moyenne !== null && (
              <div className="ml-auto px-4 py-3 flex items-center gap-2 text-sm">
                <span className="text-slate-400">Moyenne:</span>
                <span className={`font-bold ${moyenne >= 14 ? "text-emerald-600" : moyenne >= 10 ? "text-amber-600" : "text-red-600"}`}>
                  {moyenne}/20
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
        {activeTab === "absences" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-white">Historique des absences</h3>
              <button
                onClick={() => setShowAbsenceForm(!showAbsenceForm)}
                className="flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                <Plus size={16} />
                Ajouter
              </button>
            </div>
            {showAbsenceForm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 space-y-2">
                <input type="date" value={newAbsence.date} onChange={(e) => setNewAbsence({ ...newAbsence, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
                <input value={newAbsence.motif} onChange={(e) => setNewAbsence({ ...newAbsence, motif: e.target.value })}
                  placeholder="Motif" className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={newAbsence.justifiee} onChange={(e) => setNewAbsence({ ...newAbsence, justifiee: e.target.checked })}
                    className="rounded border-slate-300" />
                  Justifiée
                </label>
                <button onClick={handleAddAbsence} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm">Enregistrer</button>
              </motion.div>
            )}
            {appAbsences.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">Aucune absence enregistrée</p>
            ) : (
              <div className="space-y-2">
                {appAbsences.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((abs) => (
                  <div key={abs.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <div className={`w-2 h-2 rounded-full ${abs.justifiee ? "bg-emerald-500" : "bg-amber-500"}`} />
                    <span className="text-sm text-slate-600 dark:text-slate-400">{new Date(abs.date).toLocaleDateString("fr-FR")}</span>
                    <span className="text-sm text-slate-900 dark:text-white flex-1">{abs.motif || "—"}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${abs.justifiee ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700" : "bg-amber-100 dark:bg-amber-900/40 text-amber-700"}`}>
                      {abs.justifiee ? "Justifiée" : "Non justifiée"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "notes" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-white">Relevé de notes</h3>
              <button
                onClick={() => setShowNoteForm(!showNoteForm)}
                className="flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                <Plus size={16} />
                Ajouter
              </button>
            </div>
            {showNoteForm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 space-y-2">
                <input value={newNote.matiere} onChange={(e) => setNewNote({ ...newNote, matiere: e.target.value })}
                  placeholder="Matière" className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
                <div className="flex gap-2">
                  <input type="number" min={0} max={20} step={0.5} value={newNote.note} onChange={(e) => setNewNote({ ...newNote, note: parseFloat(e.target.value) || 0 })}
                    placeholder="Note /20" className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
                  <input type="number" min={1} max={5} value={newNote.coeff} onChange={(e) => setNewNote({ ...newNote, coeff: parseInt(e.target.value) || 1 })}
                    placeholder="Coeff" className="w-20 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
                  <input type="date" value={newNote.date} onChange={(e) => setNewNote({ ...newNote, date: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
                </div>
                <button onClick={handleAddNote} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm">Enregistrer</button>
              </motion.div>
            )}
            {appNotes.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">Aucune note enregistrée</p>
            ) : (
              <div className="space-y-2">
                {appNotes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((n) => (
                  <div key={n.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <span className="text-sm font-medium text-slate-900 dark:text-white flex-1">{n.matiere}</span>
                    <span className="text-sm text-slate-400">Coeff {n.coeff}</span>
                    <span className={`text-sm font-bold px-2 py-0.5 rounded ${n.note >= 14 ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700" : n.note >= 10 ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700" : "bg-red-100 dark:bg-red-900/40 text-red-700"}`}>
                      {n.note}/20
                    </span>
                    <span className="text-xs text-slate-400">{new Date(n.date).toLocaleDateString("fr-FR")}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "stages" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-white">Stages</h3>
              <button
                onClick={() => setShowStageForm(!showStageForm)}
                className="flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                <Plus size={16} />
                Ajouter
              </button>
            </div>
            {showStageForm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 space-y-2">
                <input value={newStage.entreprise} onChange={(e) => setNewStage({ ...newStage, entreprise: e.target.value })}
                  placeholder="Entreprise" className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
                <input value={newStage.lieu} onChange={(e) => setNewStage({ ...newStage, lieu: e.target.value })}
                  placeholder="Lieu" className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
                <div className="flex gap-2">
                  <input type="date" value={newStage.dateDebut} onChange={(e) => setNewStage({ ...newStage, dateDebut: e.target.value })}
                    placeholder="Début" className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
                  <input type="date" value={newStage.dateFin} onChange={(e) => setNewStage({ ...newStage, dateFin: e.target.value })}
                    placeholder="Fin" className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
                </div>
                <button onClick={handleAddStage} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm">Enregistrer</button>
              </motion.div>
            )}
            {appStages.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">Aucun stage enregistré</p>
            ) : (
              <div className="space-y-2">
                {appStages.sort((a, b) => new Date(b.dateDebut).getTime() - new Date(a.dateDebut).getTime()).map((s) => (
                  <div key={s.id} className="p-3 rounded-lg border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{s.entreprise}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        s.statut === "En cours" ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700" :
                        s.statut === "Terminé" ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700" :
                        "bg-amber-100 dark:bg-amber-900/40 text-amber-700"
                      }`}>{s.statut}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>{s.lieu}</span>
                      <span>{new Date(s.dateDebut).toLocaleDateString("fr-FR")} → {s.dateFin ? new Date(s.dateFin).toLocaleDateString("fr-FR") : "En cours"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}