import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-background"></div>
      <div class="auth-container">
        <div class="card auth-card">
          <div class="auth-header">
            <div class="auth-logo">🏠</div>
            <h1>Create Account</h1>
            <p>Join thousands of property owners and buyers on 1Guntha</p>
          </div>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" formControlName="fullName" placeholder="Enter your full name" />
              @if (form.get('fullName')?.invalid && form.get('fullName')?.touched) {
                <span class="error">Full name is required</span>
              }
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" formControlName="email" placeholder="Enter your email" />
              @if (form.get('email')?.invalid && form.get('email')?.touched) {
                <span class="error">Valid email required</span>
              }
            </div>
            <div class="form-group">
              <label>Mobile Number</label>
              <input type="tel" formControlName="mobile" placeholder="Enter your mobile number" />
              @if (form.get('mobile')?.invalid && form.get('mobile')?.touched) {
                <span class="error">Valid mobile number required (10+ digits)</span>
              }
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" formControlName="password" placeholder="Create a password (min 8 characters)" />
              @if (form.get('password')?.invalid && form.get('password')?.touched) {
                <span class="error">Password must be at least 8 characters</span>
              }
            </div>
            <button type="submit" class="btn btn-primary btn-block btn-lg" [disabled]="form.invalid">
              Create Account
            </button>
          </form>
          <div class="auth-footer">
            <p>Already have an account? <a routerLink="/login">Login here</a></p>
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
      max-width: 500px;
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
export class SignupComponent {
  form = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    mobile: ['', [Validators.required, Validators.minLength(10)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  constructor(private fb: FormBuilder, private auth: AuthService) {}

  onSubmit() {
    if (this.form.invalid) return;
    const { email, password, fullName, mobile } = this.form.getRawValue();
    this.auth.signup(email, password, fullName, mobile);
  }
}
