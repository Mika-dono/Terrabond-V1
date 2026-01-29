# TerraBond - Plateforme Digitale Intelligente de Réseau Social Orientée Voyage

## Architecture Microservices

```
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway (Spring Cloud)               │
│                      Port: 8080                              │
└─────────────────────────────────────────────────────────────┘
          │           │           │           │           │
    ┌─────┴─────┐ ┌───┴───┐ ┌────┴────┐ ┌────┴────┐ ┌────┴────┐
    │   Auth    │ │ User  │ │ Social  │ │ Travel  │ │Messaging│
    │  Service  │ │Profile│ │ Service │ │ Service │ │ Service │
    │  :8081    │ │ :8082 │ │  :8083  │ │  :8084  │ │  :8085  │
    └───────────┘ └───────┘ └─────────┘ └─────────┘ └─────────┘
          │           │           │           │           │
          └───────────┴───────────┴───────────┴───────────┘
                              │
                    ┌─────────┴─────────┐
                    │   AI Service      │
                    │   (Python/FastAPI)│
                    │      :8000        │
                    └───────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │   PostgreSQL      │
                    │   Database        │
                    │     :5432         │
                    └───────────────────┘
```

## Services

### 1. Auth Service (Port 8081)
- Inscription / Connexion
- JWT Token management
- Face Recognition
- 2FA (Double Authentification)
- Password reset

### 2. User Profile Service (Port 8082)
- Gestion profil utilisateur
- Préférences voyage
- Test de personnalité (MBTI)
- Upload photos
- Vérification identité

### 3. Social Service (Port 8083)
- Posts (CRUD)
- Stories éphémères (24h)
- Likes / Comments
- Hashtags
- Géolocalisation
- Feed personnalisé

### 4. Travel Service (Port 8084)
- Catalogue offres voyage
- Réservations
- Travel Logs
- Partenaires agences
- Compagnons de voyage

### 5. Messaging Service (Port 8085)
- Conversations 1-1 et groupe
- Messages temps réel (WebSocket)
- Partage média
- Réponses aux stories

### 6. AI Service (Port 8000)
- Matching Agent (compatibilité)
- Recommendation Agent
- Risk Analysis Agent (anti-fraude)
- Conversational Agent (chatbot)
- Face Recognition v2

## Frontend Angular

### Pages Utilisateur
- `/login` - Connexion
- `/register` - Inscription
- `/verify-face` - Vérification faciale
- `/feed` - Fil d'actualité
- `/profile/:id` - Profil utilisateur
- `/explore` - Explorer
- `/matching` - Matching IA
- `/travel` - Voyages
- `/messages` - Messagerie
- `/notifications` - Notifications
- `/settings` - Paramètres

### Pages Admin (Protégées)
- `/admin/dashboard` - Tableau de bord
- `/admin/users` - Gestion utilisateurs
- `/admin/content` - Modération contenu
- `/admin/reports` - Signalements
- `/admin/analytics` - Statistiques
- `/admin/partners` - Gestion partenaires

## Technologies

### Backend
- Java 17
- Spring Boot 3.x
- Spring Cloud Gateway
- Spring Security (JWT)
- Spring Data JPA
- PostgreSQL
- WebSocket (STOMP)
- Maven

### Frontend
- Angular 17+
- TypeScript
- RxJS
- Angular Material
- Tailwind CSS
- Socket.io-client

### AI Service
- Python 3.11
- FastAPI
- TensorFlow/PyTorch
- OpenCV (Face Recognition)
- scikit-learn
- Groq LLM

## Installation

### Prérequis
- Java 17+
- Node.js 18+
- Python 3.11+
- PostgreSQL 15+
- Maven 3.9+

### Démarrage

```bash
# 1. Démarrer PostgreSQL
docker-compose up -d postgres

# 2. Démarrer les services backend
cd backend && mvn spring-boot:run

# 3. Démarrer le service AI
cd ai-service && python main.py

# 4. Démarrer le frontend
cd frontend && npm start
```

## Équipe de Développement Scrum

- Product Owner
- Scrum Master
- 4 Développeurs Full Stack
- 1 DevOps
- 1 UX/UI Designer

---
© 2026 TerraBond - Tous droits réservés
