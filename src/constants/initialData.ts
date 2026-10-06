import type { Apprenant, Formation, Paiement } from "../types/iteckinshasa";
import type {
  Apprenant as CFPApprenant,
  Filiere,
  Absence,
  Note,
  Stage,
  Evenement,
} from "../types/apprenant";

export const MOIS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
] as const;

export const ANNEES_PROMOTIONS = [2025, 2026, 2027] as const;

export function genererPromotions(): string[] {
  const promos: string[] = [];
  for (const annee of ANNEES_PROMOTIONS) {
    for (const mois of MOIS) {
      promos.push(`Promotion ${mois} ${annee}`);
    }
  }
  return promos;
}

export const PROMOTIONS = genererPromotions();

export const PROMOTIONS_PAR_ANNEE: Record<number, string[]> = Object.fromEntries(
  ANNEES_PROMOTIONS.map((a) => [a, MOIS.map((m) => `Promotion ${m} ${a}`)])
);

export const FORMATIONS: Formation[] = [
  {
    id: 'coupe_couture',
    nom: 'Coupe et Couture',
    dureeMois: 4,
    fraisFormationCDF: 270000,
    fraisFormationUSD: 100,
    fraisTechniqueUSD: 40,
    fraisTechniqueCDF: 112000,
    acompteCDF: 70000,
    mensualiteCDF: 50000,
    detailsEcheancier: 'Acompte 70.000 FC + 4 mensualités de 50.000 FC',
    description: 'Formation complète aux métiers de la coupe et couture : patronage, confection, retouches et création de modèles.',
    couleurBadge: '#059669',
  },
  {
    id: 'esthetique_coiffure',
    nom: 'Esthétique & Coiffure',
    dureeMois: 4,
    fraisFormationCDF: 270000,
    fraisFormationUSD: 100,
    fraisTechniqueUSD: 35,
    fraisTechniqueCDF: 98000,
    acompteCDF: 70000,
    mensualiteCDF: 50000,
    detailsEcheancier: 'Acompte 70.000 FC + mensualités de 50.000 FC',
    description: 'Formation professionnelle en esthétique et coiffure : soins du visage, coiffure, manucure et maquillage.',
    couleurBadge: '#d97706',
  },
  {
    id: 'informatique_bureautique',
    nom: 'Informatique Bureautique',
    dureeMois: 3,
    fraisFormationCDF: 200000,
    fraisFormationUSD: 70,
    fraisTechniqueUSD: 40,
    fraisTechniqueCDF: 112000,
    acompteCDF: 50000,
    mensualiteCDF: 50000,
    detailsEcheancier: 'Acompte 50.000 FC + 3 mensualités de 50.000 FC',
    description: 'Initiation et perfectionnement aux outils bureautiques : Word, Excel, PowerPoint, Internet et maintenance.',
    couleurBadge: '#4f46e5',
  },
  {
    id: 'auto_ecole',
    nom: 'Auto-École',
    dureeMois: 3,
    fraisFormationCDF: 300000,
    fraisFormationUSD: 110,
    fraisTechniqueUSD: 50,
    fraisTechniqueCDF: 140000,
    acompteCDF: 0,
    mensualiteCDF: 100000,
    detailsEcheancier: '3 mensualités de 100.000 FC - frais techniques 50$ (ou acompte déduit)',
    description: 'Formation théorique et pratique au code de la route et à la conduite automobile.',
    couleurBadge: '#0891b2',
  },
  {
    id: 'hotellerie',
    nom: 'Hôtellerie',
    dureeMois: 4,
    fraisFormationCDF: 220000,
    fraisFormationUSD: 80,
    fraisTechniqueUSD: 50,
    fraisTechniqueCDF: 140000,
    acompteCDF: 60000,
    mensualiteCDF: 50000,
    detailsEcheancier: 'Acompte 60.000 FC + 4 mensualités de 50.000 FC',
    description: "Formation aux métiers de l'hôtellerie : réception, service en salle, gestion hôtelière et savoir-être.",
    couleurBadge: '#dc2626',
  },
  {
    id: 'anglais',
    nom: 'Anglais',
    dureeMois: 3,
    fraisFormationCDF: 200000,
    fraisFormationUSD: 70,
    fraisTechniqueUSD: 30,
    fraisTechniqueCDF: 84000,
    acompteCDF: 50000,
    mensualiteCDF: 50000,
    niveauPrecision: '3 mois par niveau - 3 niveaux au total',
    detailsEcheancier: 'Acompte 50.000 FC + 3 mensualités de 50.000 FC (par niveau)',
    description: "Cours d'anglais général et professionnel : communication orale, écrite, grammaire et vocabulaire.",
    couleurBadge: '#7c3aed',
  },
  {
    id: 'alphabetisation',
    nom: 'Alphabétisation',
    dureeMois: 4,
    fraisFormationCDF: 130000,
    fraisFormationUSD: 50,
    fraisTechniqueUSD: 30,
    fraisTechniqueCDF: 84000,
    acompteCDF: 50000,
    mensualiteCDF: 20000,
    detailsEcheancier: 'Acompte 50.000 FC + mensualités de 20.000 FC',
    description: "Programme d'alphabétisation pour adultes : lecture, écriture, calcul de base et compétences sociales.",
    couleurBadge: '#0d9488',
  },
  {
    id: 'francais',
    nom: 'Français',
    dureeMois: 3,
    fraisFormationCDF: 200000,
    fraisFormationUSD: 70,
    fraisTechniqueUSD: 30,
    fraisTechniqueCDF: 84000,
    acompteCDF: 50000,
    mensualiteCDF: 50000,
    detailsEcheancier: 'Acompte 50.000 FC + 3 mensualités de 50.000 FC',
    description: 'Cours de français langue étrangère : communication orale et écrite, grammaire, conjugaison et expression.',
    couleurBadge: '#e11d48',
  },
];

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

function randomDate(start: Date, end: Date): string {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return d.toISOString().split('T')[0];
}

const communes = ['Gombe', 'Lemba', 'Bandal', 'Kalamu', 'Limete', 'Ngaliema', 'Kinshasa', 'Matete', 'Ndjili', 'Masina', 'Barumbu', 'Makala', 'Selembao', 'Bumbu', 'Mont Ngafula', 'Nsele', 'Kisenso', 'Ngiri-Ngiri', 'Ngaba', 'Maluku'];

const noms = [
  { nom: 'Mukendi', postnom: 'Kabongo', prenom: 'Jean-Pierre', sexe: 'M' as const },
  { nom: 'Ntumba', postnom: 'Tshibangu', prenom: 'Marie', sexe: 'F' as const },
  { nom: 'Ilunga', postnom: 'Mbuyi', prenom: 'Paul', sexe: 'M' as const },
  { nom: 'Kazadi', postnom: 'Mwamba', prenom: 'Esther', sexe: 'F' as const },
  { nom: 'Tshilombo', postnom: 'Mpoyi', prenom: 'Joseph', sexe: 'M' as const },
  { nom: 'Mpiana', postnom: 'Kanku', prenom: 'Ruth', sexe: 'F' as const },
  { nom: 'Lubamba', postnom: 'Kalonji', prenom: 'David', sexe: 'M' as const },
  { nom: 'Kaseya', postnom: 'Tshibola', prenom: 'Grace', sexe: 'F' as const },
  { nom: 'Mwepu', postnom: 'Mutombo', prenom: 'Daniel', sexe: 'M' as const },
  { nom: 'Kalala', postnom: 'Mpanga', prenom: 'Sarah', sexe: 'F' as const },
  { nom: 'Banza', postnom: 'Kibwe', prenom: 'Michel', sexe: 'M' as const },
  { nom: 'Tshimanga', postnom: 'Mukendi', prenom: 'Rachel', sexe: 'F' as const },
  { nom: 'Kanyinda', postnom: 'Mbuyamba', prenom: 'André', sexe: 'M' as const },
  { nom: 'Mbombo', postnom: 'Kazumba', prenom: 'Béatrice', sexe: 'F' as const },
  { nom: 'Lusamba', postnom: 'Tshibanda', prenom: 'Prosper', sexe: 'M' as const },
  { nom: 'Tshisuaka', postnom: 'Mpungu', prenom: 'Catherine', sexe: 'F' as const },
  { nom: 'Kanku', postnom: 'Muteba', prenom: 'Justin', sexe: 'M' as const },
  { nom: 'Mbuyi', postnom: 'Kabasele', prenom: 'Dorcas', sexe: 'F' as const },
  { nom: 'Ngoie', postnom: 'Mwilambwe', prenom: 'Albert', sexe: 'M' as const },
  { nom: 'Kabongo', postnom: 'Mpiana', prenom: 'Lucie', sexe: 'F' as const },
  { nom: 'Tshibamba', postnom: 'Lulendo', prenom: 'Félix', sexe: 'M' as const },
  { nom: 'Mushiya', postnom: 'Tshibangu', prenom: 'Alice', sexe: 'F' as const },
  { nom: 'Kipoy', postnom: 'Kasuya', prenom: 'Gaston', sexe: 'M' as const },
  { nom: 'Mwamba', postnom: 'Kazadi', prenom: 'Hélène', sexe: 'F' as const },
  { nom: 'Kabasele', postnom: 'Tshilumba', prenom: 'Emmanuel', sexe: 'M' as const },
];

export const INITIAL_APPRENANTS: Apprenant[] = noms.map((p, i) => {
  const formation = FORMATIONS[i % FORMATIONS.length];
  const commune = communes[i % communes.length];
  const tel = `+2438${String(Math.floor(10000000 + Math.random() * 90000000)).slice(0, 8)}`;
  const promo = PROMOTIONS[i % PROMOTIONS.length];
  const dateIns = randomDate(new Date('2025-09-01'), new Date('2026-03-01'));
  const statut = i < 20 ? 'actif' : i < 23 ? 'diplome' : 'abandon';
  const fraisF = formation.fraisFormationCDF;
  const fraisT = formation.fraisTechniqueUSD;
  const payeF = statut === 'abandon' ? Math.floor(fraisF * 0.3) : statut === 'diplome' ? fraisF : Math.floor(fraisF * (0.5 + Math.random() * 0.5));
  const payeT = statut === 'abandon' ? Math.floor(fraisT * 0.3) : statut === 'diplome' ? fraisT : Math.floor(fraisT * (0.5 + Math.random() * 0.5));
  return {
    id: `a${i + 1}`,
    matricule: `ITK-2026-${String(i + 1).padStart(3, '0')}`,
    nom: p.nom,
    postnom: p.postnom,
    prenom: p.prenom,
    sexe: p.sexe,
    telephone: tel,
    commune,
    formationId: formation.id,
    promotion: promo,
    dateInscription: dateIns,
    statutApprenant: statut,
    fraisFormationPayerCDF: payeF,
    fraisTechniquePayerUSD: payeT,
  };
});

export const generatePaiements = (): Paiement[] => {
  const paiements: Paiement[] = [];
  const modes = ['Especes', 'M-Pesa', 'Airtel Money', 'Orange Money', 'Virement BCDC'] as const;
  const agents = ['M. Kabongo', 'Mme. Ntumba', 'M. Ilunga', 'Mme. Kazadi'];

  INITIAL_APPRENANTS.forEach((a) => {
    const formation = FORMATIONS.find((f) => f.id === a.formationId)!;
    const nbPaiements = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < nbPaiements; i++) {
      const isFormation = Math.random() > 0.4;
      const totalF = a.fraisFormationPayerCDF;
      const totalT = a.fraisTechniquePayerUSD;
      const montant = isFormation
        ? Math.floor(totalF / nbPaiements)
        : Math.floor(totalT / nbPaiements);
      const date = new Date(a.dateInscription);
      date.setDate(date.getDate() + i * 30 + Math.floor(Math.random() * 15));
      if (date > new Date()) return;
      const paiement: Paiement = {
        id: `p${a.id}-${i}`,
        apprenantId: a.id,
        typeFrais: isFormation ? 'formation' : 'technique',
        montantCDF: isFormation ? montant : formation.fraisTechniqueCDF / nbPaiements,
        montantUSD: isFormation ? formation.fraisFormationUSD / nbPaiements : montant,
        devisePaiement: isFormation ? 'CDF' : 'USD',
        modePaiement: modes[Math.floor(Math.random() * modes.length)],
        datePaiement: date.toISOString().split('T')[0],
        recuNumero: `REC-ITK-${String(paiements.length + 1).padStart(5, '0')}`,
        agentCaisse: agents[Math.floor(Math.random() * agents.length)],
      };
      paiements.push(paiement);
    }
  });
  return paiements;
};

export const INITIAL_PAIEMENTS = generatePaiements();
export const TAUX_PAR_DEFAUT = 2800;

// --- CFP / Rapports System Data ---

export const FILIERES: Filiere[] = [
  {
    id: "informatique",
    nom: "Informatique",
    code: "INF",
    description: "Formation en programmation, réseaux et maintenance",
    dureeMois: 12,
    niveau: "Débutant",
    responsable: "M. Kabongo",
    modules: [],
    couleur: "#4f46e5",
    icone: "computer",
  },
  {
    id: "coupe_couture",
    nom: "Coupe et Couture",
    code: "CC",
    description: "Formation en coupe et couture",
    dureeMois: 4,
    niveau: "Débutant",
    responsable: "Mme. Ntumba",
    modules: [],
    couleur: "#059669",
    icone: "scissors",
  },
  {
    id: "esthetique",
    nom: "Esthétique & Coiffure",
    code: "EC",
    description: "Formation en esthétique et coiffure",
    dureeMois: 4,
    niveau: "Débutant",
    responsable: "Mme. Kazadi",
    modules: [],
    couleur: "#d97706",
    icone: "sparkles",
  },
  {
    id: "bureautique",
    nom: "Informatique Bureautique",
    code: "BUR",
    description: "Formation en bureautique",
    dureeMois: 3,
    niveau: "Débutant",
    responsable: "M. Ilunga",
    modules: [],
    couleur: "#0891b2",
    icone: "file-text",
  },
];

function generateCFPId(): string {
  return Math.random().toString(36).substring(2, 10);
}

function randomDateCFP(start: Date, end: Date): string {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return d.toISOString().split("T")[0];
}

const cfpCommunes = [
  "Gombe", "Lemba", "Bandal", "Kalamu", "Limete",
  "Ngaliema", "Kinshasa", "Matete", "Ndjili", "Masina",
];

const cfpNoms = [
  { nom: "Mukendi", prenom: "Jean-Pierre", sexe: "M" as const },
  { nom: "Ntumba", prenom: "Marie", sexe: "F" as const },
  { nom: "Ilunga", prenom: "Paul", sexe: "M" as const },
  { nom: "Kazadi", prenom: "Esther", sexe: "F" as const },
  { nom: "Tshilombo", prenom: "Joseph", sexe: "M" as const },
  { nom: "Mpiana", prenom: "Ruth", sexe: "F" as const },
  { nom: "Lubamba", prenom: "David", sexe: "M" as const },
  { nom: "Kaseya", prenom: "Grace", sexe: "F" as const },
  { nom: "Mwepu", prenom: "Daniel", sexe: "M" as const },
  { nom: "Kalala", prenom: "Sarah", sexe: "F" as const },
  { nom: "Banza", prenom: "Michel", sexe: "M" as const },
  { nom: "Tshimanga", prenom: "Rachel", sexe: "F" as const },
  { nom: "Kanyinda", prenom: "André", sexe: "M" as const },
  { nom: "Mbombo", prenom: "Béatrice", sexe: "F" as const },
  { nom: "Lusamba", prenom: "Prosper", sexe: "M" as const },
];

export const APPRENANTS: CFPApprenant[] = cfpNoms.map((p, i) => {
  const filiere = FILIERES[i % FILIERES.length];
  const commune = cfpCommunes[i % cfpCommunes.length];
  const tel = `+2438${String(Math.floor(10000000 + Math.random() * 90000000)).slice(0, 8)}`;
  return {
    id: `cfp-${i + 1}`,
    matricula: `CFP-2026-${String(i + 1).padStart(3, "0")}`,
    nom: p.nom,
    prenom: p.prenom,
    dateNaissance: randomDateCFP(new Date("1995-01-01"), new Date("2005-12-31")),
    lieuNaissance: "Kinshasa",
    sexe: p.sexe,
    nationalite: "Congolaise",
    adresse: `${Math.floor(Math.random() * 200) + 1}, Av. de la Liberté`,
    ville: "Kinshasa",
    telephone: tel,
    email: `${p.prenom.toLowerCase()}.${p.nom.toLowerCase()}@email.com`,
    cin: `CIN-${String(i + 1).padStart(6, "0")}`,
    contactUrgence: {
      nom: `Famille ${p.nom}`,
      telephone: `+2438${String(Math.floor(10000000 + Math.random() * 90000000)).slice(0, 8)}`,
      lien: "Parent",
    },
    filiereId: filiere.id,
    promotion: PROMOTIONS[i % PROMOTIONS.length],
    dateInscription: randomDateCFP(new Date("2025-09-01"), new Date("2026-03-01")),
    statut: i < 10 ? "actif" : i < 13 ? "diplome" : "abandon",
  };
});

export const INITIAL_ABSENCES: Absence[] = APPRENANTS.slice(0, 8).flatMap((a, i) => [
  {
    id: `abs-${a.id}-1`,
    apprenantId: a.id,
    date: randomDateCFP(new Date("2026-01-01"), new Date("2026-03-15")),
    type: "absence" as const,
    motif: "Maladie",
    dureeHeures: 4,
    justifiee: i % 2 === 0,
  },
  {
    id: `abs-${a.id}-2`,
    apprenantId: a.id,
    date: randomDateCFP(new Date("2026-02-01"), new Date("2026-03-20")),
    type: i % 3 === 0 ? "retard" as const : "absence" as const,
    motif: i % 3 === 0 ? "Retard" : "Raison familiale",
    dureeHeures: i % 3 === 0 ? 1 : 3,
    justifiee: i % 3 !== 0,
  },
]);

export const INITIAL_NOTES: Note[] = APPRENANTS.slice(0, 10).flatMap((a) => [
  {
    id: `note-${a.id}-1`,
    apprenantId: a.id,
    moduleId: "mod-1",
    evaluation: "Examen Semestre 1",
    note: Math.floor(Math.random() * 8) + 8,
    noteMax: 20,
    date: "2026-02-15",
    appreciation: Math.random() > 0.5 ? "Très bien" : "Bien",
  },
  {
    id: `note-${a.id}-2`,
    apprenantId: a.id,
    moduleId: "mod-2",
    evaluation: "Interrogation",
    note: Math.floor(Math.random() * 10) + 5,
    noteMax: 20,
    date: "2026-03-01",
  },
]);

export const INITIAL_STAGES: Stage[] = APPRENANTS.slice(2, 5).map((a, i) => ({
  id: `stg-${a.id}`,
  apprenantId: a.id,
  entreprise: ["Tech SARL", "Banque Congo", "Hôtel Royal"][i],
  secteur: ["Informatique", "Finance", "Hôtellerie"][i],
  tuteur: {
    nom: "Mbayo",
    prenom: "Jean",
    fonction: "Superviseur",
    telephone: "+243812345678",
    email: "jean.mbayo@email.com",
  },
  dateDebut: "2026-04-01",
  dateFin: "2026-06-30",
  statut: "en_cours" as const,
  convention: true,
}));

export const INITIAL_EVENEMENTS: Evenement[] = [
  {
    id: "evt-1",
    titre: "Examen de fin de semestre",
    date: "2026-06-15",
    type: "examen",
    description: "Examen final pour toutes les filières",
  },
  {
    id: "evt-2",
    titre: "Soutenance des stages",
    date: "2026-07-01",
    type: "soutenance",
    description: "Présentation des rapports de stage",
  },
  {
    id: "evt-3",
    titre: "Réunion pédagogique",
    date: "2026-05-10",
    type: "reunion",
    description: "Réunion des enseignants",
  },
];