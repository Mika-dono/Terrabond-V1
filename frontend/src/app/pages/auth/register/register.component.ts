import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { AuthService } from '../../../services/auth.service';
import { Gender } from '../../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatStepperModule
  ],
  template: `
    <div class="register-container">
      <div class="register-background">
        <div class="gradient-overlay"></div>
        <div class="floating-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
        </div>
      </div>
      
      <div class="register-content">
        <mat-card class="register-card">
          <div class="logo-section">
            <div class="logo">
              <mat-icon class="logo-icon">travel_explore</mat-icon>
            </div>
            <h1 class="title">Créer un compte</h1>
            <p class="subtitle">Rejoignez la communauté TerraBond</p>
          </div>
          
          <mat-stepper [linear]="true" #stepper>
            <!-- Step 1: Account Info -->
            <mat-step [stepControl]="accountForm">
              <form [formGroup]="accountForm">
                <ng-template matStepLabel>Compte</ng-template>
                
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Email</mat-label>
                  <input matInput formControlName="email" type="email" placeholder="votre@email.com">
                  <mat-icon matPrefix>email</mat-icon>
                  <mat-error *ngIf="accountForm.get('email')?.hasError('required')">Email requis</mat-error>
                  <mat-error *ngIf="accountForm.get('email')?.hasError('email')">Email invalide</mat-error>
                </mat-form-field>
                
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Nom d'utilisateur</mat-label>
                  <input matInput formControlName="username" placeholder="@username">
                  <mat-icon matPrefix>alternate_email</mat-icon>
                  <mat-error *ngIf="accountForm.get('username')?.hasError('required')">Nom d'utilisateur requis</mat-error>
                </mat-form-field>
                
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Mot de passe</mat-label>
                  <input matInput formControlName="password" [type]="hidePassword ? 'password' : 'text'">
                  <mat-icon matPrefix>lock</mat-icon>
                  <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                    <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                  </button>
                  <mat-error *ngIf="accountForm.get('password')?.hasError('required')">Mot de passe requis</mat-error>
                  <mat-error *ngIf="accountForm.get('password')?.hasError('minlength')">Minimum 8 caractères</mat-error>
                </mat-form-field>
                
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Confirmer le mot de passe</mat-label>
                  <input matInput formControlName="confirmPassword" [type]="hidePassword ? 'password' : 'text'">
                  <mat-icon matPrefix>lock_reset</mat-icon>
                  <mat-error *ngIf="accountForm.get('confirmPassword')?.hasError('required')">Confirmation requise</mat-error>
                  <mat-error *ngIf="accountForm.hasError('passwordMismatch')">Les mots de passe ne correspondent pas</mat-error>
                </mat-form-field>
                
                <div class="step-actions">
                  <button mat-raised-button color="primary" matStepperNext [disabled]="accountForm.invalid">Suivant</button>
                </div>
              </form>
            </mat-step>
            
            <!-- Step 2: Personal Info -->
            <mat-step [stepControl]="personalForm">
              <form [formGroup]="personalForm">
                <ng-template matStepLabel>Profil</ng-template>
                
                <div class="name-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Prénom</mat-label>
                    <input matInput formControlName="firstName" placeholder="Jean">
                    <mat-icon matPrefix>person</mat-icon>
                    <mat-error *ngIf="personalForm.get('firstName')?.hasError('required')">Prénom requis</mat-error>
                  </mat-form-field>
                  
                  <mat-form-field appearance="outline">
                    <mat-label>Nom</mat-label>
                    <input matInput formControlName="lastName" placeholder="Dupont">
                    <mat-icon matPrefix>person</mat-icon>
                    <mat-error *ngIf="personalForm.get('lastName')?.hasError('required')">Nom requis</mat-error>
                  </mat-form-field>
                </div>
                
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Date de naissance</mat-label>
                  <input matInput [matDatepicker]="picker" formControlName="dateOfBirth">
                  <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                  <mat-datepicker #picker></mat-datepicker>
                  <mat-error *ngIf="personalForm.get('dateOfBirth')?.hasError('required')">Date de naissance requise</mat-error>
                </mat-form-field>
                
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Genre</mat-label>
                  <mat-select formControlName="gender">
                    <mat-option *ngFor="let g of genders" [value]="g.value">{{ g.label }}</mat-option>
                  </mat-select>
                  <mat-icon matPrefix>wc</mat-icon>
                  <mat-error *ngIf="personalForm.get('gender')?.hasError('required')">Genre requis</mat-error>
                </mat-form-field>
                
                <div class="step-actions">
                  <button mat-button matStepperPrevious>Retour</button>
                  <button mat-raised-button color="primary" matStepperNext [disabled]="personalForm.invalid">Suivant</button>
                </div>
              </form>
            </mat-step>
            
            <!-- Step 3: Confirmation -->
            <mat-step>
              <ng-template matStepLabel>Confirmation</ng-template>
              
              <div class="confirmation-section">
                <h3>Vérifiez vos informations</h3>
                
                <div class="info-row">
                  <span class="label">Email:</span>
                  <span class="value">{{ accountForm.get('email')?.value }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Nom d'utilisateur:</span>
                  <span class="value">{{ accountForm.get('username')?.value }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Nom:</span>
                  <span class="value">{{ personalForm.get('firstName')?.value }} {{ personalForm.get('lastName')?.value }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Date de naissance:</span>
                  <span class="value">{{ personalForm.get('dateOfBirth')?.value | date:'dd/MM/yyyy' }}</span>
                </div>
                
                <mat-checkbox [(ngModel)]="acceptTerms" [ngModelOptions]="{standalone: true}">
                  J'accepte les <a href="#">conditions d'utilisation</a> et la <a href="#">politique de confidentialité</a>
                </mat-checkbox>
              </div>
              
              <div class="step-actions">
                <button mat-button matStepperPrevious>Retour</button>
                <button 
                  mat-raised-button 
                  color="primary" 
                  (click)="onSubmit()" 
                  [disabled]="!acceptTerms || isLoading"
                >
                  <mat-spinner *ngIf="isLoading" diameter="20" class="spinner"></mat-spinner>
                  <span *ngIf="!isLoading">Créer mon compte</span>
                </button>
              </div>
            </mat-step>
          </mat-stepper>
          
          <div class="login-section">
            <p>Déjà un compte ? <a routerLink="/login" class="login-link">Se connecter</a></p>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      padding: 40px 20px;
    }
    
    .register-background {
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
    
    .register-content {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 500px;
    }
    
    .register-card {
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
      font-size: 28px;
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
    
    ::ng-deep {
      .mat-stepper-horizontal {
        background: transparent;
      }
      
      .mat-step-header {
        pointer-events: none;
      }
      
      .mat-step-icon {
        background: #FF5A65;
      }
      
      .mat-step-label {
        color: #C1C1C1;
      }
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    
    .name-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
      
      mat-form-field {
        width: 100%;
      }
    }
    
    .step-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 24px;
    }
    
    .confirmation-section {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      
      h3 {
        color: #FFFFFF;
        margin-bottom: 16px;
      }
      
      .info-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        
        &:last-child {
          border-bottom: none;
        }
        
        .label {
          color: #7A7A7A;
        }
        
        .value {
          color: #FFFFFF;
        }
      }
      
      mat-checkbox {
        display: block;
        margin-top: 16px;
        color: #C1C1C1;
        
        a {
          color: #FF5A65;
        }
      }
    }
    
    .login-section {
      text-align: center;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #3D3D3D;
      color: #7A7A7A;
      font-size: 14px;
    }
    
    .login-link {
      color: #FF5A65;
      font-weight: 600;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
    
    .spinner {
      margin: 0 auto;
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
export class RegisterComponent {
  accountForm: FormGroup;
  personalForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  acceptTerms = false;
  
  genders = [
    { value: Gender.MALE, label: 'Homme' },
    { value: Gender.FEMALE, label: 'Femme' },
    { value: Gender.OTHER, label: 'Autre' },
    { value: Gender.PREFER_NOT_TO_SAY, label: 'Je préfère ne pas dire' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.accountForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
    
    this.personalForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required]
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.accountForm.invalid || this.personalForm.invalid) return;

    this.isLoading = true;
    
    const data = {
      ...this.accountForm.value,
      ...this.personalForm.value
    };
    
    this.authService.register(data).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.snackBar.open('Compte créé avec succès !', 'Fermer', { duration: 3000 });
          this.router.navigate(['/feed']);
        } else {
          this.snackBar.open(response.message || 'Échec de l\'inscription', 'Fermer', { duration: 5000 });
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open(error || 'Erreur lors de l\'inscription', 'Fermer', { duration: 5000 });
      }
    });
  }
}
