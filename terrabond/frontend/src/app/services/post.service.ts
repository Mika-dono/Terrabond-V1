import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post, Story, Comment, CreatePostRequest, CreateStoryRequest } from '../models/post.model';
import { ApiResponse } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private readonly API_URL = 'http://localhost:8083/api/social';

  constructor(private http: HttpClient) {}

  // Posts
  getFeed(page: number = 0, size: number = 10): Observable<ApiResponse<Post[]>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ApiResponse<Post[]>>(`${this.API_URL}/feed`, { params });
  }

  getUserPosts(userId: number, page: number = 0): Observable<ApiResponse<Post[]>> {
    return this.http.get<ApiResponse<Post[]>>(`${this.API_URL}/users/${userId}/posts`, {
      params: { page: page.toString() }
    });
  }

  getPost(postId: number): Observable<ApiResponse<Post>> {
    return this.http.get<ApiResponse<Post>>(`${this.API_URL}/posts/${postId}`);
  }

  createPost(data: CreatePostRequest): Observable<ApiResponse<Post>> {
    return this.http.post<ApiResponse<Post>>(`${this.API_URL}/posts`, data);
  }

  updatePost(postId: number, data: Partial<CreatePostRequest>): Observable<ApiResponse<Post>> {
    return this.http.put<ApiResponse<Post>>(`${this.API_URL}/posts/${postId}`, data);
  }

  deletePost(postId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/posts/${postId}`);
  }

  likePost(postId: number): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.API_URL}/posts/${postId}/like`, {});
  }

  unlikePost(postId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/posts/${postId}/like`);
  }

  // Comments
  getComments(postId: number, page: number = 0): Observable<ApiResponse<Comment[]>> {
    return this.http.get<ApiResponse<Comment[]>>(`${this.API_URL}/posts/${postId}/comments`, {
      params: { page: page.toString() }
    });
  }

  addComment(postId: number, content: string): Observable<ApiResponse<Comment>> {
    return this.http.post<ApiResponse<Comment>>(`${this.API_URL}/posts/${postId}/comments`, { content });
  }

  deleteComment(commentId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/comments/${commentId}`);
  }

  likeComment(commentId: number): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.API_URL}/comments/${commentId}/like`, {});
  }

  // Stories
  getStories(): Observable<ApiResponse<Story[]>> {
    return this.http.get<ApiResponse<Story[]>>(`${this.API_URL}/stories`);
  }

  getUserStories(userId: number): Observable<ApiResponse<Story[]>> {
    return this.http.get<ApiResponse<Story[]>>(`${this.API_URL}/users/${userId}/stories`);
  }

  createStory(data: CreateStoryRequest): Observable<ApiResponse<Story>> {
    return this.http.post<ApiResponse<Story>>(`${this.API_URL}/stories`, data);
  }

  deleteStory(storyId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/stories/${storyId}`);
  }

  viewStory(storyId: number): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.API_URL}/stories/${storyId}/view`, {});
  }

  // Hashtags & Explore
  getTrendingHashtags(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(`${this.API_URL}/hashtags/trending`);
  }

  searchByHashtag(hashtag: string, page: number = 0): Observable<ApiResponse<Post[]>> {
    return this.http.get<ApiResponse<Post[]>>(`${this.API_URL}/hashtags/${hashtag}/posts`, {
      params: { page: page.toString() }
    });
  }

  explorePosts(page: number = 0): Observable<ApiResponse<Post[]>> {
    return this.http.get<ApiResponse<Post[]>>(`${this.API_URL}/explore`, {
      params: { page: page.toString() }
    });
  }

  // Upload
  uploadMedia(file: File): Observable<ApiResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<string>>(`${this.API_URL}/upload`, formData);
  }
}
