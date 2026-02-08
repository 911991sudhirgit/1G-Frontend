import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ConfigService } from '../../core/services/config.service';
import { ToastrService } from 'ngx-toastr';
import { resolvePropertyImageUrl } from '../../core/utils/image-url.util';

interface PropertySummary {
  id: number;
  title: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  listingType?: string;
  propertyType?: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  areaSqft?: number;
  amenities?: string;
  firstImageUrl?: string;
}

interface SiteVisitComment {
  id: number;
  userId: number;
  userName: string;
  commentText: string;
  createdAt: string;
}

interface SiteVisitDetail {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  userMobile: string;
  propertyId: number;
  property: PropertySummary;
  agentId?: number;
  agentName?: string;
  scheduledAt: string;
  userNotes?: string;
  status: string;
  createdAt: string;
  comments: SiteVisitComment[];
}

@Component({
  selector: 'app-agent-visit-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="visit-detail-page">
      <div class="container">
        <a routerLink="/agent" class="back-link">← Back to My Visits</a>

        <div *ngIf="loading" class="loading-state">Loading visit details...</div>
        <div *ngIf="error" class="error-state">{{ error }}</div>

        <div *ngIf="detail && !loading" class="detail-content">
          <div class="detail-header card">
            <h1>{{ detail.property.title }}</h1>
            <p class="scheduled">📅 {{ detail.scheduledAt | date:'fullDate' }} at {{ detail.scheduledAt | date:'shortTime' }}</p>
            <span class="status-badge" [class.status-assigned]="detail.status === 'ASSIGNED'"
                  [class.status-completed]="detail.status === 'COMPLETED'">{{ detail.status }}</span>
          </div>

          <div class="grid-two">
            <section class="card">
              <h2>Property Details</h2>
              <div class="prop-image" *ngIf="detail.property.firstImageUrl"
                   [style.backgroundImage]="'url(' + imageUrl(detail.property.firstImageUrl) + ')'"></div>
              <dl class="prop-dl">
                <dt>Address</dt>
                <dd>{{ detail.property.address }}, {{ detail.property.city }} {{ detail.property.state }} {{ detail.property.pincode }}</dd>
                <dt>Type</dt>
                <dd>{{ detail.property.propertyType }} · {{ detail.property.listingType }}</dd>
                <dt>Price</dt>
                <dd>₹ {{ detail.property.price | number }}</dd>
                <dt>Beds / Baths / Area</dt>
                <dd>{{ detail.property.bedrooms }} / {{ detail.property.bathrooms }} / {{ detail.property.areaSqft }} sq ft</dd>
                <dt *ngIf="detail.property.amenities">Amenities</dt>
                <dd *ngIf="detail.property.amenities">{{ detail.property.amenities }}</dd>
              </dl>
            </section>

            <section class="card">
              <h2>Requesting Customer</h2>
              <dl class="user-dl">
                <dt>Name</dt>
                <dd>{{ detail.userName }}</dd>
                <dt>Email</dt>
                <dd><a [href]="'mailto:' + detail.userEmail">{{ detail.userEmail }}</a></dd>
                <dt>Mobile</dt>
                <dd><a [href]="'tel:' + detail.userMobile">{{ detail.userMobile }}</a></dd>
                <dt *ngIf="detail.userNotes">Notes from customer</dt>
                <dd *ngIf="detail.userNotes" class="user-notes">{{ detail.userNotes }}</dd>
              </dl>
            </section>
          </div>

          <section class="card complete-section" *ngIf="detail.status === 'ASSIGNED'">
            <h2>Mark visit as done</h2>
            <p class="help-text">Enter the OTP that was sent to the customer when the visit was assigned.</p>
            <div class="otp-row">
              <input type="text" class="form-input otp-input" [(ngModel)]="otp" placeholder="Enter 6-digit OTP"
                     maxlength="6" pattern="[0-9]*" inputmode="numeric" />
              <button type="button" class="btn btn-primary" (click)="completeVisit()" [disabled]="completing || !otp.trim()">
                {{ completing ? 'Completing...' : 'Complete visit' }}
              </button>
            </div>
          </section>

          <section class="card comments-section">
            <h2>Comments (visible to admin)</h2>
            <div class="comments-list" *ngIf="detail.comments.length">
              <div class="comment-item" *ngFor="let c of detail.comments">
                <div class="comment-meta">{{ c.userName }} · {{ c.createdAt | date:'short' }}</div>
                <div class="comment-text">{{ c.commentText }}</div>
              </div>
            </div>
            <p *ngIf="!detail.comments.length" class="empty-comments">No comments yet.</p>
            <div class="add-comment">
              <textarea class="form-input" [(ngModel)]="newComment" placeholder="Add a comment..." rows="3"></textarea>
              <button type="button" class="btn btn-primary btn-sm" (click)="addComment()" [disabled]="savingComment || !newComment.trim()">
                {{ savingComment ? 'Saving...' : 'Add comment' }}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .visit-detail-page { padding: 2rem 0 4rem; }
    .back-link {
      display: inline-block;
      margin-bottom: 1.5rem;
      color: var(--primary);
      text-decoration: none;
      font-weight: 500;
    }
    .back-link:hover { text-decoration: underline; }
    .loading-state, .error-state { padding: 2rem; text-align: center; }
    .error-state { color: var(--danger); }
    .detail-header {
      padding: 1.5rem 2rem;
      margin-bottom: 1.5rem;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1rem;
    }
    .detail-header h1 { margin: 0; font-size: 1.5rem; font-weight: 700; flex: 1; }
    .scheduled { margin: 0; color: var(--text-muted); font-size: 0.9375rem; }
    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .status-assigned { background: #dbeafe; color: #1e40af; }
    .status-completed { background: #d1fae5; color: #065f46; }
    .grid-two {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }
    .card {
      padding: 1.5rem 2rem;
      border: 2px solid var(--border);
      border-radius: var(--radius);
    }
    .card h2 { margin: 0 0 1rem 0; font-size: 1.125rem; font-weight: 700; }
    .prop-image {
      width: 100%;
      height: 200px;
      background-size: cover;
      background-position: center;
      border-radius: var(--radius-sm);
      margin-bottom: 1rem;
    }
    .prop-dl, .user-dl {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 0.5rem 1.5rem;
      font-size: 0.9375rem;
    }
    .prop-dl dt, .user-dl dt { color: var(--text-muted); font-weight: 600; }
    .prop-dl dd, .user-dl dd { margin: 0; }
    .user-dl a { color: var(--primary); }
    .user-notes { font-style: italic; color: var(--text-muted); }
    .complete-section { margin-bottom: 1.5rem; }
    .help-text { font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1rem; }
    .otp-row {
      display: flex;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;
    }
    .otp-input { width: 160px; font-size: 1.25rem; letter-spacing: 0.25em; text-align: center; }
    .form-input {
      padding: 0.5rem 0.75rem;
      border: 2px solid var(--border);
      border-radius: var(--radius-sm);
      font-size: 0.9375rem;
    }
    .comments-section h2 { margin-bottom: 1rem; }
    .comments-list { margin-bottom: 1rem; }
    .comment-item {
      padding: 0.75rem;
      background: var(--bg);
      border-radius: var(--radius-sm);
      margin-bottom: 0.5rem;
      border: 1px solid var(--border);
    }
    .comment-meta { font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.25rem; }
    .comment-text { font-size: 0.9375rem; }
    .empty-comments { color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1rem; }
    .add-comment textarea { width: 100%; margin-bottom: 0.75rem; resize: vertical; }
    @media (max-width: 768px) {
      .grid-two { grid-template-columns: 1fr; }
    }
  `],
})
export class AgentVisitDetailComponent implements OnInit {
  detail: SiteVisitDetail | null = null;
  loading = true;
  error = '';
  otp = '';
  completing = false;
  newComment = '';
  savingComment = false;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private config: ConfigService,
    private toast: ToastrService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadDetail(+id);
    else {
      this.loading = false;
      this.error = 'Invalid visit id';
    }
  }

  imageUrl(url: string | undefined): string {
    return resolvePropertyImageUrl(url, this.config.apiUrl);
  }

  loadDetail(id: number) {
    this.loading = true;
    this.error = '';
    this.api.get<SiteVisitDetail>(`/agent/sitevisits/${id}`).subscribe({
      next: (d) => {
        this.ngZone.run(() => {
          this.detail = d;
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.error = err.error?.message || 'Failed to load visit';
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
    });
  }

  completeVisit() {
    if (!this.detail || !this.otp?.trim()) return;
    this.completing = true;
    this.cdr.detectChanges();
    this.api.post<unknown>(`/agent/sitevisits/${this.detail.id}/complete?otp=${encodeURIComponent(this.otp.trim())}`, {}).subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.toast.success('Visit marked as done.');
          this.detail!.status = 'COMPLETED';
          this.otp = '';
          this.completing = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.toast.error(err.error?.message || 'Failed to complete visit');
          this.completing = false;
          this.cdr.detectChanges();
        });
      },
    });
  }

  addComment() {
    if (!this.detail || !this.newComment?.trim()) return;
    this.savingComment = true;
    this.cdr.detectChanges();
    this.api.post<SiteVisitComment>(`/agent/sitevisits/${this.detail.id}/comments`, { commentText: this.newComment.trim() }).subscribe({
      next: (c) => {
        this.ngZone.run(() => {
          if (!this.detail!.comments) this.detail!.comments = [];
          this.detail!.comments.push(c);
          this.newComment = '';
          this.toast.success('Comment added.');
          this.savingComment = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.toast.error(err.error?.message || 'Failed to add comment');
          this.savingComment = false;
          this.cdr.detectChanges();
        });
      },
    });
  }
}
