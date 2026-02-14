import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { Post, Story } from '../../models/post.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatDividerModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="feed-container">
      <!-- Navigation Sidebar -->
      <nav class="sidebar">
        <div class="sidebar-header">
          <a routerLink="/feed" class="logo">
            <mat-icon class="logo-icon">travel_explore</mat-icon>
            <span>TerraBond</span>
          </a>
        </div>
        
        <div class="nav-links">
          <a routerLink="/feed" class="nav-link active">
            <mat-icon>home</mat-icon>
            <span>Accueil</span>
          </a>
          <a routerLink="/explore" class="nav-link">
            <mat-icon>explore</mat-icon>
            <span>Explorer</span>
          </a>
          <a routerLink="/matching" class="nav-link">
            <mat-icon>favorite</mat-icon>
            <span>Matching</span>
          </a>
          <a routerLink="/travel" class="nav-link">
            <mat-icon>flight</mat-icon>
            <span>Voyages</span>
          </a>
          <a routerLink="/messages" class="nav-link">
            <mat-icon>chat</mat-icon>
            <span>Messages</span>
            <span class="badge" *ngIf="unreadMessages > 0">{{ unreadMessages }}</span>
          </a>
          <a routerLink="/notifications" class="nav-link">
            <mat-icon>notifications</mat-icon>
            <span>Notifications</span>
            <span class="badge" *ngIf="unreadNotifications > 0">{{ unreadNotifications }}</span>
          </a>
          <a [routerLink]="['/profile', currentUser?.id]" class="nav-link">
            <mat-icon>person</mat-icon>
            <span>Profil</span>
          </a>
          <a routerLink="/settings" class="nav-link">
            <mat-icon>settings</mat-icon>
            <span>Paramètres</span>
          </a>
        </div>
        
        <div class="sidebar-footer">
          <button mat-stroked-button class="logout-btn" (click)="logout()">
            <mat-icon>logout</mat-icon>
            <span>Déconnexion</span>
          </button>
        </div>
      </nav>
      
      <!-- Main Content -->
      <main class="main-content">
        <!-- Stories Section -->
        <div class="stories-section">
          <div class="create-story" (click)="createStory()">
            <div class="story-avatar">
              <img [src]="currentUser?.profilePicture || 'assets/default-avatar.png'" alt="Your story">
              <div class="add-icon">
                <mat-icon>add</mat-icon>
              </div>
            </div>
            <span>Votre story</span>
          </div>
          
          <div class="stories-list">
            <div class="story-item" *ngFor="let story of stories" (click)="viewStory(story)">
              <div class="story-avatar" [class.viewed]="story.isViewed">
                <img [src]="story.author.profilePicture || 'assets/default-avatar.png'" [alt]="story.author.username">
              </div>
              <span>{{ story.author.username }}</span>
            </div>
          </div>
        </div>
        
        <!-- Create Post -->
        <mat-card class="create-post-card">
          <div class="create-post-header">
            <img [src]="currentUser?.profilePicture || 'assets/default-avatar.png'" class="user-avatar" alt="User">
            <div class="create-post-input" (click)="openCreatePostDialog()">
              <span>Qu'avez-vous en tête, {{ currentUser?.firstName }} ?</span>
            </div>
          </div>
          <mat-divider></mat-divider>
          <div class="create-post-actions">
            <button mat-button (click)="openCreatePostDialog('image')">
              <mat-icon color="accent">image</mat-icon>
              <span>Photo</span>
            </button>
            <button mat-button (click)="openCreatePostDialog('video')">
              <mat-icon color="warn">videocam</mat-icon>
              <span>Vidéo</span>
            </button>
            <button mat-button (click)="openCreatePostDialog('location')">
              <mat-icon color="primary">location_on</mat-icon>
              <span>Lieu</span>
            </button>
          </div>
        </mat-card>
        
        <!-- Posts Feed -->
        <div class="posts-feed">
          <mat-card class="post-card" *ngFor="let post of posts">
            <div class="post-header">
              <a [routerLink]="['/profile', post.author.id]" class="post-author">
                <img [src]="post.author.profilePicture || 'assets/default-avatar.png'" class="author-avatar" [alt]="post.author.username">
                <div class="author-info">
                  <span class="author-name">{{ post.author.firstName }} {{ post.author.lastName }}</span>
                  <span class="post-time">{{ formatDate(post.createdAt) }}</span>
                </div>
              </a>
              <button mat-icon-button [matMenuTriggerFor]="postMenu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #postMenu="matMenu">
                <button mat-menu-item (click)="savePost(post)">
                  <mat-icon>bookmark</mat-icon>
                  <span>Enregistrer</span>
                </button>
                <button mat-menu-item (click)="reportPost(post)">
                  <mat-icon>flag</mat-icon>
                  <span>Signaler</span>
                </button>
                <button mat-menu-item *ngIf="post.author.id === currentUser?.id" (click)="deletePost(post)">
                  <mat-icon>delete</mat-icon>
                  <span>Supprimer</span>
                </button>
              </mat-menu>
            </div>
            
            <div class="post-content">
              <p>{{ post.content }}</p>
              <div class="post-media" *ngIf="post.mediaUrls?.length">
                <img *ngFor="let url of post.mediaUrls" [src]="url" alt="Post media">
              </div>
              <div class="post-location" *ngIf="post.location">
                <mat-icon>location_on</mat-icon>
                <span>{{ post.location }}</span>
              </div>
            </div>
            
            <div class="post-stats">
              <span>{{ post.likesCount }} J'aime</span>
              <span>{{ post.commentsCount }} commentaires</span>
              <span>{{ post.shareCount }} partages</span>
            </div>
            
            <mat-divider></mat-divider>
            
            <div class="post-actions">
              <button mat-button (click)="likePost(post)" [class.liked]="post.isLiked">
                <mat-icon>{{ post.isLiked ? 'favorite' : 'favorite_border' }}</mat-icon>
                <span>J'aime</span>
              </button>
              <button mat-button (click)="showComments(post)">
                <mat-icon>chat_bubble_outline</mat-icon>
                <span>Commenter</span>
              </button>
              <button mat-button (click)="sharePost(post)">
                <mat-icon>share</mat-icon>
                <span>Partager</span>
              </button>
            </div>
          </mat-card>
        </div>
        
        <!-- Loading Indicator -->
        <div class="loading-more" *ngIf="loading">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      </main>
      
      <!-- Right Sidebar -->
      <aside class="right-sidebar">
        <!-- Trending -->
        <mat-card class="sidebar-card">
          <h3>Tendances pour vous</h3>
          <div class="trending-item" *ngFor="let hashtag of trendingHashtags">
            <a [routerLink]="['/explore']" [queryParams]="{hashtag: hashtag}">
              <span class="hashtag">#{{ hashtag }}</span>
            </a>
          </div>
        </mat-card>
        
        <!-- Suggested Users -->
        <mat-card class="sidebar-card">
          <h3>Personnes à suivre</h3>
          <div class="suggested-user" *ngFor="let user of suggestedUsers">
            <a [routerLink]="['/profile', user.id]" class="user-info">
              <img [src]="user.profilePicture || 'assets/default-avatar.png'" [alt]="user.username">
              <div>
                <span class="user-name">{{ user.firstName }} {{ user.lastName }}</span>
                <span class="user-username">{{'@'}}{{ user.username }}</span>
              </div>
            </a>
            <button mat-icon-button color="primary" (click)="followUser(user)">
              <mat-icon>person_add</mat-icon>
            </button>
          </div>
        </mat-card>
        
        <!-- Footer -->
        <div class="footer-links">
          <a href="#">À propos</a>
          <a href="#">Confidentialité</a>
          <a href="#">Conditions</a>
          <a href="#">Publicité</a>
          <span>© 2026 TerraBond</span>
        </div>
      </aside>
    </div>
  `,
  styles: [`
    .feed-container {
      display: grid;
      grid-template-columns: 280px 1fr 350px;
      min-height: 100vh;
      background: #000000;
      gap: 24px;
      padding: 0 24px;
    }
    
    // Sidebar
    .sidebar {
      position: fixed;
      left: 0;
      top: 0;
      width: 280px;
      height: 100vh;
      background: #000000;
      border-right: 1px solid #3D3D3D;
      display: flex;
      flex-direction: column;
      padding: 20px;
      z-index: 100;
    }
    
    .sidebar-header {
      margin-bottom: 32px;
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      
      .logo-icon {
        font-size: 36px;
        width: 36px;
        height: 36px;
        background: linear-gradient(135deg, #FF5A65, #FF0500);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      
      span {
        font-size: 24px;
        font-weight: 700;
        background: linear-gradient(135deg, #FF5A65, #FF0500);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
    
    .nav-links {
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
    }
    
    .nav-link {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 16px;
      border-radius: 12px;
      color: #C1C1C1;
      text-decoration: none;
      transition: all 0.3s ease;
      position: relative;
      
      &:hover, &.active {
        background: rgba(255, 90, 101, 0.1);
        color: #FF5A65;
      }
      
      mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
      
      span {
        font-size: 16px;
        font-weight: 500;
      }
      
      .badge {
        position: absolute;
        right: 16px;
        background: #FF5A65;
        color: white;
        font-size: 12px;
        padding: 2px 8px;
        border-radius: 10px;
      }
    }
    
    .sidebar-footer {
      margin-top: auto;
      padding-top: 20px;
      border-top: 1px solid #3D3D3D;
    }
    
    .logout-btn {
      width: 100%;
      justify-content: flex-start;
      color: #7A7A7A;
      
      &:hover {
        color: #FF5A65;
      }
    }
    
    // Main Content
    .main-content {
      margin-left: 280px;
      max-width: 600px;
      padding: 20px 0;
    }
    
    // Stories
    .stories-section {
      display: flex;
      gap: 16px;
      overflow-x: auto;
      padding: 16px;
      margin-bottom: 16px;
      
      &::-webkit-scrollbar {
        display: none;
      }
    }
    
    .create-story, .story-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      min-width: 72px;
      
      span {
        font-size: 12px;
        color: #C1C1C1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 72px;
      }
    }
    
    .story-avatar {
      position: relative;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      padding: 3px;
      background: linear-gradient(135deg, #FF5A65, #FF0500);
      
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid #000000;
      }
      
      &.viewed {
        background: #3D3D3D;
      }
      
      .add-icon {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 24px;
        height: 24px;
        background: #FF5A65;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #000000;
        
        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
          color: white;
        }
      }
    }
    
    // Create Post
    .create-post-card {
      background: #191919;
      border-radius: 16px;
      margin-bottom: 16px;
      border: 1px solid #3D3D3D;
    }
    
    .create-post-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
    }
    
    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .create-post-input {
      flex: 1;
      background: #0a0a0a;
      border-radius: 24px;
      padding: 12px 16px;
      cursor: pointer;
      
      span {
        color: #7A7A7A;
      }
      
      &:hover {
        background: #222222;
      }
    }
    
    .create-post-actions {
      display: flex;
      justify-content: space-around;
      padding: 8px;
      
      button {
        color: #C1C1C1;
        
        mat-icon {
          margin-right: 8px;
        }
      }
    }
    
    // Posts
    .posts-feed {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .post-card {
      background: #191919;
      border-radius: 16px;
      border: 1px solid #3D3D3D;
    }
    
    .post-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
    }
    
    .post-author {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      
      .author-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
      }
      
      .author-info {
        display: flex;
        flex-direction: column;
        
        .author-name {
          color: #FFFFFF;
          font-weight: 600;
        }
        
        .post-time {
          color: #7A7A7A;
          font-size: 14px;
        }
      }
    }
    
    .post-content {
      padding: 0 16px 16px;
      
      p {
        color: #C1C1C1;
        margin-bottom: 12px;
        line-height: 1.5;
      }
      
      .post-media {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 8px;
        
        img {
          width: 100%;
          border-radius: 12px;
          object-fit: cover;
        }
      }
      
      .post-location {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #FF5A65;
        font-size: 14px;
        margin-top: 8px;
        
        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
      }
    }
    
    .post-stats {
      display: flex;
      gap: 16px;
      padding: 0 16px 12px;
      color: #7A7A7A;
      font-size: 14px;
    }
    
    .post-actions {
      display: flex;
      justify-content: space-around;
      padding: 8px;
      
      button {
        color: #7A7A7A;
        flex: 1;
        
        mat-icon {
          margin-right: 8px;
        }
        
        &.liked {
          color: #FF5A65;
        }
        
        &:hover {
          background: rgba(255, 90, 101, 0.1);
        }
      }
    }
    
    // Right Sidebar
    .right-sidebar {
      padding: 20px 0;
    }
    
    .sidebar-card {
      background: #191919;
      border-radius: 16px;
      border: 1px solid #3D3D3D;
      padding: 16px;
      margin-bottom: 16px;
      
      h3 {
        color: #FFFFFF;
        font-size: 18px;
        margin-bottom: 16px;
      }
    }
    
    .trending-item {
      padding: 8px 0;
      
      a {
        text-decoration: none;
        
        .hashtag {
          color: #FF5A65;
          font-weight: 500;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
    
    .suggested-user {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 0;
      
      .user-info {
        display: flex;
        align-items: center;
        gap: 12px;
        text-decoration: none;
        
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }
        
        div {
          display: flex;
          flex-direction: column;
          
          .user-name {
            color: #FFFFFF;
            font-weight: 500;
          }
          
          .user-username {
            color: #7A7A7A;
            font-size: 14px;
          }
        }
      }
    }
    
    .footer-links {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 16px;
      padding: 16px;
      
      a {
        color: #7A7A7A;
        font-size: 13px;
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
      
      span {
        color: #7A7A7A;
        font-size: 13px;
      }
    }
    
    .loading-more {
      display: flex;
      justify-content: center;
      padding: 24px;
    }
    
    // Responsive
    @media (max-width: 1200px) {
      .feed-container {
        grid-template-columns: 280px 1fr;
      }
      
      .right-sidebar {
        display: none;
      }
    }
    
    @media (max-width: 768px) {
      .feed-container {
        grid-template-columns: 1fr;
        padding: 0;
      }
      
      .sidebar {
        display: none;
      }
      
      .main-content {
        margin-left: 0;
        max-width: 100%;
      }
    }
  `]
})
export class FeedComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  posts: Post[] = [];
  stories: Story[] = [];
  trendingHashtags: string[] = [];
  suggestedUsers: User[] = [];
  loading = false;
  unreadMessages = 0;
  unreadNotifications = 0;
  
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadFeed();
    this.loadStories();
    this.loadTrending();
    this.loadSuggestedUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadFeed(): void {
    this.loading = true;
    this.postService.getFeed().subscribe({
      next: (response) => {
        if (response.success) {
          this.posts = response.data;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Erreur lors du chargement du feed', 'Fermer', { duration: 3000 });
      }
    });
  }

  loadStories(): void {
    // Load stories implementation
  }

  loadTrending(): void {
    this.postService.getTrendingHashtags().subscribe({
      next: (response) => {
        if (response.success) {
          this.trendingHashtags = response.data;
        }
      }
    });
  }

  loadSuggestedUsers(): void {
    // Load suggested users implementation
  }

  likePost(post: Post): void {
    if (post.isLiked) {
      this.postService.unlikePost(post.id).subscribe();
      post.likesCount--;
    } else {
      this.postService.likePost(post.id).subscribe();
      post.likesCount++;
    }
    post.isLiked = !post.isLiked;
  }

  createStory(): void {
    this.snackBar.open('Création de story - Fonctionnalité à venir', 'Fermer', { duration: 3000 });
  }

  viewStory(story: Story): void {
    // View story implementation
  }

  openCreatePostDialog(type?: string): void {
    this.snackBar.open('Création de post - Fonctionnalité à venir', 'Fermer', { duration: 3000 });
  }

  savePost(post: Post): void {
    this.snackBar.open('Post enregistré', 'Fermer', { duration: 3000 });
  }

  reportPost(post: Post): void {
    this.snackBar.open('Post signalé', 'Fermer', { duration: 3000 });
  }

  deletePost(post: Post): void {
    this.postService.deletePost(post.id).subscribe({
      next: () => {
        this.posts = this.posts.filter(p => p.id !== post.id);
        this.snackBar.open('Post supprimé', 'Fermer', { duration: 3000 });
      }
    });
  }

  showComments(post: Post): void {
    // Show comments implementation
  }

  sharePost(post: Post): void {
    this.snackBar.open('Post partagé', 'Fermer', { duration: 3000 });
  }

  followUser(user: User): void {
    this.snackBar.open(`Vous suivez maintenant ${user.firstName}`, 'Fermer', { duration: 3000 });
  }

  logout(): void {
    this.authService.logout();
  }

  formatDate(date: Date): string {
    const now = new Date();
    const postDate = new Date(date);
    const diff = now.getTime() - postDate.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours} h`;
    if (days < 7) return `Il y a ${days} j`;
    
    return postDate.toLocaleDateString('fr-FR');
  }
}
