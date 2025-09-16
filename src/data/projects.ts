export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  date: string;
  client?: string;
  duration?: string;
}

export const allProjects: Project[] = [
  {
    id: 'alpha',
    title: 'Système E-commerce Alpha',
    description: 'Modélisation complète d\'une plateforme e-commerce avec gestion des commandes, stocks et clients.',
    image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['mcd', 'mld', 'e-commerce'],
    link: '/projets/alpha',
    date: '2024-06-15',
    client: 'TechCommerce SAS',
    duration: '3 mois'
  },
  {
    id: 'beta',
    title: 'Système RH Beta',
    description: 'Base de données pour la gestion des ressources humaines avec suivi des employés et paie.',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['mcd', 'gestion', 'rh'],
    link: '/projets/beta',
    date: '2024-05-20',
    client: 'HumanTech Corp',
    duration: '2 mois'
  },
  {
    id: 'gamma',
    title: 'Système Financier Gamma',
    description: 'Architecture de données pour application bancaire avec transactions et comptes clients.',
    image: 'https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['mld', 'sql', 'finance'],
    link: '/projets/gamma',
    date: '2024-04-10',
    client: 'Banque Digitale',
    duration: '4 mois'
  },
  {
    id: 'delta',
    title: 'Entrepôt de Données Delta',
    description: 'Conception d\'un data warehouse pour l\'analyse et le reporting d\'entreprise.',
    image: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['bi', 'analyse', 'reporting'],
    link: '/projets/delta',
    date: '2024-03-05',
    client: 'DataCorp Analytics',
    duration: '5 mois'
  },
  {
    id: 'epsilon',
    title: 'Système Éducatif Epsilon',
    description: 'Base de données pour établissement scolaire avec gestion des étudiants et cours.',
    image: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['mcd', 'education', 'gestion'],
    link: '/projets/epsilon',
    date: '2024-02-12',
    client: 'Université Moderne',
    duration: '3 mois'
  },
  {
    id: 'zeta',
    title: 'Système Médical Zeta',
    description: 'Modélisation pour cabinet médical avec dossiers patients et rendez-vous.',
    image: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['mld', 'sante', 'medical'],
    link: '/projets/zeta',
    date: '2024-01-08',
    client: 'Clinique Santé+',
    duration: '2 mois'
  },
];