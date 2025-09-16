export interface Post {
  id: string;
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  content: string;
  tags: string[];
  published: boolean;
}

export const allPosts: Post[] = [
  {
    id: '1',
    slug: '5-erreurs-merise',
    title: 'Les 5 erreurs à éviter en modélisation Merise',
    date: '2024-07-15',
    author: "L'équipe Booklite",
    excerpt: 'La méthode Merise est puissante, mais quelques erreurs courantes peuvent compromettre la robustesse de votre système. Découvrez les pièges à éviter...',
    content: '<h2>Les 5 erreurs courantes en Merise</h2><p>La méthode Merise reste une référence pour la conception de bases de données. Voici les 5 erreurs les plus fréquentes :</p><ol><li><strong>Négliger l\'analyse des besoins</strong> - Commencer la modélisation sans comprendre les processus métier</li><li><strong>Mauvaise identification des entités</strong> - Confondre attributs et entités</li><li><strong>Cardinalités incorrectes</strong> - Mal définir les relations entre entités</li><li><strong>Oublier la normalisation</strong> - Ne pas respecter les formes normales</li><li><strong>Ignorer les contraintes d\'intégrité</strong> - Omettre les règles de gestion</li></ol><p>En évitant ces pièges, vous garantissez la robustesse de votre système d\'information.</p>',
    tags: ['merise', 'conseils'],
    published: true,
  },
  {
    id: '2',
    slug: 'pourquoi-mcd-crucial',
    title: "Pourquoi le MCD est l'étape la plus cruciale de votre projet",
    date: '2024-07-02',
    author: "L'équipe Booklite",
    excerpt: "Bien avant la première ligne de code, le Modèle Conceptuel de Données (MCD) jette les bases de la réussite. Nous explorons pourquoi cette étape ne doit jamais être négligée...",
    content: '<h2>L\'importance du MCD</h2><p>Le Modèle Conceptuel de Données est la fondation de tout système d\'information robuste. Il permet de :</p><ul><li>Comprendre et formaliser les besoins métier</li><li>Identifier les entités et leurs relations</li><li>Éviter les erreurs coûteuses en développement</li><li>Faciliter la communication entre équipes</li></ul><p>Un MCD bien conçu économise des mois de refactoring et garantit la pérennité de votre application.</p>',
    tags: ['mcd', 'fondamentaux'],
    published: true,
  },
  {
    id: '3',
    slug: 'mld-vers-sql',
    title: 'Du MLD au SQL : La traduction automatique',
    date: '2024-06-25',
    author: "L'équipe Booklite",
    excerpt: "Le Modèle Logique de Données (MLD) est le plan directeur de votre base de données. Découvrez comment le traduire fidèlement en code SQL...",
    content: '<h2>Transformation MLD vers SQL</h2><p>Le passage du MLD au SQL suit des règles précises que nous détaillons ici...</p>',
    tags: ['mld', 'sql'],
    published: false,
  },
  {
    id: '4',
    slug: 'donnees-complexes',
    title: 'Gestion des données complexes : Associations ternaires et plus',
    date: '2024-06-18',
    author: "L'équipe Booklite",
    excerpt: "Certaines relations ne peuvent être décrites par une simple association binaire. Nous plongeons dans les cas d'usage des associations de plus haut degré...",
    content: '<h2>Associations complexes</h2><p>Les associations ternaires et de degré supérieur permettent de modéliser des relations complexes...</p>',
    tags: ['modélisation', 'avancé'],
    published: false,
  },
  {
    id: '5',
    slug: 'importance-identifiants',
    title: "L'importance des identifiants uniques dans votre modèle",
    date: '2024-06-10',
    author: "L'équipe Booklite",
    excerpt: "La clé primaire est le cœur de chaque entité. Nous discutons des meilleures pratiques pour choisir et gérer les identifiants...",
    content: '<h2>Identifiants et clés primaires</h2><p>Le choix des identifiants est crucial pour la performance et l\'intégrité des données...</p>',
    tags: ['modélisation', 'fondamentaux'],
    published: false,
  },
];