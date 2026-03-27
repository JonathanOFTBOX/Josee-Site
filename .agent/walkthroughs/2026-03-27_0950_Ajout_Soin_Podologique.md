# Walkthrough: Ajout Soin Podologique avec vernis gel

**Date:** 2026-03-27 09:50

## Changements apportés

1. **`src/pages/BookingPage.tsx`** :
   - Ajout d'une nouvelle option dans la constante `SERVICE_CATEGORIES` sous l'identifiant `podologie`.
   - L'item a été ajouté : `{ id: 'podo-gel', name: 'Soin podologique avec application de vernis gel', duration: '2h à 2h30', price: 100 }`.
   - *Note : Le prix et la durée ont été fixés temporairement et devront être revus par l'administrateur.*

2. **`src/components/Services.tsx`** :
   - Vérification de la page. Aucune modification nécessaire car le texte actuel couvre déjà l'option "vernis".

## Validation
- [x] L'option s'affiche correctement dans le formulaire de réservation (BookingPage).
- [x] Le calcul du Total prend en compte le prix du nouveau service.
- [x] Les extras restent compatibles avec le nouveau service.

## Tâches en attente
- [ ] Confirmer le prix exact et la durée avec **Josee**.
