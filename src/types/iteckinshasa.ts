export interface Apprenant {
  id: string;
  matricule: string;
  nom: string;
  postnom: string;
  prenom: string;
  sexe: "M" | "F";
  telephone: string;
  commune: string;
  formationId: string;
  promotion: string;
  dateInscription: string;
  statutApprenant: "actif" | "diplome" | "abandon";
  fraisFormationPayerCDF: number;
  fraisTechniquePayerUSD: number;
}

export interface Formation {
  id: string;
  nom: string;
  dureeMois: number;
  fraisFormationCDF: number;
  fraisFormationUSD: number;
  fraisTechniqueUSD: number;
  fraisTechniqueCDF: number;
  acompteCDF: number;
  mensualiteCDF: number;
  detailsEcheancier?: string;
  niveauPrecision?: string;
  description?: string;
  couleurBadge: string;
  actif?: boolean;
}

export interface Paiement {
  id: string;
  apprenantId: string;
  typeFrais: "formation" | "technique";
  montantCDF: number;
  montantUSD: number;
  devisePaiement: "CDF" | "USD";
  modePaiement: string;
  datePaiement: string;
  recuNumero: string;
  agentCaisse: string;
}