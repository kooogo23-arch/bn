export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  company: string;
}

export const testimonialsData: Testimonial[] = [
  {
    id: 1,
    quote: "L'équipe de Booklite a restructuré notre base de données avec une efficacité remarquable. Le gain en performance est incroyable.",
    author: 'Jean Dupont',
    company: 'DSI chez TechCorp',
  },
  {
    id: 2,
    quote: "Leur expertise Merise est inégalée. Ils ont su concevoir une architecture qui supportera notre croissance pour les années à venir.",
    author: 'Marie Martin',
    company: 'CEO de InnovaSolutions',
  },
  {
    id: 3,
    quote: "La formation sur Merise dispensée par Booklite a été un véritable tournant. Nos équipes sont désormais totalement autonomes sur la modélisation, ce qui a accéléré nos cycles de développement de 30%. Un partenaire de confiance que je recommande vivement.",
    author: 'Paul Durand',
    company: 'Chef de Projet chez DataDriven',
  },
];