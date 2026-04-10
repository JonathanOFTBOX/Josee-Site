# Mandat d'Ingénierie (De: Victor, Architecte)

## 1. Objectif Exécutif (Feature)
Mise à jour tarifaire globale pour la cliente Josée Mc Intyre.
Augmentation de 10 $ sur les services de **BASE** à domicile offerts sur la plateforme de réservation.

## 2. Emplacements Physiques Cibles
- Dossier Projet : `C:\Users\jogor\OneDrive\Documents\GitHub\Josee Site`
- Base de données : Fichiers liés au schéma Supabase (ex: table `services`) ou constante *hardcodée* dans le frontend React (si les prix ne sont pas dynamiques).

## 3. Diagnostic d'Architecte (Logique d'Affaires)
Le CEO a approuvé la demande de la cliente le 2026-04-09.
- **Action (Update) :** Marcus DOIT identifier la source de vérité des prix des services pour les options "à domicile" (at-home services).
- Il faut appliquer une addition mathématique stricte de `+ 10.00 $` sur la valeur de chaque service de base ciblé.
- **CONTRAINTE STRICTE (Validation Client) :** L'augmentation NE S'APPLIQUE PAS aux extras/add-ons. Elle est réservée uniquement aux tarifs de base.
- Il NE FAUT PAS augmenter les services en salon (s'il y a une distinction dans l'UI). Si tous les services sont à domicile, appliquer la hausse aux services de base globaux.

## 4. Critères d'Acceptation (QA)
- Tous les services de BASE à domicile affichés sur le site web de Josée reflètent le nouveau tarif (+10$).
- Les EXTRAS restent à leur prix original (0$ d'augmentation).
- Le processus de réservation calcule le total correct lors du passage à la caisse (Checkout) avec le nouveau montant.
- Aucun service "en salon" (s'il y a lieu) n'a été affecté par erreur.