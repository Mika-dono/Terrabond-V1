# TerraBond - Documentation Complète

## Table des matières

1. [Architecture](#architecture)
2. [Technologies](#technologies)
3. [Microservices](#microservices)
4. [Base de données](#base-de-données)
5. [Frontend](#frontend)
6. [Services IA](#services-ia)
7. [Installation](#installation)
8. [Déploiement](#déploiement)
9. [API Reference](#api-reference)
10. [Sécurité](#sécurité)

---

## Architecture

TerraBond utilise une architecture microservices moderne et scalable :

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   Web App   │  │  Mobile App │  │    Partner Dashboard    │ │
│  │   (Angular) │  │   (Future)  │  │                         │ │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘ │
└─────────┼────────────────┼──────────────────────┼───────────────┘
          │                │                      │
          └────────────────┴──────────────────────┘
                           │
          ┌────────────────┴──────────────────────┐
          │         API GATEWAY (Spring Cloud)     │
          │              Port: 8080                │
          │  - Routing  - Load Balancing  - Auth   │
          └────────────────┬──────────────────────┘
                           │
    ┌──────────────────────┼──────────────────────┐
    │                      │                      │
┌───┴────┐  ┌────────┐  ┌─┴──────┐  ┌──────────┐  │  ┌──────────┐
│  Auth  │  │  User  │  │ Social │  │  Travel  │  │  │Messaging │
│Service │  │Service │  │Service │  │ Service  │  │  │ Service  │
│ :8081  │  │ :8082  │  │ :8083  │  │  :8084   │  │  │  :8085   │
└───┬────┘  └───┬────┘  └───┬────┘  └────┬─────┘  │  └────┬─────┘
    │           │           │            │        │       │
    └───────────┴───────────┴────────────┴────────┴───────┘
                            │
              ┌─────────────┴─────────────┐
              │      AI Service           │
              │    (Python/FastAPI)       │
              │         :8000             │
              │  - Face Recognition       │
              │  - Matching Algorithm     │
              │  - Recommendations        │
              │  - Risk Analysis          │
              │  - Chatbot                │
              └─────────────┬─────────────┘
                            │
              ┌─────────────┴─────────────┐
              │    PostgreSQL Database    │
              │         :5432             │
              │  - Multi-schema design    │
              └───────────────────────────┘
```

---

## Technologies

### Backend
- **Java 17**
- **Spring Boot 3.2.x**
- **Spring Cloud Gateway**
- **Spring Security (JWT)**
- **Spring Data JPA**
- **PostgreSQL 15**
- **Redis** (Cache)
- **WebSocket** (STOMP)
- **Maven**

### Frontend
- **Angular 17**
- **TypeScript 5.2**
- **RxJS 7.8**
- **Angular Material**
- **Tailwind CSS**
- **Socket.io-client**

### AI Service
- **Python 3.11**
- **FastAPI**
- **OpenCV** (Face Recognition)
- **face-recognition**
- **scikit-learn**
- **TensorFlow/Keras**
- **Groq LLM**

### Infrastructure
- **Docker**
- **Docker Compose**
- **Nginx** (Reverse Proxy)

---

## Microservices

### 1. Auth Service (Port 8081)

**Responsabilités:**
- Authentification (email/password)
- JWT Token management
- Face Recognition
- 2FA (Double Authentification)
- Password reset

**Endpoints:**
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `POST /api/auth/2fa/enable` - Activer 2FA
- `POST /api/auth/2fa/disable` - Désactiver 2FA
- `POST /api/auth/face/register` - Enregistrer visage

### 2. User Service (Port 8082)

**Responsabilités:**
- Gestion profil utilisateur
- Préférences voyage
- Test de personnalité (MBTI)
- Upload photos
- Vérification identité
- Relations (follow/unfollow)

**Endpoints:**
- `GET /api/users/me` - Profil connecté
- `GET /api/users/:id` - Profil utilisateur
- `PUT /api/users/:id` - Modifier profil
- `POST /api/users/:id/follow` - Suivre
- `DELETE /api/users/:id/follow` - Ne plus suivre

### 3. Social Service (Port 8083)

**Responsabilités:**
- Posts (CRUD)
- Stories éphémères (24h)
- Likes / Comments
- Hashtags
- Géolocalisation
- Feed personnalisé

**Endpoints:**
- `GET /api/social/feed` - Fil d'actualité
- `POST /api/social/posts` - Créer post
- `GET /api/social/posts/:id` - Voir post
- `POST /api/social/posts/:id/like` - Liker
- `GET /api/social/stories` - Voir stories
- `POST /api/social/stories` - Créer story

### 4. Travel Service (Port 8084)

**Responsabilités:**
- Catalogue offres voyage
- Réservations
- Travel Logs
- Partenaires agences
- Compagnons de voyage

**Endpoints:**
- `GET /api/travel/offers` - Liste offres
- `GET /api/travel/offers/:id` - Détail offre
- `POST /api/travel/bookings` - Réserver
- `GET /api/travel/logs` - Travel logs
- `POST /api/travel/logs` - Créer log

### 5. Messaging Service (Port 8085)

**Responsabilités:**
- Conversations 1-1 et groupe
- Messages temps réel (WebSocket)
- Partage média
- Réponses aux stories

**Endpoints:**
- `GET /api/messaging/conversations` - Conversations
- `POST /api/messaging/conversations` - Nouvelle conversation
- `GET /api/messaging/conversations/:id/messages` - Messages
- `POST /api/messaging/conversations/:id/messages` - Envoyer message
- WebSocket: `/ws/messaging`

---

## Base de données

### Schémas

1. **terrabond_auth** - Utilisateurs et authentification
2. **terrabond_user** - Profils et préférences
3. **terrabond_social** - Posts, stories, comments
4. **terrabond_travel** - Offres, réservations, logs
5. **terrabond_messaging** - Conversations, messages
6. **terrabond_ai** - Tests de personnalité, matches

### Tables principales

**Users:**
```sql
- id (PK)
- email, password
- first_name, last_name, username
- profile_picture, cover_picture
- face_encoding_data, face_verified
- roles, is_active, is_banned
- created_at, updated_at
```

**Posts:**
```sql
- id (PK)
- content, type
- media_urls[], location
- privacy, hashtags[]
- author_id (FK)
- created_at
```

---

## Frontend

### Structure des pages

**Public:**
- `/login` - Connexion
- `/register` - Inscription

**Utilisateur (AuthGuard):**
- `/feed` - Fil d'actualité
- `/explore` - Explorer
- `/profile/:id` - Profil
- `/matching` - Matching IA
- `/travel` - Voyages
- `/messages` - Messagerie
- `/notifications` - Notifications
- `/settings` - Paramètres

**Admin (AdminGuard):**
- `/admin/dashboard` - Tableau de bord
- `/admin/users` - Gestion utilisateurs
- `/admin/content` - Modération
- `/admin/reports` - Signalements
- `/admin/analytics` - Statistiques

---

## Services IA

### Agents

1. **Matching Agent**
   - Calcul compatibilité 0-100%
   - Critères: Personnalité, Intérêts, Voyage, Localisation
   - Algorithme: MBTI + Big Five + Jaccard similarity

2. **Recommendation Agent**
   - Suggestions de connexions
   - Recommandations de voyages
   - Contenu personnalisé

3. **Risk Analysis Agent**
   - Détection de fraude
   - Anti-spoofing (reconnaissance faciale)
   - Analyse comportementale

4. **Conversational Agent**
   - Chatbot IA
   - Support utilisateur
   - Powered by Groq LLM

5. **Face Recognition Agent**
   - Vérification faciale
   - Anti-spoofing
   - Encodage/décodage

---

## Installation

### Prérequis

- Docker & Docker Compose
- Java 17+
- Node.js 18+
- Python 3.11+

### Démarrage rapide

```bash
# 1. Cloner le repository
git clone https://github.com/terrabond/terrabond.git
cd terrabond

# 2. Démarrer tous les services
docker-compose up -d

# 3. Vérifier les logs
docker-compose logs -f

# 4. Accéder à l'application
# Frontend: http://localhost:4200
# API Gateway: http://localhost:8080
# AI Service: http://localhost:8000
```

### Développement local

```bash
# Backend
cd backend
mvn clean install
mvn spring-boot:run -pl auth-service

# Frontend
cd frontend
npm install
npm start

# AI Service
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## Déploiement

### Production

```bash
# Build images
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Scaling

```bash
# Scale un service
docker-compose up -d --scale auth-service=3
```

---

## API Reference

### Authentification

**Register:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "dateOfBirth": "1990-01-01",
  "gender": "MALE"
}
```

**Login:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "type": "Bearer",
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "roles": ["USER"]
  }
}
```

---

## Sécurité

### Mesures implémentées

1. **Authentification**
   - JWT tokens avec expiration
   - Refresh tokens
   - 2FA (TOTP)
   - Face recognition

2. **Autorisation**
   - RBAC (Role-Based Access Control)
   - AdminGuard pour routes admin
   - AuthGuard pour routes protégées

3. **Données**
   - Chiffrement mots de passe (BCrypt)
   - HTTPS/TLS
   - Validation entrées

4. **IA Sécurité**
   - Anti-spoofing (face recognition)
   - Détection comportementale
   - Rate limiting

---

## Équipe de Développement Scrum

### Rôles

- **Product Owner** - Vision produit
- **Scrum Master** - Facilitation
- **4 Développeurs Full Stack** - Implémentation
- **1 DevOps** - Infrastructure
- **1 UX/UI Designer** - Design

### Sprints

- Durée: 2 semaines
- Planning: Lundi matin
- Daily: 9h00 (15 min)
- Review: Vendredi après-midi
- Rétrospective: Vendredi fin de journée

---

## License

Copyright © 2026 TerraBond. Tous droits réservés.

---

## Contact

- Email: contact@terrabond.com
- Support: support@terrabond.com
- Site: https://terrabond.com
