import type { Apprenant, Filiere, Absence, Note, Stage } from "../types/apprenant";
import type { Apprenant as ITECApprenant, Formation, Paiement } from "../types/iteckinshasa";
import { FILIERES, APPRENANTS, INITIAL_ABSENCES, INITIAL_NOTES, INITIAL_STAGES, INITIAL_EVENEMENTS } from "../constants/initialData";
import { FORMATIONS, INITIAL_APPRENANTS, INITIAL_PAIEMENTS } from "../constants/initialData";

const KEYS = {
  apprenants: "cfp_apprenants",
  filieres: "cfp_filieres",
  absences: "cfp_absences",
  notes: "cfp_notes",
  stages: "cfp_stages",
  initialized: "cfp_initialized",
};

/** Version de la grille tarifaire / échéanciers ITEC. */
const FORMA_TIONS_VERSION = "2026.2";
const FORMA_TIONS_VERSION_KEY = "itec_formations_version";

function ensureFormationsVersion(): void {
  if (localStorage.getItem(FORMA_TIONS_VERSION_KEY) !== FORMA_TIONS_VERSION) {
    localStorage.setItem("itec_formations", JSON.stringify(FORMATIONS));
    localStorage.setItem(FORMA_TIONS_VERSION_KEY, FORMA_TIONS_VERSION);
  }
}

function initStorage(): void {
  if (!localStorage.getItem(KEYS.initialized)) {
    localStorage.setItem(KEYS.apprenants, JSON.stringify(APPRENANTS));
    localStorage.setItem(KEYS.filieres, JSON.stringify(FILIERES));
    localStorage.setItem(KEYS.absences, JSON.stringify(INITIAL_ABSENCES));
    localStorage.setItem(KEYS.notes, JSON.stringify(INITIAL_NOTES));
    localStorage.setItem(KEYS.stages, JSON.stringify(INITIAL_STAGES));
    localStorage.setItem(KEYS.initialized, "true");
    localStorage.setItem("cfp_evenements", JSON.stringify(INITIAL_EVENEMENTS));
  }
}

interface CFPData {
  apprenants: Apprenant[];
  filieres: Filiere[];
  absences: Absence[];
  notes: Note[];
  stages: Stage[];
}

function getItem<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setItem<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export const storage = {
  get(): CFPData | null {
    if (!localStorage.getItem(KEYS.initialized)) return null;
    return {
      apprenants: getItem<Apprenant>(KEYS.apprenants),
      filieres: getItem<Filiere>(KEYS.filieres),
      absences: getItem<Absence>(KEYS.absences),
      notes: getItem<Note>(KEYS.notes),
      stages: getItem<Stage>(KEYS.stages),
    };
  },
  set(data: CFPData): void {
    setItem(KEYS.apprenants, data.apprenants);
    setItem(KEYS.filieres, data.filieres);
    setItem(KEYS.absences, data.absences);
    setItem(KEYS.notes, data.notes);
    setItem(KEYS.stages, data.stages);
    localStorage.setItem(KEYS.initialized, "true");
  },
};

export function initData(): CFPData {
  return {
    apprenants: APPRENANTS,
    filieres: FILIERES,
    absences: INITIAL_ABSENCES,
    notes: INITIAL_NOTES,
    stages: INITIAL_STAGES,
  };
}

// --- Apprenants ---
export function getApprenants(): Apprenant[] {
  initStorage();
  return getItem<Apprenant>(KEYS.apprenants);
}

export function getApprenant(id: string): Apprenant | undefined {
  return getApprenants().find((a) => a.id === id);
}

export function saveApprenant(apprenant: Apprenant): void {
  const list = getApprenants();
  const idx = list.findIndex((a) => a.id === apprenant.id);
  if (idx >= 0) list[idx] = apprenant;
  else list.push(apprenant);
  setItem(KEYS.apprenants, list);
}

export function deleteApprenant(id: string): void {
  setItem(KEYS.apprenants, getApprenants().filter((a) => a.id !== id));
}

// --- Filieres ---
export function getFilieres(): Filiere[] {
  initStorage();
  return getItem<Filiere>(KEYS.filieres);
}

export function getFiliere(id: string): Filiere | undefined {
  return getFilieres().find((f) => f.id === id);
}

// --- Absences ---
export function getAbsences(apprenantId?: string): Absence[] {
  initStorage();
  const all = getItem<Absence>(KEYS.absences);
  return apprenantId ? all.filter((a) => a.apprenantId === apprenantId) : all;
}

export function addAbsence(absence: Absence): void {
  const list = getAbsences();
  list.push(absence);
  setItem(KEYS.absences, list);
}

export function updateAbsence(absence: Absence): void {
  const list = getAbsences();
  const idx = list.findIndex((a) => a.id === absence.id);
  if (idx >= 0) list[idx] = absence;
  setItem(KEYS.absences, list);
}

// --- Notes ---
export function getNotes(apprenantId?: string): Note[] {
  initStorage();
  const all = getItem<Note>(KEYS.notes);
  return apprenantId ? all.filter((n) => n.apprenantId === apprenantId) : all;
}

export function addNote(note: Note): void {
  const list = getNotes();
  list.push(note);
  setItem(KEYS.notes, list);
}

// --- Stages ---
export function getStages(apprenantId?: string): Stage[] {
  initStorage();
  const all = getItem<Stage>(KEYS.stages);
  return apprenantId ? all.filter((s) => s.apprenantId === apprenantId) : all;
}

export function saveStage(stage: Stage): void {
  const list = getStages();
  const idx = list.findIndex((s) => s.id === stage.id);
  if (idx >= 0) list[idx] = stage;
  else list.push(stage);
  setItem(KEYS.stages, list);
}

// --- Stats ---
export function getDashboardStats() {
  const apprenants = getApprenants();
  const filieres = getFilieres();
  const absences = getAbsences();
  const stages = getStages();
  const evenements = getItem<any>("cfp_evenements");

  const actifs = apprenants.filter((a) => a.statut === "actif");
  const totalAbsences = absences.filter((a) => a.type === "absence").length;
  const totalSeances = apprenants.length * 20;
  const tauxPresence = totalSeances > 0 ? Math.round(((totalSeances - totalAbsences) / totalSeances) * 100) : 0;

  const notes = getNotes();
  const notesByApprenant = new Map<string, number[]>();
  notes.forEach((n) => {
    if (!notesByApprenant.has(n.apprenantId)) notesByApprenant.set(n.apprenantId, []);
    notesByApprenant.get(n.apprenantId)!.push(n.note);
  });
  const moyennes = Array.from(notesByApprenant.values()).map((ns) => ns.reduce((a, b) => a + b, 0) / ns.length);
  const tauxReussite = moyennes.length > 0 ? Math.round((moyennes.filter((m) => m >= 10).length / moyennes.length) * 100) : 0;

  const repartitionFiliere = filieres.map((f) => ({
    filiere: f.nom,
    count: apprenants.filter((a) => a.filiereId === f.id).length,
    couleur: f.couleur,
  }));

  const recentActivity = apprenants.slice(0, 6).map((a) => ({
    id: `act-${a.id}`,
    type: "inscription" as const,
    description: `${a.prenom} ${a.nom} inscrit en ${filieres.find((f) => f.id === a.filiereId)?.nom || ""}`,
    date: a.dateInscription,
    apprenantNom: `${a.prenom} ${a.nom}`,
  }));

  return {
    totalApprenants: apprenants.length,
    actifs: actifs.length,
    suspendus: apprenants.filter((a) => a.statut === "suspendu").length,
    abandons: apprenants.filter((a) => a.statut === "abandon").length,
    diplomes: apprenants.filter((a) => a.statut === "diplome").length,
    tauxPresence,
    tauxReussite,
    enStage: stages.filter((s) => s.statut === "en_cours").length,
    repartitionFiliere,
    recentActivity,
    evenements: evenements || [],
  };
}

// --- ITEC KINSHASA Storage ---

const ITEC_KEYS = {
  apprenants: "itec_apprenants",
  formations: "itec_formations",
  paiements: "itec_paiements",
  initialized: "itec_initialized",
};

function initITECStorage(): void {
  if (!localStorage.getItem(ITEC_KEYS.initialized)) {
    localStorage.setItem(ITEC_KEYS.apprenants, JSON.stringify(INITIAL_APPRENANTS));
    localStorage.setItem(ITEC_KEYS.formations, JSON.stringify(FORMATIONS));
    localStorage.setItem(ITEC_KEYS.paiements, JSON.stringify(INITIAL_PAIEMENTS));
    localStorage.setItem(ITEC_KEYS.initialized, "true");
  }
  ensureFormationsVersion();
}

// --- ITEC Apprenants ---
export function getITECApprenants(): ITECApprenant[] {
  initITECStorage();
  return getItem<ITECApprenant>(ITEC_KEYS.apprenants);
}

export function getITECApprenant(id: string): ITECApprenant | undefined {
  return getITECApprenants().find((a) => a.id === id);
}

export function saveITECApprenant(apprenant: ITECApprenant): void {
  const list = getITECApprenants();
  const idx = list.findIndex((a) => a.id === apprenant.id);
  if (idx >= 0) list[idx] = apprenant;
  else list.push(apprenant);
  setItem(ITEC_KEYS.apprenants, list);
}

export function deleteITECApprenant(id: string): void {
  setItem(ITEC_KEYS.apprenants, getITECApprenants().filter((a) => a.id !== id));
}

// --- ITEC Formations ---
export function getFormations(): Formation[] {
  initITECStorage();
  return getItem<Formation>(ITEC_KEYS.formations);
}

export function getFormation(id: string): Formation | undefined {
  return getFormations().find((f) => f.id === id);
}

// --- ITEC Paiements ---
export function getPaiements(apprenantId?: string): Paiement[] {
  initITECStorage();
  const all = getItem<Paiement>(ITEC_KEYS.paiements);
  return apprenantId ? all.filter((p) => p.apprenantId === apprenantId) : all;
}

export function addPaiement(paiement: Paiement): void {
  const list = getPaiements();
  list.push(paiement);
  setItem(ITEC_KEYS.paiements, list);
}