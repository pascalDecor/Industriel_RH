import { ValidationResult, ComplianceIssue, Document } from '../context/ComplianceContext';

export const mockValidateDocument = async (documentId: string): Promise<ValidationResult> => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const score = Math.floor(Math.random() * 101);
  const status = score >= 75 ? 'compliant' : 'non-compliant';
  
  const issues: ComplianceIssue[] = [];
  
  if (score < 100) {
    const possibleIssues = [
      {
        severity: 'high',
        section: 'Identification des parties',
        description: 'Identification incomplète de l\'employeur ou de l\'employé.',
        recommendation: 'Inclure le nom complet, l\'adresse et les coordonnées des deux parties.',
        correction: 'Ajout des informations complètes de l\'employeur: [Nom de l\'entreprise], situé au [Adresse complète], et de l\'employé: [Nom complet], résidant au [Adresse complète].'
      },
      {
        severity: 'high',
        section: 'Rémunération',
        description: 'Absence de mention du taux horaire ou du salaire annuel.',
        recommendation: 'Préciser clairement le taux de rémunération et la fréquence de paiement.',
        correction: 'Le salaire est fixé à [montant] $ par [heure/année], payable sur une base [hebdomadaire/bi-hebdomadaire/mensuelle].'
      },
      {
        severity: 'medium',
        section: 'Horaire de travail',
        description: 'Horaire de travail non précisé ou ambigu.',
        recommendation: 'Détailler les heures de travail attendues par jour et par semaine.',
        correction: 'L\'horaire de travail régulier est de [X] heures par semaine, du [jour] au [jour], de [heure] à [heure].'
      },
      {
        severity: 'medium',
        section: 'Période de probation',
        description: 'Durée de la période de probation non conforme aux normes.',
        recommendation: 'S\'assurer que la période de probation ne dépasse pas 3 mois pour les employés réguliers.',
        correction: 'La période de probation est fixée à trois (3) mois à compter de la date d\'entrée en fonction.'
      },
      {
        severity: 'low',
        section: 'Avantages sociaux',
        description: 'Description vague des avantages sociaux offerts.',
        recommendation: 'Détailler précisément les avantages sociaux, assurances et autres bénéfices.',
        correction: 'L\'employé bénéficie des avantages sociaux suivants: assurance maladie collective, assurance dentaire, régime de retraite avec contribution de l\'employeur à hauteur de X%, 3 semaines de vacances payées.'
      },
      {
        severity: 'high',
        section: 'Clauses de non-concurrence',
        description: 'Clause de non-concurrence trop restrictive.',
        recommendation: 'Limiter la portée géographique et temporelle de la clause de non-concurrence.',
        correction: 'La clause de non-concurrence est limitée à une durée de six (6) mois suivant la fin de l\'emploi et s\'applique uniquement dans un rayon de 50 kilomètres du lieu de travail principal.'
      },
      {
        severity: 'medium',
        section: 'Vacances et congés',
        description: 'Information incomplète sur les droits aux vacances et congés.',
        recommendation: 'Préciser le nombre de jours de vacances et la politique de congés selon les normes CNESST.',
        correction: 'L\'employé a droit à [X] semaines de vacances payées par année, ainsi qu\'aux jours fériés prévus par la loi. Les congés de maladie sont accordés selon les normes de la CNESST.'
      }
    ];
    
    const numIssues = score >= 75 ? 1 : Math.min(5, Math.ceil((100 - score) / 20));
    const shuffled = [...possibleIssues].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < numIssues; i++) {
      const baseIssue = shuffled[i];
      const issue: ComplianceIssue = {
        id: Math.random().toString(36).substring(2, 9),
        severity: baseIssue.severity as 'high' | 'medium' | 'low',
        section: baseIssue.section,
        description: baseIssue.description,
        recommendation: baseIssue.recommendation,
        correction: baseIssue.correction,
        lineNumber: Math.floor(Math.random() * 20) + 1
      };
      
      issues.push(issue);
    }
  }
  
  return {
    documentId,
    status,
    score,
    issues,
    validatedOn: new Date()
  };
};

export const mockCorrectDocument = async (documentId: string): Promise<Document> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // In a real implementation, this would generate a corrected version of the document
  // For now, we'll simulate a corrected document URL
  return {
    id: documentId,
    name: 'document.pdf',
    uploadDate: new Date(),
    size: 1024,
    type: 'application/pdf',
    status: 'compliant',
    correctedVersion: {
      url: `https://example.com/corrected-${documentId}.pdf`,
      generatedAt: new Date()
    }
  };
};