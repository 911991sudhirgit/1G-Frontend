import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Property, PageResponse } from '../../core/models/property.model';
import { getStateNames, getCitiesForState } from '../../core/data/indian-locations';
import { PropertyCardComponent } from '../../shared/property-card/property-card.component';
import { SkeletonLoaderComponent } from '../../shared/skeleton-loader/skeleton-loader.component';

/** Price range for slider: 0 to 50 Crore, step 1 Lakh */
const PRICE_RANGE_MIN = 0;
const PRICE_RANGE_MAX = 500_000_000;
const PRICE_STEP = 100_000;

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, PropertyCardComponent, SkeletonLoaderComponent],
  template: `
    <div class="search-page">
      <div class="search-header">
        <div class="container">
          <h1>Find Your Perfect Property</h1>
          <p>Search from thousands of verified properties</p>
        </div>
      </div>
      <div class="container search-layout">
        <aside class="filters-sidebar">
          <div class="filters-card card">
            <div class="filters-header">
              <h3>Filters</h3>
              <button class="btn-link" (click)="clearFilters()">Clear All</button>
            </div>
            <div class="filter-section">
              <label>Listing Type</label>
              <div class="filter-options">
                <label class="radio-option">
                  <input type="radio" name="listing" value="" [(ngModel)]="listingType" (change)="search()" />
                  <span>All</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="listing" value="SALE" [(ngModel)]="listingType" (change)="search()" />
                  <span>Buy</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="listing" value="RENT" [(ngModel)]="listingType" (change)="search()" />
                  <span>Rent</span>
                </label>
              </div>
            </div>
            <div class="filter-section">
              <label>Property Type</label>
              <select [(ngModel)]="propertyType" (change)="search()">
                <option value="">All Types</option>
                <option value="HOUSE">House</option>
                <option value="APARTMENT">Apartment</option>
                <option value="LAND">Land</option>
                <option value="COMMERCIAL">Commercial</option>
              </select>
            </div>
            <div class="filter-section">
              <label>State</label>
              <select [(ngModel)]="state" (change)="onSearchStateChange()">
                <option value="">All States</option>
                <option *ngFor="let s of stateNames" [value]="s">{{ s }}</option>
              </select>
            </div>
            <div class="filter-section">
              <label>City</label>
              <select [(ngModel)]="city" (change)="search()">
                <option value="">All Cities</option>
                <option *ngFor="let c of citiesForState" [value]="c">{{ c }}</option>
              </select>
            </div>
            <div class="filter-section">
              <label>Price Range</label>
              <div class="price-range-slider">
                <div class="price-range-labels">
                  <span>{{ formatPriceLabel(priceSliderMin) }}</span>
                  <span>{{ formatPriceLabel(priceSliderMax) }}</span>
                </div>
                <div class="price-sliders">
                  <div class="price-slider-track" aria-hidden="true"></div>
                  <input type="range" [min]="priceRangeMin" [max]="priceRangeMax" [step]="priceStep"
                    [ngModel]="priceSliderMin" (ngModelChange)="onMinPriceChange($event)" name="minPriceRange" class="price-slider min-slider" />
                  <input type="range" [min]="priceRangeMin" [max]="priceRangeMax" [step]="priceStep"
                    [ngModel]="priceSliderMax" (ngModelChange)="onMaxPriceChange($event)" name="maxPriceRange" class="price-slider max-slider" />
                </div>
              </div>
            </div>
            <div class="filter-section">
              <label>Bedrooms</label>
              <select [(ngModel)]="bedrooms" (change)="search()">
                <option [value]="null">Any</option>
                <option [value]="1">1+ BHK</option>
                <option [value]="2">2+ BHK</option>
                <option [value]="3">3+ BHK</option>
                <option [value]="4">4+ BHK</option>
                <option [value]="5">5+ BHK</option>
              </select>
            </div>
            <div class="filter-section">
              <label>Area (sq.ft)</label>
              <input type="number" [(ngModel)]="minArea" placeholder="Minimum area" (keyup.enter)="search()" />
            </div>
            <button class="btn btn-primary btn-block" (click)="search()">Apply Filters</button>
          </div>
        </aside>
        <main class="results-main">
          <div class="results-header">
            <div>
              <h2>Search Results</h2>
              <p class="results-count">{{ totalElements }} properties found</p>
            </div>
            <div class="sort-options">
              <label>Sort by:</label>
              <select [(ngModel)]="sortBy" (change)="search()">
                <option value="createdAt,desc">Newest First</option>
                <option value="price,asc">Price: Low to High</option>
                <option value="price,desc">Price: High to Low</option>
                <option value="areaSqft,desc">Largest First</option>
              </select>
            </div>
          </div>
          <div class="results-grid grid grid-3" *ngIf="properties.length && !loading">
            <app-property-card *ngFor="let p of properties" [property]="p" />
          </div>
          <div class="results-grid grid grid-3" *ngIf="loading">
            <div class="card" *ngFor="let i of [1,2,3,4,5,6]">
              <app-skeleton-loader height="200px" radius="var(--radius-lg) 0 0 var(--radius-lg)"></app-skeleton-loader>
              <div style="padding: 1.25rem;">
                <app-skeleton-loader height="24px" width="60%" style="margin-bottom: 0.5rem;"></app-skeleton-loader>
                <app-skeleton-loader height="20px" width="80%" style="margin-bottom: 0.5rem;"></app-skeleton-loader>
                <app-skeleton-loader height="16px" width="50%"></app-skeleton-loader>
              </div>
            </div>
          </div>
          <div class="empty-state" *ngIf="!loading && !properties.length && searched">
            <div class="empty-icon">🏠</div>
            <h3>No properties found</h3>
            <p>Try adjusting your filters to see more results</p>
            <button class="btn btn-outline" (click)="clearFilters()">Clear Filters</button>
          </div>
          <div class="pagination" *ngIf="totalPages > 1 && !loading">
            <button class="btn btn-outline" [disabled]="page === 0" (click)="goPage(page - 1)">
              ← Previous
            </button>
            <div class="page-info">
              Page <strong>{{ page + 1 }}</strong> of <strong>{{ totalPages }}</strong>
            </div>
            <button class="btn btn-outline" [disabled]="page >= totalPages - 1" (click)="goPage(page + 1)">
              Next →
            </button>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .search-page { min-height: calc(100vh - 200px); }
    .search-header {
      background: var(--primary-gradient);
      color: white;
      padding: 3.5rem 0;
      margin-bottom: 2.5rem;
      position: relative;
      overflow: hidden;
    }
    .search-header::before {
      content: '';
      position: absolute;
      inset: 0;
      background: url('data:image/svg+xml,<svg width="80" height="80" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="80" height="80" fill="url(%23dots)"/></svg>');
      opacity: 0.5;
    }
    .search-header .container {
      position: relative;
      z-index: 1;
    }
    .search-header h1 {
      font-size: 2.75rem;
      margin-bottom: 0.75rem;
      color: white;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    .search-header p {
      font-size: 1.1875rem;
      opacity: 0.95;
      font-weight: 400;
    }
    .search-layout {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 2rem;
      padding: 0 1.5rem 2rem;
    }
    .filters-sidebar {
      position: sticky;
      top: 100px;
      height: fit-content;
    }
    .filters-card {
      padding: 2rem;
      border: 2px solid var(--border);
    }
    .filters-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1.25rem;
      border-bottom: 3px solid var(--border-light);
    }
    .filters-header h3 {
      margin: 0;
      font-size: 1.375rem;
      font-weight: 700;
      color: var(--text);
    }
    .btn-link {
      background: none;
      border: none;
      color: var(--primary);
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      padding: 0;
    }
    .btn-link:hover {
      text-decoration: underline;
    }
    .filter-section {
      margin-bottom: 2rem;
    }
    .filter-section label {
      display: block;
      font-weight: 700;
      margin-bottom: 0.75rem;
      color: var(--text);
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .filter-section select,
    .filter-section input[type="number"] {
      width: 100%;
      min-height: 2.75rem;
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      font-size: 0.9375rem;
      box-sizing: border-box;
      display: block;
    }
    .filter-section select:focus,
    .filter-section input[type="number"]:focus {
      border-color: var(--primary);
      outline: none;
    }
    .filter-options {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .radio-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: var(--radius-sm);
      transition: var(--transition);
    }
    .radio-option:hover {
      background: var(--bg);
    }
    .radio-option input[type="radio"] {
      width: auto;
      margin: 0;
    }
    .price-range-slider {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .price-range-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--primary);
    }
    .price-sliders {
      position: relative;
      height: 2rem;
      width: 100%;
    }
    .price-slider-track {
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      height: 6px;
      background: var(--border);
      border-radius: 999px;
      pointer-events: none;
    }
    .price-slider {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      -webkit-appearance: none;
      appearance: none;
      background: transparent;
      pointer-events: none;
    }
    .price-slider::-webkit-slider-runnable-track {
      height: 6px;
      margin-top: calc(1rem - 3px);
      background: transparent;
      border-radius: 999px;
    }
    .price-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--primary);
      cursor: pointer;
      pointer-events: auto;
      margin-top: calc(3px - 9px);
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      position: relative;
      z-index: 2;
    }
    .price-slider::-moz-range-track {
      height: 6px;
      margin-top: calc(1rem - 3px);
      background: transparent;
      border-radius: 999px;
    }
    .price-slider::-moz-range-thumb {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--primary);
      cursor: pointer;
      pointer-events: auto;
      border: none;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      position: relative;
      z-index: 2;
    }
    .max-slider {
      pointer-events: auto;
    }
    .min-slider::-webkit-slider-thumb {
      z-index: 3;
    }
    .results-main {
      min-height: 500px;
    }
    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 2rem;
      padding-bottom: 1.25rem;
      border-bottom: 3px solid var(--border-light);
    }
    .results-header h2 {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--text);
    }
    .results-count {
      color: var(--text-muted);
      font-size: 0.9375rem;
      margin: 0.5rem 0 0 0;
      font-weight: 500;
    }
    .sort-options {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .sort-options label {
      font-size: 0.875rem;
      color: var(--text-muted);
    }
    .sort-options select {
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      font-size: 0.875rem;
    }
    .results-grid {
      margin-bottom: 2rem;
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
      padding: 2rem 0;
    }
    .page-info {
      padding: 0 1rem;
      color: var(--text-muted);
    }
    @media (max-width: 1024px) {
      .search-layout {
        grid-template-columns: 1fr;
      }
      .filters-sidebar {
        position: static;
      }
      .filters-card {
        margin-bottom: 2rem;
      }
    }
  `],
})
export class SearchComponent implements OnInit {
  state = '';
  city = '';
  listingType = '';
  propertyType = '';
  priceRangeMin = PRICE_RANGE_MIN;
  priceRangeMax = PRICE_RANGE_MAX;
  priceStep = PRICE_STEP;
  priceSliderMin = PRICE_RANGE_MIN;
  priceSliderMax = PRICE_RANGE_MAX;
  minPrice: number | null = null;
  maxPrice: number | null = null;
  bedrooms: number | null = null;
  minArea: number | null = null;
  page = 0;
  size = 12;
  sortBy = 'createdAt,desc';
  properties: Property[] = [];
  totalPages = 0;
  totalElements = 0;
  loading = false;
  searched = false;
  stateNames = getStateNames();
  citiesForState: string[] = [];

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['state']) this.state = params['state'];
      if (params['city']) this.city = params['city'];
      if (params['listingType']) this.listingType = params['listingType'];
      if (params['propertyType']) this.propertyType = params['propertyType'];
      this.updateCitiesForState();
      this.search();
    });
  }

  onSearchStateChange() {
    this.city = '';
    this.updateCitiesForState();
    this.search();
  }

  private updateCitiesForState() {
    this.citiesForState = this.state ? getCitiesForState(this.state) : [];
  }

  search() {
    this.loading = true;
    this.searched = true;
    const [sort, direction] = this.sortBy.split(',');
    const params: Record<string, string | number | boolean> = {
      page: this.page,
      size: this.size,
      sort,
      direction,
    };
    if (this.city) params['city'] = this.city;
    if (this.listingType) params['listingType'] = this.listingType;
    if (this.propertyType) params['propertyType'] = this.propertyType;
    if (this.minPrice != null) params['minPrice'] = this.minPrice;
    if (this.maxPrice != null) params['maxPrice'] = this.maxPrice;
    if (this.bedrooms != null) params['bedrooms'] = this.bedrooms;
    if (this.minArea != null) params['minArea'] = this.minArea;

    this.api.get<PageResponse<Property>>('/properties/search', params).subscribe({
      next: (res) => {
        this.properties = res.content;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  onMinPriceChange(val: number | string) {
    const n = Number(val);
    this.priceSliderMin = n;
    if (n > this.priceSliderMax) this.priceSliderMax = n;
    this.syncPriceFromSliders();
    this.search();
  }

  onMaxPriceChange(val: number | string) {
    const n = Number(val);
    this.priceSliderMax = n;
    if (n < this.priceSliderMin) this.priceSliderMin = n;
    this.syncPriceFromSliders();
    this.search();
  }

  /** Send min/max to API only when user has narrowed the range from full; otherwise no price filter. */
  private syncPriceFromSliders() {
    const isFullRange = this.priceSliderMin === PRICE_RANGE_MIN && this.priceSliderMax === PRICE_RANGE_MAX;
    this.minPrice = isFullRange ? null : this.priceSliderMin;
    this.maxPrice = isFullRange ? null : this.priceSliderMax;
  }

  formatPriceLabel(rupees: number): string {
    if (rupees >= 1_00_00_000) return '₹' + (rupees / 1_00_00_000).toFixed(1).replace(/\.0$/, '') + ' Cr';
    if (rupees >= 1_00_000) return '₹' + (rupees / 1_00_000).toFixed(0) + ' L';
    return '₹' + (rupees / 1000).toFixed(0) + 'K';
  }

  clearFilters() {
    this.state = '';
    this.city = '';
    this.listingType = '';
    this.propertyType = '';
    this.priceSliderMin = PRICE_RANGE_MIN;
    this.priceSliderMax = PRICE_RANGE_MAX;
    this.minPrice = null;
    this.maxPrice = null;
    this.bedrooms = null;
    this.minArea = null;
    this.page = 0;
    this.search();
  }

  goPage(p: number) {
    this.page = p;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.search();
  }
}
