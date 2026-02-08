import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Property, PageResponse } from '../../core/models/property.model';
import { PropertyCardComponent } from '../../shared/property-card/property-card.component';
import { SkeletonLoaderComponent } from '../../shared/skeleton-loader/skeleton-loader.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-properties',
  standalone: true,
  imports: [CommonModule, RouterLink, PropertyCardComponent, SkeletonLoaderComponent],
  template: `
    <div class="my-properties-page">
      <div class="container">
        <div class="page-header">
          <div>
            <h1>My Properties</h1>
            <p>Manage your property listings</p>
          </div>
          <a routerLink="/property/new" class="btn btn-primary">
            <span>+</span> List New Property
          </a>
        </div>

        <div class="properties-grid grid grid-3" *ngIf="properties.length && !loading">
          <div class="property-wrapper" *ngFor="let p of properties">
            <app-property-card [property]="p" />
            <div class="property-actions">
              <span class="property-status-badge" 
                    [class.status-approved]="p.status === 'APPROVED'"
                    [class.status-pending]="p.status === 'PENDING_APPROVAL'"
                    [class.status-rejected]="p.status === 'REJECTED'">
                {{ p.status?.replace('_', ' ') ?? '' }}
              </span>
              <div class="action-buttons">
                <a [routerLink]="['/property', p.id]" class="btn btn-outline btn-sm">View</a>
                <a [routerLink]="['/property', p.id, 'edit']" class="btn btn-outline btn-sm">Edit</a>
                <button class="btn btn-outline btn-sm" (click)="deleteProperty(p.id)" [disabled]="deleting">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="properties-grid grid grid-3" *ngIf="loading">
          <div class="card" *ngFor="let i of [1,2,3,4,5,6]">
            <app-skeleton-loader height="200px" radius="var(--radius-lg) 0 0 var(--radius-lg)"></app-skeleton-loader>
            <div style="padding: 1.25rem;">
              <app-skeleton-loader height="24px" width="60%" style="margin-bottom: 0.5rem;"></app-skeleton-loader>
              <app-skeleton-loader height="20px" width="80%"></app-skeleton-loader>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="!loading && !properties.length">
          <div class="empty-icon">🏠</div>
          <h3>No Properties Listed</h3>
          <p>Start by listing your first property on 1Guntha and reach thousands of potential buyers across India</p>
          <a routerLink="/property/new" class="btn btn-primary">List Your First Property</a>
        </div>

        <div class="pagination" *ngIf="totalPages > 1 && !loading">
          <button class="btn btn-outline" [disabled]="page === 0" (click)="load(page - 1)">
            ← Previous
          </button>
          <div class="page-info">
            Page <strong>{{ page + 1 }}</strong> of <strong>{{ totalPages }}</strong>
          </div>
          <button class="btn btn-outline" [disabled]="page >= totalPages - 1" (click)="load(page + 1)">
            Next →
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .my-properties-page { padding: 2rem 0 4rem; }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
    }
    .page-header h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    .page-header p {
      color: var(--text-muted);
      font-size: 1.125rem;
    }
    .property-wrapper {
      position: relative;
    }
    .property-actions {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      opacity: 0;
      transition: var(--transition);
    }
    .property-wrapper:hover .property-actions {
      opacity: 1;
    }
    .property-status-badge {
      padding: 0.375rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: capitalize;
      color: white;
    }
    .status-approved { background: var(--success); }
    .status-pending { background: var(--warning); }
    .status-rejected { background: var(--danger); }
    .action-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      align-items: center;
    }
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
    }
    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }
    .empty-state h3 {
      margin-bottom: 0.5rem;
    }
    .empty-state p {
      color: var(--text-muted);
      margin-bottom: 1.5rem;
    }
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-top: 3rem;
    }
    .page-info {
      padding: 0 1rem;
      color: var(--text-muted);
    }
  `],
})
export class MyPropertiesComponent implements OnInit {
  properties: Property[] = [];
  page = 0;
  totalPages = 0;
  loading = true;
  deleting = false;

  constructor(
    private api: ApiService,
    private router: Router,
    private toast: ToastrService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.load(0);
  }

  load(p: number) {
    this.page = p;
    this.loading = true;
    this.api.get<PageResponse<Property>>('/properties/my', { page: this.page, size: 12 }).subscribe({
      next: (res) => {
        this.ngZone.run(() => {
          this.properties = Array.isArray((res as any)?.content) ? (res as any).content : [];
          this.totalPages = (res as any)?.totalPages ?? 0;
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

  deleteProperty(id: number) {
    if (!confirm('Are you sure you want to delete this property?')) return;
    this.deleting = true;
    this.api.delete('/properties/' + id).subscribe({
      next: () => {
        this.toast.success('Property deleted successfully');
        this.properties = this.properties.filter(p => p.id !== id);
        this.deleting = false;
      },
      error: (e) => {
        this.toast.error(e.error?.message || 'Failed to delete property');
        this.deleting = false;
      },
    });
  }
}
