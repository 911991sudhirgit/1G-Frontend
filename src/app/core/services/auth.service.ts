import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { ToastrService } from 'ngx-toastr';

export interface User {
  id: number;
  email: string;
  fullName: string;
  mobile: string;
  role: string;
  emailVerified: boolean;
  mobileVerified: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

/** Returned after signup; no tokens until OTP is verified. */
export interface SignupResponse {
  message: string;
  email: string;
  mobile: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSignal = signal<User | null>(null);
  user = this.userSignal.asReadonly();
  isLoggedIn = computed(() => !!this.userSignal());

  constructor(
    private api: ApiService,
    private router: Router,
    private toast: ToastrService
  ) {
    const u = localStorage.getItem('user');
    if (u) this.userSignal.set(JSON.parse(u));
  }

  login(email: string, password: string) {
    return this.api.post<AuthResponse>('/auth/login', { email, password }).subscribe({
      next: (res) => {
        this.setSession(res);
        setTimeout(() => {
          this.toast.success(`Welcome back, ${res.user.fullName}`);
          this.router.navigate(['/dashboard']);
        }, 0);
      },
      error: (err) => {
        setTimeout(() => this.toast.error(err.error?.message || 'Login failed'), 0);
      },
    });
  }

  signup(email: string, password: string, fullName: string, mobile: string) {
    return this.api.post<SignupResponse>('/auth/signup', { email, password, fullName, mobile }).subscribe({
      next: (res) => {
        sessionStorage.setItem('pendingVerification', JSON.stringify({ email: res.email, mobile: res.mobile }));
        setTimeout(() => {
          this.toast.success(res.message || 'OTP sent to your mobile. Enter it on the next screen.');
          this.router.navigate(['/verify-otp']);
        }, 0);
      },
      error: (err) => {
        setTimeout(() => this.toast.error(err.error?.message || 'Signup failed'), 0);
      },
    });
  }

  logout() {
    this.api.post('/auth/logout', {}).subscribe({ error: () => {} });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    this.userSignal.set(null);
    this.router.navigate(['/']);
  }

  private setSession(res: AuthResponse) {
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    localStorage.setItem('user', JSON.stringify(res.user));
    localStorage.setItem('userRole', res.user.role);
    this.userSignal.set(res.user);
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRole(): string {
    return localStorage.getItem('userRole') || '';
  }

  /** Call after OTP verification (verify-signup) to set session; caller should redirect (e.g. to /dashboard). */
  completeSignup(authResponse: AuthResponse): void {
    this.setSession(authResponse);
  }

  /** Call after OTP verification to update user flags locally. */
  setEmailAndMobileVerified(): void {
    const u = this.userSignal();
    if (u) {
      const updated = { ...u, emailVerified: true, mobileVerified: true };
      this.userSignal.set(updated);
      localStorage.setItem('user', JSON.stringify(updated));
    }
  }

  /** Call after email verification via link to update user locally. */
  updateUserEmailVerified(): void {
    const u = this.userSignal();
    if (u) {
      const updated = { ...u, emailVerified: true };
      this.userSignal.set(updated);
      localStorage.setItem('user', JSON.stringify(updated));
    }
  }

  /** Send email verification link to current user's email (requires auth). */
  sendEmailVerification() {
    return this.api.post('/auth/send-email-verification', {});
  }
}
