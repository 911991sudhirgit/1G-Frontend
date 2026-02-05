import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-background"></div>
      <div class="auth-container">
        <div class="card auth-card">
          <div class="auth-header">
            <div class="auth-logo">✉️</div>
            <h1>Email verification</h1>
          </div>
          @if (loading) {
            <p class="message">Verifying your email...</p>
          } @else if (success) {
            <p class="message success">Email verified successfully. Redirecting to dashboard...</p>
          } @else if (error) {
            <p class="message error">{{ error }}</p>
            <a routerLink="/dashboard" class="btn btn-primary">Go to Dashboard</a>
          } @else {
            <p class="message">Invalid or missing verification link.</p>
            <a routerLink="/login" class="btn btn-outline">Back to Login</a>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; position: relative; background: var(--bg); }
    .auth-background { position: absolute; inset: 0; background: var(--primary-gradient); opacity: 0.06; }
    .auth-container { position: relative; width: 100%; max-width: 420px; }
    .auth-card { padding: 2rem; }
    .auth-header { text-align: center; margin-bottom: 1.5rem; }
    .auth-logo { font-size: 3rem; margin-bottom: 0.5rem; }
    .auth-header h1 { font-size: 1.5rem; margin: 0 0 0.5rem; }
    .message { text-align: center; margin-bottom: 1rem; }
    .message.success { color: var(--success); font-weight: 500; }
    .message.error { color: var(--danger); }
    .btn { display: inline-block; margin: 0.25rem; }
  `],
})
export class VerifyEmailComponent implements OnInit {
  loading = true;
  success = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private auth: AuthService,
    private toast: ToastrService
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.loading = false;
      this.error = null;
      return;
    }
    this.api.get<{ message: string }>('/auth/verify-email', { token }).subscribe({
      next: () => {
        this.auth.updateUserEmailVerified();
        this.loading = false;
        this.success = true;
        this.toast.success('Your email has been verified.');
        setTimeout(() => this.router.navigate(['/dashboard']), 1500);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Link invalid or expired. Request a new verification email from your dashboard.';
      },
    });
  }
}
