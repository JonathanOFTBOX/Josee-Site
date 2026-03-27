---
name: marcus-memory
description: Compétence obligatoire pour Marcus (le Builder). À la fin de chaque tâche d'architecture ou de code, tu dois générer un fichier markdown atomique décrivant ce que tu as construit.
---

# Protocole de Synthèse de Marcus (GraphRAG)

## 📌 POURQUOI CETTE COMPÉTENCE ?
En tant que Builder / Coder (Marcus), tu construis des choses complexes (UI, algorithmes, logique). Victor a besoin de savoir EXACTEMENT ce que tu as accompli pour l'intégrer au reste de l'architecture. Tout doit être tracé.

## ⚙️ RÈGLES DE CRÉATION
À chaque fin de tâche ou d'intervention de code, tu DOIS créer un fichier atomique dans le dossier `C:\Users\jogor\.openclaw\workspace\memory\`.

- **1 Fichier = 1 Feature / Composant / Script / Résolution de Bug.**
- Ajoute un préfixe logique à ton ID, comme `feat-`, `bug-`, ou `script-`.
- Interdiction totale de faire des pages `2026-03-XX.md` (Logs journaliers). Reste atomique.

## 📄 GABARIT OBLIGATOIRE (FRONTMATTER YAML)

Chaque mémoire que tu pousses dans le GraphRAG doit comporter ce YAML exact en haut de la page :

```yaml
---
id: [identifiant-unique-de-la-tache]
type: [feature|bug|task|technology]
title: [Titre descriptif de ce que tu as bâti]
creation: [YYYY-MM-DDTHH:mm:ssZ]
last_accessed: [YYYY-MM-DDTHH:mm:ssZ]
weight: 1.5
decay_rate: 0.05
links:
  - [id-du-projet-parent]
  - [ids-des-technologies-utilisees]
---

# Contexte Technique

**Fichiers Créés / Modifiés :**
- `Chemin/vers/fichier1` : [Ce que ça fait]
- `Chemin/vers/fichier2` : [Ce que ça fait]

**Décisions d'Architecture (Raisonnement) :**
Explique pourquoi tu as choisi telle approche (ex: "J'ai forcé le material MeshPhysicalMaterial pour obtenir une émission de lumière proportionnelle au weight...").

**Comment le tester / Le vérifier :**
Indique comment s'assurer que ton code fonctionne.
```

## 🔄 FRÉQUENCE ET DÉCLENCHEUR
Applique ce Skill dès que tu complètes une mission technique donnée par John ou par Victor. 
Avant de dire "C'est fait !", assure-toi que ta trace réside dans le cerveau afin que l'Agent RRF puisse un jour la retrouver !
