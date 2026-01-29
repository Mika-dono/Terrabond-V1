import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserProfile } from '../models/user.model';
import { ApiResponse } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = 'http://localhost:8082/api/users';

  constructor(private http: HttpClient) {}

  getCurrentUserProfile(): Observable<ApiResponse<UserProfile>> {
    return this.http.get<ApiResponse<UserProfile>>(`${this.API_URL}/me`);
  }

  getUserProfile(userId: number): Observable<ApiResponse<UserProfile>> {
    return this.http.get<ApiResponse<UserProfile>>(`${this.API_URL}/${userId}`);
  }

  updateProfile(userId: number, data: Partial<User>): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.API_URL}/${userId}`, data);
  }

  uploadProfilePicture(file: File): Observable<ApiResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<string>>(`${this.API_URL}/upload/profile-picture`, formData);
  }

  uploadCoverPicture(file: File): Observable<ApiResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<string>>(`${this.API_URL}/upload/cover-picture`, formData);
  }

  searchUsers(query: string, page: number = 0, size: number = 20): Observable<ApiResponse<User[]>> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ApiResponse<User[]>>(`${this.API_URL}/search`, { params });
  }

  getSuggestedUsers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.API_URL}/suggestions`);
  }

  updateTravelPreferences(userId: number, preferences: {
    travelStyles?: string[];
    languages?: string[];
    interests?: string[];
    dreamCountries?: string;
  }): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`${this.API_URL}/${userId}/preferences`, preferences);
  }

  completePersonalityTest(answers: Record<string, number>): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/personality-test`, { answers });
  }

  getPersonalityTestResult(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.API_URL}/personality-test`);
  }

  followUser(userId: number): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.API_URL}/${userId}/follow`, {});
  }

  unfollowUser(userId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${userId}/follow`);
  }

  getFollowers(userId: number, page: number = 0): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.API_URL}/${userId}/followers`, {
      params: { page: page.toString() }
    });
  }

  getFollowing(userId: number, page: number = 0): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.API_URL}/${userId}/following`, {
      params: { page: page.toString() }
    });
  }
}
