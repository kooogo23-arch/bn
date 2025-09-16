// Script pour configurer un accès admin temporaire
// Exécuter dans la console du navigateur (F12)

// Ajouter un token admin
localStorage.setItem('authToken', 'fake-jwt-token-admin-' + Date.now());

// Recharger la page
window.location.reload();

console.log('Token admin ajouté ! Vous pouvez maintenant accéder au dashboard.');