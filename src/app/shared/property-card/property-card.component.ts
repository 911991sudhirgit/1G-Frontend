import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Property } from '../../core/models/property.model';
import { ConfigService } from '../../core/services/config.service';

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <a [routerLink]="['/property', property.id]" class="card property-card">
      <div class="img-wrap">
        <img [src]="imgUrl" [alt]="property.title" />
        <div class="overlay-badges">
          <span class="badge badge-listing">{{ property.listingType }}</span>
          <span class="badge badge-premium" *ngIf="property.isPremium">⭐ Premium</span>
        </div>
        <div class="img-count" *ngIf="property.images && property.images.length > 1">
          📷 {{ property.images.length }}
        </div>
      </div>
      <div class="body">
        <div class="price-tag">₹ {{ property.price | number }}</div>
        <h3>{{ property.title }}</h3>
        <p class="location">
          <span>📍</span> {{ property.city }}{{ property.locality ? ', ' + property.locality : '' }}
        </p>
        <div class="features">
          <span *ngIf="property.bedrooms" class="feature-item">
            <span>🛏️</span> {{ property.bedrooms }} BHK
          </span>
          <span *ngIf="property.bathrooms" class="feature-item">
            <span>🚿</span> {{ property.bathrooms }} Bath
          </span>
          <span *ngIf="property.areaSqft" class="feature-item">
            <span>📐</span> {{ property.areaSqft }} sq.ft
          </span>
        </div>
        <div class="footer">
          <span class="property-type">{{ property.propertyType }}</span>
          <span class="views" *ngIf="property.viewCount">
            👁️ {{ property.viewCount }}
          </span>
        </div>
      </div>
    </a>
  `,
  styles: [`
    .property-card {
      display: block;
      color: inherit;
      transition: var(--transition-slow);
      border: 1px solid var(--border);
      overflow: hidden;
      background: var(--surface);
      position: relative;
    }
    .property-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-2xl);
      border-color: var(--primary-light);
    }
    .img-wrap {
      position: relative;
      aspect-ratio: 16/11;
      background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
      overflow: hidden;
    }
    .img-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .property-card:hover .img-wrap img {
      transform: scale(1.08);
    }
    .overlay-badges {
      position: absolute;
      top: 0.875rem;
      left: 0.875rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      z-index: 2;
    }
    .badge-listing {
      background: var(--primary-gradient);
      color: white;
      padding: 0.4375rem 0.875rem;
      border-radius: var(--radius-sm);
      font-size: 0.75rem;
      font-weight: 700;
      box-shadow: var(--shadow-lg);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .badge-premium {
      background: linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%);
      color: white;
      padding: 0.4375rem 0.875rem;
      border-radius: var(--radius-sm);
      font-size: 0.75rem;
      font-weight: 700;
      box-shadow: var(--shadow-lg);
    }
    .img-count {
      position: absolute;
      bottom: 0.875rem;
      right: 0.875rem;
      background: rgba(0, 0, 0, 0.75);
      color: white;
      padding: 0.4375rem 0.875rem;
      border-radius: var(--radius-sm);
      font-size: 0.75rem;
      font-weight: 600;
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    .body {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0;
    }
    .price-tag {
      font-size: 1.75rem;
      font-weight: 800;
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.625rem;
      letter-spacing: -0.5px;
    }
    .body h3 {
      font-size: 1.1875rem;
      font-weight: 700;
      margin-bottom: 0.625rem;
      color: var(--text);
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-height: 3em;
    }
    .location {
      font-size: 0.875rem;
      color: var(--text-muted);
      margin: 0 0 1rem 0;
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-weight: 500;
    }
    .features {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid var(--border-light);
    }
    .feature-item {
      font-size: 0.875rem;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-weight: 500;
      padding: 0.25rem 0;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
      font-size: 0.8125rem;
      color: var(--text-muted);
      padding-top: 0.5rem;
    }
    .property-type {
      text-transform: capitalize;
      font-weight: 600;
      color: var(--text-secondary);
    }
    .views {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-weight: 500;
    }
  `],
})
export class PropertyCardComponent {
  @Input() property!: Property;

  constructor(private config: ConfigService) {}

  get imgUrl(): string {
    const imgs = this.property.images;
    if (imgs?.length) return this.resolveImageUrl(imgs[0].imageUrl);
    return 'https://placehold.co/400x250?text=Property';
  }

  resolveImageUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const base = this.config.apiUrl.replace(/\/$/, '');
    return base + (url.startsWith('/') ? url : '/' + url);
  }
}
