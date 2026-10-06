// Legacy compatibility types — retained for orphaned legacy views that still
// import from this module. The canonical app uses "@/types/iteckinshasa".
// All fields below are optional supersets so those views typecheck cleanly.

export interface Apprenant {
  id: string;
  nom: string;
  prenom: string;
  statut: string;
  matricula?: string;
  dateNaissance?: string;
  lieuNaissance?: string;
  sexe?: "M" | "F";
  nationalite?: string;
  adresse?: string;
  ville?: string;
  telephone?: string;
  email?: string;
  cin?: string;
  contactUrgence?: ContactUrgence;
  filiereId?: string;
  filiere?: string;
  niveau?: string;
  promotion?: string;
  dateInscription?: string;
  dateDebut?: string;
  dateFin?: string;
  photoUrl?: string;
  updatedAt?: string;
}

export interface ContactUrgence {
  nom: string;
  telephone: string;
  lien: string;
}

export interface Filiere {
  id: string;
  nom: string;
  description?: string;
  couleur?: string;
  icone?: string;
  duree?: string;
  code?: string;
  dureeMois?: number;
  niveau?: string;
  responsable?: string;
  modules?: Module[];
}

export interface Module {
  id: string;
  nom: string;
  code?: string;
  coefficient?: number;
  heures?: number;
  enseignant?: string;
}

export interface Note {
  id: string;
  apprenantId: string;
  matiere?: string;
  note: number;
  coeff?: number;
  date: string;
  moduleId?: string;
  evaluation?: string;
  noteMax?: number;
  appreciation?: string;
}

export interface Absence {
  id: string;
  apprenantId: string;
  date: string;
  justifiee: boolean;
  motif?: string;
  type?: string;
  dureeHeures?: number;
  heureDebut?: string;
}

export interface Stage {
  id: string;
  apprenantId: string;
  entreprise: string;
  statut: string;
  dateDebut: string;
  lieu?: string;
  dateFin?: string;
  secteur?: string;
  tuteur?: TuteurStage;
  convention?: boolean;
  evaluation?: EvaluationStage;
}

export interface TuteurStage {
  nom: string;
  prenom: string;
  fonction: string;
  telephone: string;
  email: string;
}

export interface EvaluationStage {
  noteTechnique: number;
  noteRelationnel: number;
  noteRapport: number;
  appreciation: string;
  date: string;
}

export interface Document {
  id: string;
  apprenantId: string;
  type: "carte" | "attestation_scolarite" | "releve_notes" | "certificat_fin" | "convention_stage";
  dateGeneration: string;
  titre: string;
}

export interface DashboardStats {
  totalApprenants: number;
  actifs: number;
  suspendus: number;
  abandons: number;
  diplomes: number;
  tauxPresence: number;
  tauxReussite: number;
  enStage: number;
  repartitionFiliere: { filiere: string; count: number; couleur: string }[];
  recentActivity: ActiviteRecente[];
  evenements: Evenement[];
}

export interface ActiviteRecente {
  id: string;
  type: "inscription" | "note" | "absence" | "stage" | "diplome";
  description: string;
  date: string;
  apprenantNom: string;
}

export interface Evenement {
  id: string;
  titre: string;
  date: string;
  type: "examen" | "soutenance" | "stage" | "reunion" | "autre";
  description?: string;
}