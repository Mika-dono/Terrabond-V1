import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="login-container">
      <div class="login-background">
        <div class="gradient-overlay"></div>
        <div class="floating-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
        </div>
      </div>
      
      <div class="login-content">
        <mat-card class="login-card">
          <div class="logo-section">
            <div class="logo">
              <mat-icon class="logo-icon">travel_explore</mat-icon>
            </div>
            <h1 class="title">TerraBond</h1>
            <p class="subtitle">Connect. Travel. Bond.</p>
          </div>
          
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" placeholder="votre@email.com">
              <mat-icon matPrefix>email</mat-icon>
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                Email requis
              </mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                Email invalide
              </mat-error>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Mot de passe</mat-label>
              <input matInput formControlName="password" [type]="hidePassword ? 'password' : 'text'" placeholder="••••••••">
              <mat-icon matPrefix>lock</mat-icon>
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                Mot de passe requis
              </mat-error>
            </mat-form-field>
            
            <div class="form-options">
              <mat-checkbox formControlName="rememberMe" color="primary">
                Se souvenir de moi
              </mat-checkbox>
              <a routerLink="/forgot-password" class="forgot-link">Mot de passe oublié ?</a>
            </div>
            
            <button 
              mat-raised-button 
              color="primary" 
              type="submit" 
              class="login-button"
              [disabled]="loginForm.invalid || isLoading"
            >
              <mat-spinner *ngIf="isLoading" diameter="20" class="spinner"></mat-spinner>
              <span *ngIf="!isLoading">Se connecter</span>
            </button>
            
            <div class="divider">
              <span>ou</span>
            </div>
            
            <button 
              mat-stroked-button 
              type="button" 
              class="face-login-button"
              (click)="loginWithFace()"
            >
              <mat-icon>face</mat-icon>
              Connexion par reconnaissance faciale
            </button>
          </form>
          
          <div class="register-section">
            <p>Pas encore de compte ? <a routerLink="/register" class="register-link">S'inscrire</a></p>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    
    .login-background {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, #000000 0%, #1a0000 50%, #000000 100%);
    }
    
    .gradient-overlay {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at center, rgba(255, 90, 101, 0.1) 0%, transparent 70%);
    }
    
    .floating-shapes {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }
    
    .shape {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.3;
    }
    
    .shape-1 {
      width: 400px;
      height: 400px;
      background: #FF5A65;
      top: -100px;
      right: -100px;
      animation: float 8s ease-in-out infinite;
    }
    
    .shape-2 {
      width: 300px;
      height: 300px;
      background: #FF0500;
      bottom: -50px;
      left: -50px;
      animation: float 10s ease-in-out infinite reverse;
    }
    
    .shape-3 {
      width: 200px;
      height: 200px;
      background: #FF5A65;
      top: 50%;
      left: 30%;
      animation: float 12s ease-in-out infinite;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-30px) rotate(5deg); }
    }
    
    .login-content {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 420px;
      padding: 20px;
    }
    
    .login-card {
      background: rgba(25, 25, 25, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 40px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .logo-section {
      text-align: center;
      margin-bottom: 32px;
    }
    
    .logo {
      width: 80px;
      height: 80px;
      margin: 0 auto 16px;
      background: linear-gradient(135deg, #FF5A65, #FF0500);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .logo-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: white;
    }
    
    .title {
      font-size: 32px;
      font-weight: 700;
      margin: 0 0 8px;
      background: linear-gradient(135deg, #FF5A65, #FF0500);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .subtitle {
      color: #7A7A7A;
      font-size: 16px;
      margin: 0;
    }
    
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .full-width {
      width: 100%;
    }
    
    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
    }
    
    .forgot-link {
      color: #FF5A65;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
    
    .login-button {
      height: 48px;
      font-size: 16px;
      font-weight: 600;
      background: linear-gradient(135deg, #FF5A65, #FF0500);
      
      &:disabled {
        opacity: 0.7;
      }
    }
    
    .spinner {
      margin: 0 auto;
    }
    
    .divider {
      display: flex;
      align-items: center;
      text-align: center;
      margin: 8px 0;
      
      &::before,
      &::after {
        content: '';
        flex: 1;
        border-bottom: 1px solid #3D3D3D;
      }
      
      span {
        padding: 0 16px;
        color: #7A7A7A;
        font-size: 14px;
      }
    }
    
    .face-login-button {
      height: 48px;
      border-color: #FF5A65;
      color: #FF5A65;
      
      &:hover {
        background: rgba(255, 90, 101, 0.1);
      }
    }
    
    .register-section {
      text-align: center;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #3D3D3D;
      color: #7A7A7A;
      font-size: 14px;
    }
    
    .register-link {
      color: #FF5A65;
      font-weight: 600;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
    
    ::ng-deep {
      .mat-mdc-form-field-outline {
        color: #3D3D3D;
      }
      
      .mat-mdc-text-field-wrapper {
        background: #0a0a0a;
      }
      
      .mat-mdc-form-field-label {
        color: #7A7A7A;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.snackBar.open('Connexion réussie !', 'Fermer', { duration: 3000 });
          this.router.navigate(['/feed']);
        } else {
          this.snackBar.open(response.message || 'Échec de la connexion', 'Fermer', { duration: 5000 });
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open(error || 'Erreur de connexion', 'Fermer', { duration: 5000 });
      }
    });
  }

  loginWithFace(): void {
    this.snackBar.open('Reconnaissance faciale - Fonctionnalité à venir', 'Fermer', { duration: 3000 });
  }
}
