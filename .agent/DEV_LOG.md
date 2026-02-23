# Journal des Fixes & Développements - Josee Site

Ce fichier trace toutes les interventions réalisées par l'équipe Marcus (Architecte) + Claude 4.6 Opus (Builder).

---

## Modèle de log (À copier pour chaque nouveau ticket)

### [ID-00X] Titre du problème ou de la feature
**Date :** YYYY-MM-DD
**Statut :** 🟡 EN COURS / 🟢 COMPLÉTÉ

**1. Problème / Demande :**
*Description du bug ou de la fonctionnalité demandée.*

**2. Analyse (Marcus) :**
*Fichiers impactés :*
- `src/...`
*Diagnostic :* ...

**3. Prompt pour Claude 4.6 Opus :**
```text
(Copier le prompt généré ici)
```

**4. Solution Appliquée :**
*Résumé des changements ou lien vers le commit.*

---

## Historique

### [FEAT-PRIVACY-001] Anonymisation Noms Témoignages
**Date :** 2026-02-17
**Statut :** 🟡 À FAIRE

**1. Problème / Demande :**
Sur les cartes de témoignages (section Avant/Après), les noms complets des clients sont affichés (ex: "Marie-Claire D.").
Demande client : Afficher uniquement les **2 premières initiales** pour plus de confidentialité (ex: "M.C." ou "M. D.").

**2. Référence :**
Screenshot ajouté dans `.agent/assets/screenshots/initials_privacy_request.jpg`.

**3. Analyse (À venir) :**
Il faudra identifier le composant React qui affiche ces cartes et modifier le formatage du nom.

---

### [FEAT-CALENDLY-002] Routing Form (Domicile vs Local)
**Date :** 2026-02-17
**Statut :** 🟡 À FAIRE

**1. Problème / Demande :**
Le système de prise de RDV doit distinguer deux types de lieux :
1.  **À Domicile**
2.  **Au Local** (Nouveau lieu physique)

L'utilisateur doit avoir un choix clair ("Routing Form") qui le redirige vers le bon agenda Calendly.

**2. Référence :**
Screenshot ajouté dans `.agent/assets/screenshots/calendly_routing.jpg`.

**3. Action Requise :**
- Créer/Configurer le Routing Form dans Calendly (Action admin).
- Mettre à jour le lien/widget sur le site web pour pointer vers ce nouveau Routing Form.
