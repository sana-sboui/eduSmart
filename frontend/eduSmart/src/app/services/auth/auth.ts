import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import {
  BehaviorSubject,
  catchError,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { AuthResponse, User } from 'src/app/models/user.models';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://127.0.0.1:8000';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private refreshTimer: any = null;
  private refreshing = false;

  constructor(private http: HttpClient) {
    const token = this.getToken();
    if (token) {
      this.scheduleTokenRefresh(token);
    }
  }

  register(user: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/accounts/auth/register/`,
      {
        ...user,
      }
    );
  }
  login(username: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/accounts/auth/login/`, {
        username,
        password,
      })
      .pipe(
        tap((res) => {
          localStorage.setItem('access_token', res.access);
          localStorage.setItem('refresh_token', res.refresh);
          this.currentUserSubject.next({
            username: res.username,
            role: res.role,
          });
          // Schedule automatic refresh before expiry
          this.scheduleTokenRefresh(res.access);
        })
      );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.currentUserSubject.next(null);
    this.clearRefreshTimer();
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  refreshAccessToken(): Observable<string> {
    const refresh = this.getRefreshToken();
    if (!refresh) return throwError(() => 'No refresh token found');
    if (this.refreshing) return throwError(() => 'Already refreshing');

    this.refreshing = true;

    return this.http
      .post<{ access: string }>(`${this.apiUrl}/accounts/auth/refresh/`, {
        refresh,
      })
      .pipe(
        tap((res) => {
          localStorage.setItem('access_token', res.access);
          this.scheduleTokenRefresh(res.access); // Reschedule after refreshing
          this.refreshing = false;
        }),
        switchMap((res) => of(res.access)),
        catchError((err) => {
          this.refreshing = false;
          this.logout();
          return throwError(() => err);
        })
      );
  }

  //  Schedule automatic token refresh before expiry
  private scheduleTokenRefresh(token: string) {
    this.clearRefreshTimer();

    try {
      const decoded: any = jwtDecode(token);
      const exp = decoded.exp * 1000; // convert to milliseconds
      const now = Date.now();

      // Refresh 1 minute before expiry
      const refreshTime = exp - now - 60_000;

      if (refreshTime > 0) {
        this.refreshTimer = setTimeout(() => {
          this.refreshAccessToken().subscribe({
            next: () => console.log('Access token refreshed automatically'),
            error: () => console.warn('Token refresh failed, logging out'),
          });
        }, refreshTime);
        console.log(
          `Scheduled token refresh in ${(refreshTime / 1000 / 60).toFixed(
            1
          )} minutes`
        );
      } else {
        console.warn('Access token already expired — refreshing immediately');
        this.refreshAccessToken().subscribe();
      }
    } catch (err) {
      console.error('Invalid JWT, cannot decode:', err);
      this.logout();
    }
  }

  private clearRefreshTimer() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  //user logged in
  getLoggedInUser(): User | null {
    const token = this.getToken();
    if (!token) return null;
    console.log(token);
    try {
      const decoded: any = jwtDecode(token);
      const user: User = {
        id: decoded.user_id,
        username: decoded.username,
        role: decoded.role,
        email: decoded.email,
      };
      console.log('user', user);
      this.currentUserSubject.next(user);
      return user;
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }
}
