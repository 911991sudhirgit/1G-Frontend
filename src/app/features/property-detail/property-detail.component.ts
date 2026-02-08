import { Component, OnInit, HostListener, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ConfigService } from '../../core/services/config.service';
import { Property } from '../../core/models/property.model';
import { ToastrService } from 'ngx-toastr';
import { SkeletonLoaderComponent } from '../../shared/skeleton-loader/skeleton-loader.component';
import { PropertyMapComponent } from '../../shared/property-map/property-map.component';
import { resolvePropertyImageUrl } from '../../core/utils/image-url.util';

/** User's active site visit for this property (PENDING_ASSIGNMENT or ASSIGNED). Used to show Reschedule instead of Book. */
interface SiteVisitDto {
  id: number;
  scheduledAt: string;
  status: string;
}

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, SkeletonLoaderComponent, PropertyMapComponent],
  template: `
    <div class="property-detail-wrapper">
    <div class="property-detail-page" *ngIf="property && !loading">
      <div class="container">
        <div class="breadcrumb">
          <a routerLink="/">Home</a> / <a routerLink="/search">Properties</a> / <span>{{ property.title }}</span>
        </div>
        
        <div class="property-header">
          <div class="header-left">
            <h1>{{ property.title }}</h1>
            <div class="property-location">
              <span>📍</span> {{ property.address }}, {{ property.city }}{{ property.state ? ', ' + property.state : '' }}
            </div>
            <div class="property-badges">
              <span class="badge badge-listing">{{ property.listingType }}</span>
              <span class="badge badge-type">{{ property.propertyType }}</span>
              <span class="badge badge-premium" *ngIf="property.isPremium">⭐ Premium</span>
            </div>
          </div>
          <div class="header-right">
            <div class="price-section">
              <div class="price">₹ {{ property.price | number }}</div>
              <div class="price-label">{{ property.listingType === 'RENT' ? 'per month' : 'total price' }}</div>
            </div>
            <div class="action-buttons">
              <ng-container *ngIf="auth.user()">
                <button class="btn btn-primary btn-lg" (click)="bookVisit()" *ngIf="!myVisitForProperty">
                  📅 Book Site Visit
                </button>
                <div class="existing-visit-actions" *ngIf="myVisitForProperty">
                  <span class="visit-scheduled">Visit scheduled: {{ myVisitForProperty.scheduledAt | date:'medium' }}</span>
                  <button class="btn btn-primary btn-lg" (click)="openReschedule()">📅 Reschedule visit</button>
                </div>
              </ng-container>
              <button class="btn btn-outline" (click)="toggleWatchlist()" *ngIf="auth.user()">
                {{ inWatchlist ? '❤️ Liked' : '🤍 Like' }}
              </button>
              <a routerLink="/login" class="btn btn-primary btn-lg" *ngIf="!auth.user()">Login to Book Visit</a>
            </div>
          </div>
        </div>

        <div class="gallery-section">
          <div class="main-image">
            <img [src]="currentImageFullUrl" [alt]="property.title" (click)="openZoom(currentImageFullUrl)" class="zoomable" />
            <button class="gallery-nav prev" (click)="prevImage(); $event.stopPropagation()" *ngIf="property.images && property.images.length > 1">‹</button>
            <button class="gallery-nav next" (click)="nextImage(); $event.stopPropagation()" *ngIf="property.images && property.images.length > 1">›</button>
            <div class="image-counter" *ngIf="property.images && property.images.length > 1">
              {{ currentIndex + 1 }} / {{ property.images.length }}
            </div>
          </div>
          <div class="thumbnail-grid" *ngIf="property.images && property.images.length > 1">
            <button *ngFor="let img of property.images; let i = index" 
                    [class.active]="currentIndex === i"
                    (click)="currentIndex = i; $event.stopPropagation()"
                    (dblclick)="openZoom(imageFullUrl(img.imageUrl))"
                    [style.backgroundImage]="'url(' + imageFullUrl(img.imageUrl) + ')'"></button>
          </div>
        </div>
        <div class="zoom-overlay" *ngIf="zoomOpen" (click)="closeZoom()">
          <img [src]="zoomUrl" alt="Zoom" (click)="$event.stopPropagation()" class="zoom-image" />
          <button type="button" class="zoom-close" (click)="closeZoom()">×</button>
        </div>

        <div class="property-content">
          <div class="main-content">
            <section class="info-section card">
              <h2>Property Details</h2>
              <div class="details-grid">
                <div class="detail-item" *ngIf="property.bedrooms">
                  <div class="detail-icon">🛏️</div>
                  <div>
                    <div class="detail-label">Bedrooms</div>
                    <div class="detail-value">{{ property.bedrooms }} BHK</div>
                  </div>
                </div>
                <div class="detail-item" *ngIf="property.bathrooms">
                  <div class="detail-icon">🚿</div>
                  <div>
                    <div class="detail-label">Bathrooms</div>
                    <div class="detail-value">{{ property.bathrooms }}</div>
                  </div>
                </div>
                <div class="detail-item" *ngIf="property.areaSqft">
                  <div class="detail-icon">📐</div>
                  <div>
                    <div class="detail-label">Area</div>
                    <div class="detail-value">{{ property.areaSqft }} sq.ft</div>
                  </div>
                </div>
                <div class="detail-item">
                  <div class="detail-icon">🏠</div>
                  <div>
                    <div class="detail-label">Type</div>
                    <div class="detail-value">{{ property.propertyType }}</div>
                  </div>
                </div>
              </div>
            </section>

            <section class="description-section card" *ngIf="property.description">
              <h2>Description</h2>
              <p>{{ property.description }}</p>
            </section>

            <section class="amenities-section card" *ngIf="property.amenities">
              <h2>Amenities</h2>
              <div class="amenities-list">
                <span *ngFor="let amenity of amenitiesList" class="amenity-item">✓ {{ amenity }}</span>
              </div>
            </section>

            <section class="location-section card">
              <h2>Location</h2>
              <app-property-map
                mode="view"
                [latitude]="property.latitude ?? null"
                [longitude]="property.longitude ?? null"
              ></app-property-map>
              <div class="location-details">
                <p><strong>Address:</strong> {{ property.address }}</p>
                <p *ngIf="property.locality"><strong>Locality:</strong> {{ property.locality }}</p>
                <p><strong>City:</strong> {{ property.city }}</p>
                <p *ngIf="property.state"><strong>State:</strong> {{ property.state }}</p>
                <p *ngIf="property.pincode"><strong>Pincode:</strong> {{ property.pincode }}</p>
              </div>
            </section>

            <section class="analytics-section card" *ngIf="property.viewCount !== undefined">
              <h2>Property Insights</h2>
              <div class="analytics-grid">
                <div class="analytics-item">
                  <div class="analytics-icon">👁️</div>
                  <div>
                    <div class="analytics-value">{{ property.viewCount || 0 }}</div>
                    <div class="analytics-label">Views</div>
                  </div>
                </div>
                <div class="analytics-item">
                  <div class="analytics-icon">📞</div>
                  <div>
                    <div class="analytics-value">{{ property.clickCount || 0 }}</div>
                    <div class="analytics-label">Clicks</div>
                  </div>
                </div>
                <div class="analytics-item">
                  <div class="analytics-icon">📅</div>
                  <div>
                    <div class="analytics-value">{{ property.visitCount || 0 }}</div>
                    <div class="analytics-label">Site Visits</div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside class="sidebar">
            <div class="contact-card card">
              <h3>Contact Owner</h3>
              <div class="owner-info" *ngIf="property.ownerName">
                <div class="owner-avatar">{{ property.ownerName.charAt(0) }}</div>
                <div>
                  <div class="owner-name">{{ property.ownerName }}</div>
                  <div class="owner-role">Property Owner</div>
                </div>
              </div>
              <ng-container *ngIf="auth.user()">
                <button class="btn btn-primary btn-block" (click)="bookVisit()" *ngIf="!myVisitForProperty">
                  📅 Book Site Visit
                </button>
                <div class="existing-visit-sidebar" *ngIf="myVisitForProperty">
                  <p class="visit-scheduled-text">Your visit: {{ myVisitForProperty.scheduledAt | date:'medium' }}</p>
                  <button class="btn btn-primary btn-block" (click)="openReschedule()">📅 Reschedule</button>
                </div>
              </ng-container>
              <a routerLink="/login" class="btn btn-primary btn-block" *ngIf="!auth.user()">Login to Contact</a>
            </div>

            <div class="quick-info card">
              <h3>Quick Facts</h3>
              <div class="quick-facts">
                <div class="fact-item">
                  <span class="fact-label">Property ID</span>
                  <span class="fact-value">#{{ property.id }}</span>
                </div>
                <div class="fact-item" *ngIf="property.createdAt">
                  <span class="fact-label">Listed</span>
                  <span class="fact-value">{{ property.createdAt | date:'MMM d, y' }}</span>
                </div>
                <div class="fact-item" *ngIf="property.isPremium && property.premiumExpiresAt">
                  <span class="fact-label">Premium Until</span>
                  <span class="fact-value">{{ property.premiumExpiresAt | date:'MMM d, y' }}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>

    <div class="container" *ngIf="loading">
      <div class="loading-skeleton">
        <app-skeleton-loader height="400px" style="margin-bottom: 2rem;"></app-skeleton-loader>
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
          <div>
            <app-skeleton-loader height="200px" style="margin-bottom: 1rem;"></app-skeleton-loader>
            <app-skeleton-loader height="200px"></app-skeleton-loader>
          </div>
          <app-skeleton-loader height="300px"></app-skeleton-loader>
        </div>
      </div>
    </div>

    <div class="container" *ngIf="!property && !loading">
      <div class="not-found">
        <div class="not-found-icon">🏠</div>
        <h2>{{ loadError ? 'Unable to load property' : 'Property Not Found' }}</h2>
        <p>{{ loadError || "The property you're looking for doesn't exist or has been removed." }}</p>
        <a routerLink="/search" class="btn btn-primary">Browse Properties</a>
      </div>
    </div>
    </div>

    <div class="modal-overlay" *ngIf="showBookForm" (click)="showBookForm = false">
      <div class="modal card" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Book Site Visit</h3>
          <button class="modal-close" (click)="showBookForm = false">×</button>
        </div>
        <form (ngSubmit)="submitVisit()" class="modal-body">
          <div class="form-group">
            <label>Preferred Date & Time</label>
            <input type="datetime-local" [(ngModel)]="visitDate" name="visitDate" required />
          </div>
          <div class="form-group">
            <label>Additional Notes (Optional)</label>
            <textarea [(ngModel)]="visitNotes" name="visitNotes" rows="4" placeholder="Any special requirements or questions..."></textarea>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-outline" (click)="showBookForm = false">Cancel</button>
            <button type="submit" class="btn btn-primary">Submit Request</button>
          </div>
        </form>
      </div>
    </div>

    <div class="modal-overlay" *ngIf="showRescheduleForm" (click)="showRescheduleForm = false">
      <div class="modal card" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Reschedule Site Visit</h3>
          <button class="modal-close" (click)="showRescheduleForm = false">×</button>
        </div>
        <form (ngSubmit)="submitReschedule()" class="modal-body">
          <div class="form-group">
            <label>New Date & Time</label>
            <input type="datetime-local" [(ngModel)]="rescheduleDate" name="rescheduleDate" required />
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-outline" (click)="showRescheduleForm = false">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="rescheduling">{{ rescheduling ? 'Updating...' : 'Reschedule Visit' }}</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 60vh; width: 100%; box-sizing: border-box; }
    .property-detail-wrapper { min-height: 60vh; width: 100%; max-width: 100%; overflow-x: hidden; box-sizing: border-box; }
    .property-detail-page { padding: 2rem 0 4rem; width: 100%; box-sizing: border-box; }
    .breadcrumb {
      margin-bottom: 1.5rem;
      color: var(--text-muted);
      font-size: 0.875rem;
    }
    .breadcrumb a { color: var(--primary); }
    .breadcrumb span { color: var(--text-muted); }
    .property-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 2rem;
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 2px solid var(--border-light);
    }
    .header-left h1 {
      font-size: 2rem;
      margin-bottom: 0.75rem;
      color: var(--text);
    }
    .property-location {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-muted);
      margin-bottom: 1rem;
      font-size: 1rem;
    }
    .property-badges {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .header-right {
      text-align: right;
    }
    .price-section {
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: linear-gradient(135deg, rgba(14, 165, 233, 0.05) 0%, rgba(2, 132, 199, 0.05) 100%);
      border-radius: var(--radius-lg);
      border: 2px solid rgba(14, 165, 233, 0.1);
    }
    .price {
      font-size: 2.5rem;
      font-weight: 800;
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1.1;
      letter-spacing: -1px;
    }
    .price-label {
      font-size: 0.9375rem;
      color: var(--text-muted);
      margin-top: 0.5rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      min-width: 200px;
      align-items: stretch;
    }
    .gallery-section {
      margin-bottom: 3rem;
    }
    .main-image {
      position: relative;
      aspect-ratio: 16/10;
      border-radius: var(--radius-xl);
      overflow: hidden;
      margin-bottom: 1.25rem;
      background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
      box-shadow: var(--shadow-xl);
      border: 2px solid var(--border-light);
    }
    .main-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s;
    }
    .main-image:hover img {
      transform: scale(1.02);
    }
    .gallery-nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255, 255, 255, 0.9);
      border: none;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      font-size: 1.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition);
      z-index: 2;
    }
    .gallery-nav:hover {
      background: white;
      box-shadow: var(--shadow-lg);
    }
    .gallery-nav.prev { left: 1rem; }
    .gallery-nav.next { right: 1rem; }
    .image-counter {
      position: absolute;
      bottom: 1rem;
      right: 1rem;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: var(--radius-sm);
      font-size: 0.875rem;
      backdrop-filter: blur(4px);
    }
    .thumbnail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 0.75rem;
    }
    .thumbnail-grid button {
      aspect-ratio: 1;
      border: 3px solid transparent;
      border-radius: var(--radius-sm);
      background-size: cover;
      background-position: center;
      cursor: pointer;
      transition: var(--transition);
      opacity: 0.7;
    }
    .thumbnail-grid button:hover,
    .thumbnail-grid button.active {
      opacity: 1;
      border-color: var(--primary);
      transform: scale(1.05);
    }
    .property-content {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 2rem;
      min-width: 0;
    }
    .property-content .main-content,
    .property-content .sidebar {
      min-width: 0;
    }
    .info-section, .description-section, .amenities-section, .location-section, .analytics-section {
      padding: 2.5rem;
      margin-bottom: 2rem;
      border: 1px solid var(--border);
    }
    .info-section h2, .description-section h2, .amenities-section h2, .location-section h2, .analytics-section h2 {
      font-size: 1.625rem;
      margin-bottom: 2rem;
      padding-bottom: 1.25rem;
      border-bottom: 3px solid var(--border-light);
      font-weight: 800;
      color: var(--text);
      position: relative;
    }
    .info-section h2::after, .description-section h2::after, .amenities-section h2::after, .location-section h2::after, .analytics-section h2::after {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 0;
      width: 60px;
      height: 3px;
      background: var(--primary-gradient);
      border-radius: 2px;
    }
    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }
    .detail-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: var(--bg);
      border-radius: var(--radius);
    }
    .detail-icon {
      font-size: 2rem;
    }
    .detail-label {
      font-size: 0.875rem;
      color: var(--text-muted);
      margin-bottom: 0.25rem;
    }
    .detail-value {
      font-weight: 600;
      color: var(--text);
    }
    .amenities-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .amenity-item {
      padding: 0.5rem 1rem;
      background: var(--bg);
      border-radius: var(--radius-sm);
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
    .map-container {
      margin-bottom: 1.5rem;
    }
    .map {
      width: 100%;
      height: 400px;
      border-radius: var(--radius);
      background: var(--bg-secondary);
    }
    .location-details p {
      margin: 0.5rem 0;
      color: var(--text-secondary);
    }
    .analytics-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }
    .analytics-item {
      text-align: center;
      padding: 1.5rem;
      background: var(--bg);
      border-radius: var(--radius);
    }
    .analytics-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    .analytics-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--primary);
      margin-bottom: 0.25rem;
    }
    .analytics-label {
      font-size: 0.875rem;
      color: var(--text-muted);
    }
    .sidebar {
      position: sticky;
      top: 100px;
      height: fit-content;
    }
    .contact-card, .quick-info {
      padding: 2rem;
      margin-bottom: 1.5rem;
      border: 2px solid var(--border);
    }
    .contact-card h3, .quick-info h3 {
      margin-bottom: 1.5rem;
      font-size: 1.375rem;
      font-weight: 700;
      color: var(--text);
      padding-bottom: 1rem;
      border-bottom: 2px solid var(--border-light);
    }
    .owner-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-light);
    }
    .owner-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.25rem;
    }
    .owner-name {
      font-weight: 600;
      color: var(--text);
    }
    .owner-role {
      font-size: 0.875rem;
      color: var(--text-muted);
    }
    .quick-facts {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .fact-item {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--border-light);
    }
    .fact-label {
      color: var(--text-muted);
      font-size: 0.875rem;
    }
    .fact-value {
      font-weight: 600;
      color: var(--text);
    }
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    }
    .modal {
      max-width: 500px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid var(--border-light);
    }
    .modal-header h3 {
      margin: 0;
    }
    .modal-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--text-muted);
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-sm);
    }
    .modal-close:hover {
      background: var(--bg);
    }
    .modal-body {
      padding: 1.5rem;
    }
    .modal-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      justify-content: flex-end;
      align-items: center;
      margin-top: 1.5rem;
    }
    .loading-skeleton, .not-found {
      padding: 4rem 0;
      text-align: center;
    }
    .not-found-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }
    @media (max-width: 1024px) {
      .property-content {
        grid-template-columns: 1fr;
      }
      .sidebar {
        position: static;
      }
      .property-header {
        flex-direction: column;
      }
      .header-right {
        text-align: left;
      }
      .action-buttons {
        flex-direction: row;
      }
    }
    @media (max-width: 768px) {
      .property-header { gap: 1rem; }
      .property-detail-page .container { padding-left: 1rem; padding-right: 1rem; }
    }
    .zoomable {
      cursor: zoom-in;
    }
    .zoom-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.9);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: zoom-out;
    }
    .zoom-image {
      max-width: 95vw;
      max-height: 95vh;
      object-fit: contain;
      cursor: default;
    }
    .existing-visit-actions, .existing-visit-sidebar {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .visit-scheduled, .visit-scheduled-text {
      font-size: 0.9rem;
      color: var(--text-muted);
    }
    .zoom-close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 48px;
      height: 48px;
      border: none;
      background: rgba(255,255,255,0.2);
      color: white;
      font-size: 2rem;
      line-height: 1;
      border-radius: 50%;
      cursor: pointer;
    }
  `],
})
export class PropertyDetailComponent implements OnInit {
  property: Property | null = null;
  loading = true;
  loadError = '';
  currentIndex = 0;
  inWatchlist = false;
  showBookForm = false;
  visitDate = '';
  visitNotes = '';
  myVisitForProperty: SiteVisitDto | null = null;
  showRescheduleForm = false;
  rescheduleDate = '';
  rescheduling = false;
  zoomOpen = false;
  zoomUrl = '';

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private config: ConfigService,
    public auth: AuthService,
    private toast: ToastrService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  @HostListener('document:keydown.escape')
  onEscape() {
    this.zoomOpen = false;
  }

  imageFullUrl(url: string): string {
    return resolvePropertyImageUrl(url, this.config.apiUrl);
  }

  openZoom(url: string) {
    if (!url) return;
    this.zoomUrl = url;
    this.zoomOpen = true;
  }

  closeZoom() {
    this.zoomOpen = false;
  }

  get currentImageFullUrl(): string {
    return this.imageFullUrl(this.currentImage);
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id || id === 'new') {
      this.loading = false;
      this.loadError = 'Invalid property URL. Use a valid property link from search or home.';
      return;
    }
    this.loadError = '';
    this.api.get<Property & { data?: Property }>('/properties/' + id, { includeAnalytics: true }).subscribe({
      next: (res) => {
        this.ngZone.run(() => {
          const raw = res && (res as any).data != null ? (res as any).data : res;
          const p = raw && typeof raw === 'object' && (raw.id != null || raw.title != null) ? raw : null;
          this.property = p as Property | null;
          this.loading = false;
          this.loadError = this.property ? '' : 'Invalid response from server.';
          if (this.auth.user() && this.property) {
            this.api.get<{ inWatchlist: boolean }>('/properties/' + id + '/watchlist').subscribe({
              next: (r) => {
                this.inWatchlist = r.inWatchlist;
                this.cdr.detectChanges();
              },
              error: () => {},
            });
            this.loadMyVisitForProperty();
          }
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.loading = false;
          this.loadError = err.status === 401
            ? 'Please log in again to view this property.'
            : (err.error?.message || 'Failed to load property.');
          this.cdr.detectChanges();
        });
      },
    });
  }

  /** Load current user's active site visit for this property so we show Reschedule instead of Book when one exists. */
  loadMyVisitForProperty() {
    if (!this.property?.id || !this.auth.user()) return;
    this.api.get<SiteVisitDto>('/sitevisits/my/for-property/' + this.property.id).subscribe({
      next: (v) => (this.myVisitForProperty = v),
      error: () => {
        // 404 = no active visit; other errors also result in showing Book
        this.myVisitForProperty = null;
      },
    });
  }

  get currentImage(): string {
    if (!this.property?.images?.length) return 'https://placehold.co/1200x675?text=Property';
    return this.property.images[this.currentIndex]?.imageUrl || this.property.images[0].imageUrl;
  }

  get amenitiesList(): string[] {
    if (!this.property?.amenities) return [];
    return this.property.amenities.split(',').map(a => a.trim()).filter(a => a);
  }

  prevImage() {
    if (!this.property?.images?.length) return;
    this.currentIndex = (this.currentIndex - 1 + this.property.images.length) % this.property.images.length;
  }

  nextImage() {
    if (!this.property?.images?.length) return;
    this.currentIndex = (this.currentIndex + 1) % this.property.images.length;
  }

  bookVisit() {
    if (!this.auth.user()) {
      this.toast.info('Please login to book a visit');
      return;
    }
    if (this.myVisitForProperty) {
      this.toast.info('You already have a site visit for this property. Use Reschedule to change the date.');
      return;
    }
    this.showBookForm = true;
  }

  submitVisit() {
    if (!this.property || !this.visitDate) return;
    const scheduledAt = new Date(this.visitDate).toISOString();
    this.api.post<SiteVisitDto>('/sitevisits', { propertyId: this.property.id, scheduledAt, userNotes: this.visitNotes }).subscribe({
      next: (v) => {
        this.toast.success('Site visit requested successfully');
        this.showBookForm = false;
        this.visitDate = '';
        this.visitNotes = '';
        this.myVisitForProperty = v;
      },
      error: (e) => this.toast.error(e.error?.message || 'Failed to book visit'),
    });
  }

  openReschedule() {
    if (!this.myVisitForProperty) return;
    const d = new Date(this.myVisitForProperty.scheduledAt);
    const pad = (n: number) => String(n).padStart(2, '0');
    this.rescheduleDate = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    this.showRescheduleForm = true;
  }

  submitReschedule() {
    if (!this.myVisitForProperty || !this.rescheduleDate) return;
    this.rescheduling = true;
    const scheduledAt = new Date(this.rescheduleDate).toISOString();
    this.api.put<SiteVisitDto>(`/sitevisits/${this.myVisitForProperty.id}/reschedule`, { scheduledAt }).subscribe({
      next: (v) => {
        this.myVisitForProperty = v;
        this.showRescheduleForm = false;
        this.rescheduleDate = '';
        this.rescheduling = false;
        this.toast.success('Visit rescheduled successfully.');
      },
      error: (e) => {
        this.rescheduling = false;
        this.toast.error(e.error?.message || 'Failed to reschedule');
      },
    });
  }

  toggleWatchlist() {
    if (!this.property || !this.auth.user()) return;
    if (this.inWatchlist) {
      this.api.delete('/properties/' + this.property.id + '/watchlist').subscribe({
        next: () => {
          this.inWatchlist = false;
          this.toast.success('Removed from likes');
        },
      });
    } else {
      this.api.post('/properties/' + this.property.id + '/watchlist', {}).subscribe({
        next: () => {
          this.inWatchlist = true;
          this.toast.success('Added to likes');
        },
      });
    }
  }
}
