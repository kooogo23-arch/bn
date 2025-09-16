// Script pour nettoyer les erreurs de console liées aux extensions
// Ces erreurs n'affectent pas le fonctionnement de l'application

// Supprimer les erreurs d'extensions du navigateur
const originalError = console.error;
console.error = function(...args) {
  const message = args.join(' ');
  if (message.includes('message channel closed') || 
      message.includes('listener indicated an asynchronous response')) {
    return; // Ignorer ces erreurs d'extensions
  }
  originalError.apply(console, args);
};

console.log('✅ Console nettoyée - Erreurs d\'extensions masquées');