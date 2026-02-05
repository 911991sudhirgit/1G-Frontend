import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-background"></div>
      <div class="auth-container">
        <div class="card auth-card">
          <div class="auth-header">
            <div class="auth-logo">🏠</div>
            <h1>Welcome Back</h1>
            <p>Login to your account to continue</p>
          </div>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" formControlName="email" placeholder="Enter your email" />
              @if (form.get('email')?.invalid && form.get('email')?.touched) {
                <span class="error">Valid email required</span>
              }
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" formControlName="password" placeholder="Enter your password" />
              @if (form.get('password')?.invalid && form.get('password')?.touched) {
                <span class="error">Password is required</span>
              }
            </div>
            <button type="submit" class="btn btn-primary btn-block btn-lg" [disabled]="form.invalid">
              Login
            </button>
          </form>
          <div class="auth-footer">
            <p>Don't have an account? <a routerLink="/signup">Sign up now</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      position: relative;
      background: var(--bg);
    }
    .auth-background {
      position: absolute;
      inset: 0;
      background: var(--primary-gradient);
      opacity: 0.05;
      z-index: 0;
    }
    .auth-container {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 450px;
    }
    .auth-card {
      padding: 3rem;
      border: 2px solid var(--border);
      box-shadow: var(--shadow-2xl);
    }
    .auth-header {
      text-align: center;
      margin-bottom: 2.5rem;
    }
    .auth-logo {
      font-size: 3.5rem;
      margin-bottom: 1rem;
      filter: drop-shadow(0 4px 8px rgba(14, 165, 233, 0.2));
    }
    .auth-header h1 {
      font-size: 2rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      color: var(--text);
    }
    .auth-header p {
      color: var(--text-muted);
      font-size: 1rem;
      margin: 0;
    }
    .auth-footer {
      text-align: center;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid var(--border-light);
    }
    .auth-footer p {
      color: var(--text-muted);
      font-size: 0.9375rem;
      margin: 0;
    }
    .auth-footer a {
      color: var(--primary);
      font-weight: 600;
    }
    .btn-block {
      width: 100%;
      margin-top: 1rem;
    }
  `],
})
export class LoginComponent {
  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor(private fb: FormBuilder, private auth: AuthService) {}

  onSubmit() {
    if (this.form.invalid) return;
    const { email, password } = this.form.getRawValue();
    this.auth.login(email, password);
  }
}
