import { Routes } from '@angular/router';
import { AuthGuard, AdminGuard, PublicGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Public routes
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [PublicGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent),
    canActivate: [PublicGuard]
  },
  {
    path: 'verify-face',
    loadComponent: () => import('./pages/auth/face-verification/face-verification.component').then(m => m.FaceVerificationComponent),
    canActivate: [AuthGuard]
  },
  
  // Protected user routes
  {
    path: 'feed',
    loadComponent: () => import('./pages/feed/feed.component').then(m => m.FeedComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'explore',
    loadComponent: () => import('./pages/explore/explore.component').then(m => m.ExploreComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile/:id',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'matching',
    loadComponent: () => import('./pages/matching/matching.component').then(m => m.MatchingComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'travel',
    loadComponent: () => import('./pages/travel/travel.component').then(m => m.TravelComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'travel/:id',
    loadComponent: () => import('./pages/travel/travel-detail/travel-detail.component').then(m => m.TravelDetailComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'messages',
    loadComponent: () => import('./pages/messages/messages.component').then(m => m.MessagesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'messages/:id',
    loadComponent: () => import('./pages/messages/messages.component').then(m => m.MessagesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'notifications',
    loadComponent: () => import('./pages/notifications/notifications.component').then(m => m.NotificationsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent),
    canActivate: [AuthGuard]
  },
  
  // Admin routes
  {
    path: 'admin',
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/admin/users/users.component').then(m => m.UsersComponent)
      },
      {
        path: 'content',
        loadComponent: () => import('./pages/admin/content/content.component').then(m => m.ContentComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./pages/admin/reports/reports.component').then(m => m.ReportsComponent)
      },
      {
        path: 'analytics',
        loadComponent: () => import('./pages/admin/analytics/analytics.component').then(m => m.AnalyticsComponent)
      },
      {
        path: 'partners',
        loadComponent: () => import('./pages/admin/partners/partners.component').then(m => m.PartnersComponent)
      }
    ]
  },
  
  // Default routes
  {
    path: '',
    redirectTo: '/feed',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/feed'
  }
];
