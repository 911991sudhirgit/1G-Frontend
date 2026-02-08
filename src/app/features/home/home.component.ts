import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Property } from '../../core/models/property.model';
import { PropertyCardComponent } from '../../shared/property-card/property-card.component';
import { SkeletonLoaderComponent } from '../../shared/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PropertyCardComponent, SkeletonLoaderComponent],
  template: `
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="container hero-content">
        <h1>Find Your Dream Property</h1>
        <p class="hero-subtitle">Discover the perfect home, apartment, or commercial space in India. Buy, sell, or rent with confidence on 1Guntha.</p>
        <div class="hero-search">
          <div class="search-tabs">
            <button [class.active]="searchType === 'buy'" (click)="searchType = 'buy'">Buy</button>
            <button [class.active]="searchType === 'rent'" (click)="searchType = 'rent'">Rent</button>
          </div>
          <div class="search-box">
            <input type="text" placeholder="Search by location, city, or locality..." [(ngModel)]="searchQuery" />
            <button class="btn btn-primary" (click)="goToSearch()">
              <span>🔍</span> Search
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🏠</div>
            <div class="stat-value">10,000+</div>
            <div class="stat-label">Properties</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-value">50,000+</div>
            <div class="stat-label">Happy Customers</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🏆</div>
            <div class="stat-value">500+</div>
            <div class="stat-label">Verified Agents</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⭐</div>
            <div class="stat-value">4.8/5</div>
            <div class="stat-label">Average Rating</div>
          </div>
        </div>
      </div>
    </section>

    <section class="categories-section">
      <div class="container">
        <h2 class="section-title">Browse by Category</h2>
        <div class="categories-grid">
          <a routerLink="/search" [queryParams]="{propertyType: 'HOUSE'}" class="category-card">
            <div class="category-icon">🏘️</div>
            <h3>Houses</h3>
            <p>Independent houses and villas</p>
          </a>
          <a routerLink="/search" [queryParams]="{propertyType: 'APARTMENT'}" class="category-card">
            <div class="category-icon">🏢</div>
            <h3>Apartments</h3>
            <p>Flats and apartments</p>
          </a>
          <a routerLink="/search" [queryParams]="{propertyType: 'LAND'}" class="category-card">
            <div class="category-icon">🌾</div>
            <h3>Land</h3>
            <p>Plots and land parcels</p>
          </a>
          <a routerLink="/search" [queryParams]="{propertyType: 'COMMERCIAL'}" class="category-card">
            <div class="category-icon">🏬</div>
            <h3>Commercial</h3>
            <p>Shops, offices, and more</p>
          </a>
        </div>
      </div>
    </section>

    <section class="featured-section">
      <div class="container">
        <div class="section-header">
          <div>
            <h2 class="section-title">Featured Properties</h2>
            <p class="section-subtitle">Handpicked properties just for you</p>
          </div>
          <a routerLink="/search" class="btn btn-outline">View All</a>
        </div>
        <div class="grid grid-3" *ngIf="featured.length && !loading">
          <app-property-card *ngFor="let p of featured" [property]="p" />
        </div>
        <div class="grid grid-3" *ngIf="loading">
          <div class="card" *ngFor="let i of [1,2,3,4,5,6]">
            <app-skeleton-loader height="200px" radius="var(--radius-lg) 0 0 var(--radius-lg)"></app-skeleton-loader>
            <div style="padding: 1rem;">
              <app-skeleton-loader height="24px" width="80%" style="margin-bottom: 0.5rem;"></app-skeleton-loader>
              <app-skeleton-loader height="16px" width="60%"></app-skeleton-loader>
            </div>
          </div>
        </div>
        <p *ngIf="!loading && !featured.length" class="empty-state">No featured properties available at the moment.</p>
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <div class="cta-card">
          <h2>Ready to List Your Property?</h2>
          <p>Join thousands of property owners on 1Guntha and reach millions of potential buyers across India</p>
          <a routerLink="/signup" class="btn btn-primary btn-lg">Get Started Free</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      position: relative;
      background: var(--primary-gradient);
      color: white;
      padding: 5rem 0 4.5rem;
      overflow: hidden;
    }
    .hero::before {
      content: '';
      position: absolute;
      inset: 0;
      background: url('data:image/svg+xml,<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/></pattern></defs><rect width="60" height="60" fill="url(%23grid)"/></svg>');
      opacity: 0.5;
    }
    .hero-content {
      position: relative;
      z-index: 1;
      text-align: center;
      max-width: 950px;
    }
    .hero h1 {
      font-size: 3.75rem;
      font-weight: 800;
      margin-bottom: 1.25rem;
      color: white;
      line-height: 1.1;
      letter-spacing: -1px;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .hero-subtitle {
      font-size: 1.375rem;
      opacity: 0.95;
      margin-bottom: 3rem;
      line-height: 1.6;
      font-weight: 400;
    }
    .hero-search {
      background: white;
      border-radius: var(--radius-xl);
      padding: 2rem;
      box-shadow: var(--shadow-2xl);
      max-width: 900px;
      margin: 0 auto;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .search-tabs {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      background: var(--bg);
      padding: 0.5rem;
      border-radius: var(--radius);
    }
    .search-tabs button {
      flex: 1;
      padding: 0.875rem 1.25rem;
      border: none;
      background: transparent;
      border-radius: var(--radius-sm);
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition);
      color: var(--text-secondary);
      font-size: 0.9375rem;
    }
    .search-tabs button.active {
      background: var(--primary-gradient);
      color: white;
      box-shadow: var(--shadow-md);
    }
    .search-box {
      display: flex;
      gap: 1rem;
      align-items: stretch;
    }
    .search-box input {
      flex: 1;
      padding: 1.125rem 1.5rem;
      border: 2px solid var(--border);
      border-radius: var(--radius);
      font-size: 1rem;
      font-weight: 500;
    }
    .search-box input:focus {
      border-color: var(--primary);
      outline: none;
      box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
    }
    .search-box .btn {
      padding: 1.125rem 2rem;
      font-size: 1rem;
      font-weight: 600;
      white-space: nowrap;
    }
    .stats-section {
      padding: 5rem 0;
      background: linear-gradient(to bottom, var(--surface) 0%, var(--bg) 100%);
      border-top: 1px solid var(--border-light);
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 2rem;
    }
    .stat-card {
      text-align: center;
      padding: 2.5rem 2rem;
      background: var(--surface);
      border-radius: var(--radius-lg);
      transition: var(--transition-slow);
      border: 2px solid var(--border-light);
      position: relative;
      overflow: hidden;
    }
    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: var(--primary-gradient);
      transform: scaleX(0);
      transition: transform 0.3s;
    }
    .stat-card:hover {
      transform: translateY(-6px);
      box-shadow: var(--shadow-xl);
      border-color: var(--primary-light);
    }
    .stat-card:hover::before {
      transform: scaleX(1);
    }
    .stat-icon {
      font-size: 3.5rem;
      margin-bottom: 1.25rem;
      filter: drop-shadow(0 4px 8px rgba(14, 165, 233, 0.2));
    }
    .stat-value {
      font-size: 3rem;
      font-weight: 800;
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.5rem;
      line-height: 1;
    }
    .stat-label {
      color: var(--text-muted);
      font-weight: 600;
      font-size: 0.9375rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .categories-section {
      padding: 5rem 0;
      background: var(--surface);
    }
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 2rem;
    }
    .category-card {
      background: var(--surface);
      padding: 2.5rem 2rem;
      border-radius: var(--radius-lg);
      text-align: center;
      transition: var(--transition-slow);
      border: 2px solid var(--border);
      position: relative;
      overflow: hidden;
    }
    .category-card::after {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--primary-gradient);
      opacity: 0;
      transition: opacity 0.3s;
    }
    .category-card:hover {
      border-color: var(--primary);
      transform: translateY(-6px);
      box-shadow: var(--shadow-xl);
    }
    .category-card:hover::after {
      opacity: 0.05;
    }
    .category-card > * {
      position: relative;
      z-index: 1;
    }
    .category-icon {
      font-size: 3.5rem;
      margin-bottom: 1.25rem;
      filter: drop-shadow(0 4px 8px rgba(14, 165, 233, 0.15));
    }
    .category-card h3 {
      margin-bottom: 0.75rem;
      color: var(--text);
      font-size: 1.25rem;
      font-weight: 700;
    }
    .category-card p {
      color: var(--text-muted);
      margin: 0;
      font-size: 0.9375rem;
    }
    .featured-section {
      padding: 4rem 0;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 2rem;
    }
    .cta-section {
      padding: 5rem 0;
      background: var(--primary-gradient);
      position: relative;
      overflow: hidden;
    }
    .cta-section::before {
      content: '';
      position: absolute;
      inset: 0;
      background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
    }
    .cta-card {
      background: white;
      padding: 4rem 3rem;
      border-radius: var(--radius-xl);
      text-align: center;
      max-width: 750px;
      margin: 0 auto;
      box-shadow: var(--shadow-2xl);
      position: relative;
      z-index: 1;
    }
    .cta-card h2 {
      color: var(--text);
      margin-bottom: 1rem;
      font-size: 2.25rem;
      font-weight: 800;
    }
    .cta-card p {
      color: var(--text-muted);
      margin-bottom: 2.5rem;
      font-size: 1.1875rem;
      line-height: 1.6;
    }
    .empty-state {
      text-align: center;
      padding: 3rem;
      color: var(--text-muted);
    }
    @media (max-width: 768px) {
      .hero h1 { font-size: 2.5rem; }
      .hero-subtitle { font-size: 1.125rem; }
      .search-box { flex-direction: column; }
      .section-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
    }
  `],
})
export class HomeComponent implements OnInit {
  featured: Property[] = [];
  loading = true;
  searchType = 'buy';
  searchQuery = '';

  constructor(private api: ApiService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.api.get<Property[]>('/properties/public/featured').subscribe({
      next: (data) => {
        this.featured = Array.isArray(data) ? data : [];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  goToSearch() {
    const params: any = {};
    if (this.searchQuery) params.city = this.searchQuery;
    if (this.searchType === 'rent') params.listingType = 'RENT';
    else params.listingType = 'SALE';
    this.router.navigate(['/search'], { queryParams: params });
  }
}
