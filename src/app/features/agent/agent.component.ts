import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { SkeletonLoaderComponent } from '../../shared/skeleton-loader/skeleton-loader.component';

interface SiteVisitRow {
  id: number;
  userId: number;
  userName: string;
  propertyId: number;
  propertyTitle: string;
  agentId?: number;
  agentName?: string;
  scheduledAt: string;
  userNotes?: string;
  status: string;
  createdAt: string;
}

interface AgentVisitsResponse {
  content: SiteVisitRow[];
  totalElements: number;
  totalPages: number;
  dueTodayCount: number;
}

@Component({
  selector: 'app-agent',
  standalone: true,
  imports: [CommonModule, RouterLink, SkeletonLoaderComponent],
  template: `
    <div class="agent-page">
      <div class="container">
        <div class="agent-header">
          <div>
            <h1>My Site Visits</h1>
            <p>Assigned site visits — due today shown first</p>
          </div>
        </div>

        <div class="notifications-banner card" *ngIf="dueTodayCount > 0">
          <span class="banner-icon">📅</span>
          <div class="banner-content">
            <strong>{{ dueTodayCount }} visit(s) due today</strong>
            <span>Complete them and enter the OTP from the customer to mark as done.</span>
          </div>
        </div>

        <div class="visits-section card">
          <div class="section-header">
            <h2>Assigned Visits</h2>
            <span class="badge badge-info" *ngIf="dueTodayCount > 0">Due today: {{ dueTodayCount }}</span>
          </div>
          <div class="visits-list" *ngIf="visits.length && !loading">
            <div class="visit-item" *ngFor="let v of visits" [class.due-today]="isDueToday(v.scheduledAt)">
              <div class="visit-info">
                <div class="visit-property">{{ v.propertyTitle }}</div>
                <div class="visit-meta">
                  <span>📅 {{ v.scheduledAt | date:'MMM d, y h:mm a' }}</span>
                  <span class="visit-status" [class.status-assigned]="v.status === 'ASSIGNED'"
                        [class.status-completed]="v.status === 'COMPLETED'">
                    {{ v.status }}
                  </span>
                  <span class="due-badge" *ngIf="isDueToday(v.scheduledAt) && v.status === 'ASSIGNED'">Due today</span>
                </div>
                <div class="visit-user" *ngIf="v.userName">Customer: {{ v.userName }}</div>
              </div>
              <a [routerLink]="['/agent/visit', v.id]" class="btn btn-primary btn-sm" *ngIf="v.status === 'ASSIGNED'">
                View & Complete
              </a>
              <a [routerLink]="['/agent/visit', v.id]" class="btn btn-outline btn-sm" *ngIf="v.status === 'COMPLETED'">
                View details
              </a>
            </div>
          </div>
          <div class="empty-state" *ngIf="!visits.length && !loading">
            <div class="empty-icon">📋</div>
            <p>No site visits assigned to you yet.</p>
          </div>
          <div class="loading-state" *ngIf="loading">
            <app-skeleton-loader height="72px" style="margin-bottom: 0.5rem;" *ngFor="let i of [1,2,3,4]"></app-skeleton-loader>
          </div>
          <div class="pagination-row" *ngIf="totalPages > 1 && !loading">
            <button class="btn btn-outline btn-sm" [disabled]="page === 0" (click)="prevPage()">Previous</button>
            <span class="page-info">Page {{ page + 1 }} of {{ totalPages }}</span>
            <button class="btn btn-outline btn-sm" [disabled]="page >= totalPages - 1" (click)="nextPage()">Next</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .agent-page { padding: 2rem 0 4rem; }
    .agent-header {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 3px solid var(--border-light);
    }
    .agent-header h1 {
      font-size: 2rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
    }
    .agent-header p { color: var(--text-muted); font-size: 1rem; }
    .notifications-banner {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem 1.5rem;
      margin-bottom: 2rem;
      background: rgba(37, 99, 235, 0.08);
      border: 2px solid rgba(37, 99, 235, 0.2);
    }
    .banner-icon { font-size: 2rem; }
    .banner-content {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .visits-section {
      padding: 2rem;
      border: 2px solid var(--border);
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid var(--border-light);
    }
    .section-header h2 { margin: 0; font-size: 1.375rem; font-weight: 700; }
    .badge-info {
      background: #dbeafe;
      color: #1e40af;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 600;
    }
    .visits-list { display: flex; flex-direction: column; gap: 1rem; }
    .visit-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      padding: 1.25rem;
      background: var(--bg);
      border-radius: var(--radius);
      border: 1px solid var(--border);
    }
    .visit-item.due-today { background: rgba(37, 99, 235, 0.06); border-color: rgba(37, 99, 235, 0.25); }
    .visit-property { font-weight: 600; color: var(--text); margin-bottom: 0.35rem; }
    .visit-meta { display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.875rem; color: var(--text-muted); }
    .visit-status {
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .status-assigned { background: #dbeafe; color: #1e40af; }
    .status-completed { background: #d1fae5; color: #065f46; }
    .due-badge { background: #fef3c7; color: #92400e; padding: 0.2rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
    .visit-user { font-size: 0.875rem; color: var(--text-muted); margin-top: 0.25rem; }
    .empty-state { text-align: center; padding: 2rem; }
    .empty-icon { font-size: 3rem; margin-bottom: 0.5rem; }
    .loading-state { padding: 1rem; }
    .pagination-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border);
    }
    .page-info { font-size: 0.875rem; color: var(--text-muted); }
  `],
})
export class AgentComponent implements OnInit {
  visits: SiteVisitRow[] = [];
  loading = true;
  page = 0;
  size = 20;
  totalPages = 0;
  totalElements = 0;
  dueTodayCount = 0;

  constructor(public auth: AuthService, private api: ApiService, private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.api.get<AgentVisitsResponse>('/agent/sitevisits', { page: this.page, size: this.size }).subscribe({
      next: (res) => {
        this.ngZone.run(() => {
          this.visits = (res as any)?.content ?? [];
          this.totalElements = (res as any)?.totalElements ?? 0;
          this.totalPages = (res as any)?.totalPages ?? 0;
          this.dueTodayCount = (res as any)?.dueTodayCount ?? 0;
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.ngZone.run(() => {
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
    });
  }

  isDueToday(scheduledAt: string): boolean {
    if (!scheduledAt) return false;
    const d = new Date(scheduledAt);
    const today = new Date();
    return d.getFullYear() === today.getFullYear() &&
           d.getMonth() === today.getMonth() &&
           d.getDate() === today.getDate();
  }

  prevPage() {
    if (this.page > 0) {
      this.page--;
      this.load();
    }
  }

  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.load();
    }
  }
}
