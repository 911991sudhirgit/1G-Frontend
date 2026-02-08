import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ConfigService } from '../../core/services/config.service';
import { Property, PageResponse } from '../../core/models/property.model';
import { SkeletonLoaderComponent } from '../../shared/skeleton-loader/skeleton-loader.component';
import { ToastrService } from 'ngx-toastr';

interface SiteVisit {
  id: number;
  propertyTitle: string;
  scheduledAt: string;
  status: string;
}

interface Alert {
  id: number;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SkeletonLoaderComponent],
  template: `
    <div class="dashboard-page">
      <div class="container">
        <div class="dashboard-header">
          <div>
            <h1>Welcome back, {{ auth.user()?.fullName }}! 👋</h1>
            <p>Here's what's happening with your properties</p>
          </div>
          <a routerLink="/property/new" class="btn btn-primary">
            <span>+</span> List New Property
          </a>
        </div>

        @if (auth.user() && !auth.user()?.emailVerified) {
          <div class="card email-verify-banner">
            <span class="email-verify-icon">✉️</span>
            <div class="email-verify-text">
              <strong>Verify your email</strong>
              <p>We'll send a verification link to {{ auth.user()?.email }}. Click the link to verify.</p>
            </div>
            <button type="button" class="btn btn-primary btn-sm" (click)="sendEmailVerificationLink()" [disabled]="sendingEmailVerification">
              {{ sendingEmailVerification ? 'Sending...' : 'Send verification link' }}
            </button>
          </div>
        }

        <div class="stats-grid">
          <div class="stat-card card">
            <div class="stat-icon">🏠</div>
            <div class="stat-content">
              <div class="stat-value">{{ myPropertiesCount }}</div>
              <div class="stat-label">My Properties</div>
            </div>
            <a routerLink="/my-properties" class="stat-link">View All →</a>
          </div>
          <div class="stat-card card">
            <div class="stat-icon">📅</div>
            <div class="stat-content">
              <div class="stat-value">{{ visits.length }}</div>
              <div class="stat-label">Site Visits</div>
            </div>
            <a routerLink="/dashboard" class="stat-link">View All →</a>
          </div>
          <div class="stat-card card">
            <div class="stat-icon">👁️</div>
            <div class="stat-content">
              <div class="stat-value">{{ totalViews }}</div>
              <div class="stat-label">Total Views</div>
            </div>
          </div>
          <div class="stat-card card">
            <div class="stat-icon">🔔</div>
            <div class="stat-content">
              <div class="stat-value">{{ unreadAlerts }}</div>
              <div class="stat-label">New Notifications</div>
            </div>
            <a routerLink="/dashboard" class="stat-link">View →</a>
          </div>
        </div>

        <div class="dashboard-content">
          <div class="main-section">
            <section class="card">
              <div class="section-header">
                <h2>Recent Site Visits</h2>
                <a routerLink="/search" class="btn btn-outline btn-sm">Book New Visit</a>
              </div>
              <div class="visits-list" *ngIf="visits.length && !loadingVisits">
                <div class="visit-item" *ngFor="let v of visits">
                  <div class="visit-info">
                    <div class="visit-property">{{ v.propertyTitle }}</div>
                    <div class="visit-meta">
                      <span>📅 {{ v.scheduledAt | date:'MMM d, y h:mm a' }}</span>
                      <span class="visit-status" [class.status-pending]="v.status === 'PENDING_ASSIGNMENT'"
                            [class.status-assigned]="v.status === 'ASSIGNED'"
                            [class.status-completed]="v.status === 'COMPLETED'">
                        {{ v.status.replace('_', ' ') }}
                      </span>
                    </div>
                    <div class="reschedule-row" *ngIf="(v.status === 'PENDING_ASSIGNMENT' || v.status === 'ASSIGNED') && rescheduleVisitId === v.id">
                      <input type="datetime-local" [(ngModel)]="rescheduleDateTime" class="form-input reschedule-input" />
                      <button type="button" class="btn btn-primary btn-sm" (click)="submitReschedule(v.id)" [disabled]="rescheduling">Reschedule</button>
                      <button type="button" class="btn btn-outline btn-sm" (click)="cancelReschedule()">Cancel</button>
                    </div>
                  </div>
                  <button type="button" class="btn btn-outline btn-sm" *ngIf="(v.status === 'PENDING_ASSIGNMENT' || v.status === 'ASSIGNED') && rescheduleVisitId !== v.id" (click)="openReschedule(v)">
                    Reschedule
                  </button>
                </div>
              </div>
              <div class="empty-state" *ngIf="!visits.length && !loadingVisits">
                <div class="empty-icon">📅</div>
                <p>No site visits scheduled yet</p>
                <a routerLink="/search" class="btn btn-primary btn-sm">Browse Properties</a>
              </div>
              <div *ngIf="loadingVisits" class="loading-state">
                <app-skeleton-loader height="60px" style="margin-bottom: 0.5rem;" *ngFor="let i of [1,2,3]"></app-skeleton-loader>
              </div>
            </section>

            <section class="card">
              <div class="section-header">
                <h2>My Recent Properties</h2>
                <a routerLink="/my-properties" class="btn btn-outline btn-sm">View All</a>
              </div>
              <div class="properties-list" *ngIf="recentProperties.length && !loadingProperties">
                <div class="property-item" *ngFor="let p of recentProperties">
                  <div class="property-thumb" [style.backgroundImage]="'url(' + resolveImageUrl(p.images?.[0]?.imageUrl) + ')'"></div>
                  <div class="property-info">
                    <div class="property-title">{{ p.title }}</div>
                    <div class="property-meta">
                      <span>₹ {{ p.price | number }}</span>
                      <span class="property-status" [class.status-approved]="p.status === 'APPROVED'"
                            [class.status-pending]="p.status === 'PENDING_APPROVAL'"
                            [class.status-rejected]="p.status === 'REJECTED'">
                        {{ p.status?.replace('_', ' ') ?? '' }}
                      </span>
                    </div>
                  </div>
                  <a [routerLink]="['/property', p.id, 'edit']" class="btn btn-outline btn-sm">Edit</a>
                </div>
              </div>
              <div class="empty-state" *ngIf="!recentProperties.length && !loadingProperties">
                <div class="empty-icon">🏠</div>
                <p>You haven't listed any properties yet</p>
                <a routerLink="/property/new" class="btn btn-primary btn-sm">List Your First Property</a>
              </div>
              <div *ngIf="loadingProperties" class="loading-state">
                <app-skeleton-loader height="80px" style="margin-bottom: 0.5rem;" *ngFor="let i of [1,2]"></app-skeleton-loader>
              </div>
            </section>
          </div>

          <aside class="sidebar">
            <div class="card">
              <h3>Quick Actions</h3>
              <div class="quick-actions">
                <a routerLink="/property/new" class="action-item">
                  <span class="action-icon">➕</span>
                  <span>List New Property</span>
                </a>
                <a routerLink="/search" class="action-item">
                  <span class="action-icon">🔍</span>
                  <span>Search Properties</span>
                </a>
                <a routerLink="/my-properties" class="action-item">
                  <span class="action-icon">📋</span>
                  <span>My Properties</span>
                </a>
                <a routerLink="/dashboard" class="action-item">
                  <span class="action-icon">🔔</span>
                  <span>Notifications</span>
                  <span class="badge" *ngIf="unreadAlerts > 0">{{ unreadAlerts }}</span>
                </a>
              </div>
            </div>

            <div class="card">
              <h3>Notifications</h3>
              <div class="notifications-list" *ngIf="alerts.length">
                <div class="notification-item" *ngFor="let a of alerts.slice(0, 5)" [class.unread]="!a.read">
                  <div class="notification-content">
                    <div class="notification-title">{{ a.title }}</div>
                    <div class="notification-message">{{ a.message }}</div>
                    <div class="notification-time">{{ a.createdAt | date:'short' }}</div>
                  </div>
                </div>
              </div>
              <p *ngIf="!alerts.length" class="empty-text">No notifications</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page { padding: 2rem 0 4rem; }
    .email-verify-banner {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem;
      margin-bottom: 2rem;
      border: 2px solid var(--warning);
      background: rgba(245, 158, 11, 0.08);
      border-radius: var(--radius);
    }
    .email-verify-icon { font-size: 2rem; }
    .email-verify-text { flex: 1; }
    .email-verify-text strong { display: block; margin-bottom: 0.25rem; }
    .email-verify-text p { margin: 0; font-size: 0.9375rem; color: var(--text-muted); }
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 1.5rem;
      margin-bottom: 3rem;
      padding-bottom: 2rem;
      border-bottom: 3px solid var(--border-light);
      position: relative;
    }
    .dashboard-header::after {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 0;
      width: 120px;
      height: 3px;
      background: var(--primary-gradient);
      border-radius: 2px;
    }
    .dashboard-header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.75rem;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    .dashboard-header p {
      color: var(--text-muted);
      font-size: 1.1875rem;
      font-weight: 400;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      padding: 2rem;
      display: flex;
      align-items: center;
      gap: 1.25rem;
      position: relative;
      transition: var(--transition-slow);
      border: 2px solid var(--border);
      overflow: hidden;
    }
    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: var(--primary-gradient);
      transform: scaleY(0);
      transition: transform 0.3s;
    }
    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-xl);
      border-color: var(--primary-light);
    }
    .stat-card:hover::before {
      transform: scaleY(1);
    }
    .stat-icon {
      font-size: 3rem;
      filter: drop-shadow(0 4px 8px rgba(14, 165, 233, 0.2));
    }
    .stat-content {
      flex: 1;
    }
    .stat-value {
      font-size: 2.5rem;
      font-weight: 800;
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1.1;
      letter-spacing: -1px;
    }
    .stat-label {
      font-size: 0.9375rem;
      color: var(--text-muted);
      margin-top: 0.375rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .stat-link {
      font-size: 0.875rem;
      color: var(--primary);
      text-decoration: none;
      font-weight: 500;
    }
    .dashboard-content {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 2rem;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1.25rem;
      border-bottom: 3px solid var(--border-light);
      position: relative;
    }
    .section-header::after {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 0;
      width: 80px;
      height: 3px;
      background: var(--primary-gradient);
      border-radius: 2px;
    }
    .section-header h2 {
      margin: 0;
      font-size: 1.375rem;
      font-weight: 800;
      color: var(--text);
    }
    .visits-list, .properties-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .visit-item, .property-item {
      padding: 1.25rem;
      background: var(--bg);
      border-radius: var(--radius);
      display: flex;
      align-items: center;
      gap: 1rem;
      border: 1px solid var(--border);
      transition: var(--transition);
    }
    .visit-item:hover, .property-item:hover {
      background: var(--surface);
      border-color: var(--primary-light);
      box-shadow: var(--shadow-md);
    }
    .reschedule-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 0.75rem;
      flex-wrap: wrap;
    }
    .reschedule-input, .form-input {
      min-height: 2.5rem;
      padding: 0.5rem 0.75rem;
      border: 2px solid var(--border);
      border-radius: var(--radius-sm);
      font-size: 0.9375rem;
      box-sizing: border-box;
    }
    .visit-property {
      font-weight: 600;
      color: var(--text);
      margin-bottom: 0.25rem;
    }
    .visit-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.875rem;
      color: var(--text-muted);
    }
    .visit-status, .property-status {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: capitalize;
    }
    .status-pending { background: rgba(245, 158, 11, 0.1); color: var(--warning); }
    .status-assigned { background: rgba(37, 99, 235, 0.1); color: var(--primary); }
    .status-completed { background: rgba(16, 185, 129, 0.1); color: var(--success); }
    .status-approved { background: rgba(16, 185, 129, 0.1); color: var(--success); }
    .status-rejected { background: rgba(239, 68, 68, 0.1); color: var(--danger); }
    .property-thumb {
      width: 80px;
      height: 80px;
      border-radius: var(--radius-sm);
      background-size: cover;
      background-position: center;
      flex-shrink: 0;
    }
    .property-info {
      flex: 1;
    }
    .property-title {
      font-weight: 600;
      color: var(--text);
      margin-bottom: 0.25rem;
    }
    .property-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.875rem;
      color: var(--text-muted);
    }
    .quick-actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .action-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: var(--radius-sm);
      text-decoration: none;
      color: var(--text);
      transition: var(--transition);
      position: relative;
    }
    .action-item:hover {
      background: var(--bg);
    }
    .action-icon {
      font-size: 1.25rem;
    }
    .notifications-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .notification-item {
      padding: 0.75rem;
      background: var(--bg);
      border-radius: var(--radius-sm);
      border-left: 3px solid transparent;
    }
    .notification-item.unread {
      border-left-color: var(--primary);
      background: rgba(37, 99, 235, 0.05);
    }
    .notification-title {
      font-weight: 600;
      font-size: 0.875rem;
      margin-bottom: 0.25rem;
    }
    .notification-message {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-bottom: 0.25rem;
    }
    .notification-time {
      font-size: 0.75rem;
      color: var(--text-light);
    }
    .empty-state {
      text-align: center;
      padding: 2rem;
    }
    .empty-icon {
      font-size: 3rem;
      margin-bottom: 0.5rem;
    }
    .empty-text {
      text-align: center;
      color: var(--text-muted);
      padding: 1rem;
    }
    @media (max-width: 1024px) {
      .dashboard-content {
        grid-template-columns: 1fr;
      }
    }
    @media (max-width: 768px) {
      .dashboard-page { padding: 1rem 0 2rem; }
      .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
      }
      .dashboard-header h1 { font-size: 1.75rem; }
      .dashboard-header p { font-size: 1rem; }
      .stats-grid { grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
      .stat-card { padding: 1.25rem; }
      .stat-value { font-size: 1.75rem; }
      .visit-item, .property-item { flex-direction: column; align-items: flex-start; }
      .property-thumb { width: 100%; height: 160px; }
    }
    @media (max-width: 480px) {
      .stats-grid { grid-template-columns: 1fr; }
    }
  `],
})
export class DashboardComponent implements OnInit {
  visits: SiteVisit[] = [];
  loadingVisits = true;
  recentProperties: Property[] = [];
  loadingProperties = true;
  myPropertiesCount = 0;
  totalViews = 0;
  unreadAlerts = 0;
  alerts: Alert[] = [];
  rescheduleVisitId: number | null = null;
  rescheduleDateTime = '';
  rescheduling = false;
  sendingEmailVerification = false;

  constructor(public auth: AuthService, private api: ApiService, private config: ConfigService, private toast: ToastrService, private cdr: ChangeDetectorRef) {}

  resolveImageUrl(url: string | undefined): string {
    if (!url) return 'https://placehold.co/100';
    if (url.startsWith('http')) return url;
    const base = this.config.apiUrl.replace(/\/$/, '');
    return base + (url.startsWith('/') ? url : '/' + url);
  }

  ngOnInit() {
    this.loadVisits();
    this.loadRecentProperties();
    this.loadStats();
    this.loadAlerts();
  }

  loadVisits() {
    this.api.get<{ content: SiteVisit[] }>('/sitevisits/my', { page: 0, size: 5 }).subscribe({
      next: (res) => {
        this.visits = res.content || [];
        this.loadingVisits = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loadingVisits = false;
        this.cdr.markForCheck();
      },
    });
  }

  loadRecentProperties() {
    this.api.get<PageResponse<Property>>('/properties/my', { page: 0, size: 5 }).subscribe({
      next: (res) => {
        this.recentProperties = res.content || [];
        this.myPropertiesCount = res.totalElements;
        this.loadingProperties = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loadingProperties = false;
        this.cdr.markForCheck();
      },
    });
  }

  loadStats() {
    // Calculate total views from properties
    this.api.get<PageResponse<Property>>('/properties/my', { page: 0, size: 100 }).subscribe({
      next: (res) => {
        this.totalViews = res.content.reduce((sum, p) => sum + (p.viewCount || 0), 0);
      },
    });
  }

  loadAlerts() {
    this.api.get<{ content: Alert[] }>('/alerts', { page: 0, size: 10 }).subscribe({
      next: (res) => {
        this.alerts = res.content || [];
        this.unreadAlerts = this.alerts.filter(a => !a.read).length;
      },
    });
  }

  openReschedule(v: SiteVisit) {
    this.rescheduleVisitId = v.id;
    const d = new Date(v.scheduledAt);
    const pad = (n: number) => n.toString().padStart(2, '0');
    this.rescheduleDateTime = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  cancelReschedule() {
    this.rescheduleVisitId = null;
    this.rescheduleDateTime = '';
  }

  sendEmailVerificationLink() {
    this.sendingEmailVerification = true;
    this.auth.sendEmailVerification().subscribe({
      next: () => {
        this.toast.success('Verification link sent to your email. Check your inbox.');
        this.sendingEmailVerification = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to send verification email');
        this.sendingEmailVerification = false;
        this.cdr.markForCheck();
      },
    });
  }

  submitReschedule(visitId: number) {
    if (!this.rescheduleDateTime) return;
    this.rescheduling = true;
    const scheduledAt = new Date(this.rescheduleDateTime).toISOString();
    this.api.put<SiteVisit>(`/sitevisits/${visitId}/reschedule`, { scheduledAt }).subscribe({
      next: () => {
        this.toast.success('Visit rescheduled. OTP remains the same.');
        this.cancelReschedule();
        this.loadVisits();
        this.rescheduling = false;
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to reschedule');
        this.rescheduling = false;
      },
    });
  }
}
