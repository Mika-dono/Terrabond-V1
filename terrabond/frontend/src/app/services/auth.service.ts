import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  JwtResponse, 
  Role 
} from '../models/user.model';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8081/api/auth';
  private readonly TOKEN_KEY = 'terrabond_token';
  private readonly USER_KEY = 'terrabond_user';
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userData = localStorage.getItem(this.USER_KEY);
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (e) {
        this.logout();
      }
    }
  }

  login(credentials: LoginRequest): Observable<ApiResponse<JwtResponse>> {
    return this.http.post<ApiResponse<JwtResponse>>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setSession(response.data);
          }
        }),
        catchError(error => {
          return throwError(() => error.error?.message || 'Login failed');
        })
      );
  }

  register(data: RegisterRequest): Observable<ApiResponse<JwtResponse>> {
    return this.http.post<ApiResponse<JwtResponse>>(`${this.API_URL}/register`, data)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setSession(response.data);
          }
        }),
        catchError(error => {
          return throwError(() => error.error?.message || 'Registration failed');
        })
      );
  }

  logout(): void {
    const token = this.getToken();
    if (token) {
      this.http.post<ApiResponse<void>>(`${this.API_URL}/logout`, {}).subscribe();
    }
    
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  private setSession(authResult: JwtResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authResult.token);
    
    const user: User = {
      id: authResult.id,
      email: authResult.email,
      username: authResult.username,
      firstName: authResult.firstName,
      lastName: authResult.lastName,
      roles: authResult.roles,
      faceVerified: authResult.faceVerified,
      twoFactorEnabled: authResult.twoFactorEnabled,
      travelStyles: [],
      languages: [],
      interests: [],
      isVerified: false,
      isActive: true,
      createdAt: new Date()
    };
    
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user ? user.roles.includes(Role.ADMIN) : false;
  }

  hasRole(role: Role): boolean {
    const user = this.getCurrentUser();
    return user ? user.roles.includes(role) : false;
  }

  enable2FA(): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.API_URL}/2fa/enable`, {});
  }

  disable2FA(): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.API_URL}/2fa/disable`, {});
  }

  registerFace(faceEncodingData: string): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.API_URL}/face/register`, {
      faceEncodingData
    });
  }

  validateToken(): Observable<boolean> {
    return this.http.get<ApiResponse<boolean>>(`${this.API_URL}/validate`)
      .pipe(
        map(response => response.success && response.data),
        catchError(() => of(false))
      );
  }

  updateStoredUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
}
