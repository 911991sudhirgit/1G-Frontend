import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ConfigService } from '../../core/services/config.service';
import { Property } from '../../core/models/property.model';
import { ToastrService } from 'ngx-toastr';
import { getStateNames, getCitiesForState } from '../../core/data/indian-locations';
import { PropertyMapComponent } from '../../shared/property-map/property-map.component';
import { resolvePropertyImageUrl } from '../../core/utils/image-url.util';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PropertyMapComponent],
  template: `
    <div class="property-form-page">
      <div class="container">
        <div class="form-header">
          <h1>{{ isEdit ? 'Edit Property' : 'List Your Property' }}</h1>
          <p>{{ isEdit ? 'Update your property details' : 'Reach thousands of potential buyers on 1Guntha' }}</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="property-form card">
          <div class="form-section">
            <h3>Basic Information</h3>
            <div class="form-row">
              <div class="form-group">
                <label>Property Title *</label>
                <input type="text" formControlName="title" placeholder="e.g., Beautiful 3BHK Apartment in Prime Location" />
                <span class="error" *ngIf="form.get('title')?.invalid && form.get('title')?.touched">Title is required</span>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Description</label>
                <textarea formControlName="description" rows="5" placeholder="Describe your property in detail..."></textarea>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Listing Type *</label>
                <select formControlName="listingType">
                  <option value="">Select</option>
                  <option value="SALE">For Sale</option>
                  <option value="RENT">For Rent</option>
                </select>
                <span class="error" *ngIf="form.get('listingType')?.invalid && form.get('listingType')?.touched">Required</span>
              </div>
              <div class="form-group">
                <label>Property Type *</label>
                <select formControlName="propertyType">
                  <option value="">Select</option>
                  <option value="HOUSE">House</option>
                  <option value="APARTMENT">Apartment</option>
                  <option value="LAND">Land</option>
                  <option value="COMMERCIAL">Commercial</option>
                </select>
                <span class="error" *ngIf="form.get('propertyType')?.invalid && form.get('propertyType')?.touched">Required</span>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Price (₹) *</label>
                <input type="number" formControlName="price" placeholder="Enter price" min="0" />
                <span class="error" *ngIf="form.get('price')?.invalid && form.get('price')?.touched">Valid price required</span>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>Location Details</h3>
            <div class="form-row">
              <div class="form-group">
                <label>Address *</label>
                <input type="text" formControlName="address" placeholder="Street address" />
                <span class="error" *ngIf="form.get('address')?.invalid && form.get('address')?.touched">Address is required</span>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Locality</label>
                <input type="text" formControlName="locality" placeholder="Locality/Area" />
              </div>
              <div class="form-group">
                <label>State *</label>
                <select formControlName="state" (change)="onStateChange()">
                  <option value="">Select State / UT</option>
                  <option *ngFor="let s of stateNames" [value]="s">{{ s }}</option>
                </select>
                <span class="error" *ngIf="form.get('state')?.invalid && form.get('state')?.touched">State is required</span>
              </div>
              <div class="form-group">
                <label>City *</label>
                <select formControlName="city">
                  <option value="">Select City</option>
                  <option *ngFor="let c of citiesForState" [value]="c">{{ c }}</option>
                </select>
                <span class="error" *ngIf="form.get('city')?.invalid && form.get('city')?.touched">City is required</span>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Pincode</label>
                <input type="text" formControlName="pincode" placeholder="Pincode" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group full-width">
                <label>Site location (drop a pin on the map)</label>
                <app-property-map
                  mode="pick"
                  [latitude]="form.get('latitude')?.value"
                  [longitude]="form.get('longitude')?.value"
                  (locationChange)="onMapLocation($event)"
                ></app-property-map>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Latitude (Optional)</label>
                <input type="number" formControlName="latitude" placeholder="e.g., 19.0760" step="any" />
              </div>
              <div class="form-group">
                <label>Longitude (Optional)</label>
                <input type="number" formControlName="longitude" placeholder="e.g., 72.8777" step="any" />
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>Property Specifications</h3>
            <div class="form-row">
              <div class="form-group">
                <label>Bedrooms</label>
                <input type="number" formControlName="bedrooms" placeholder="Number of bedrooms" min="0" />
              </div>
              <div class="form-group">
                <label>Bathrooms</label>
                <input type="number" formControlName="bathrooms" placeholder="Number of bathrooms" min="0" />
              </div>
              <div class="form-group">
                <label>Area (sq.ft)</label>
                <input type="number" formControlName="areaSqft" placeholder="Total area" min="0" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Amenities (comma-separated)</label>
                <input type="text" formControlName="amenities" placeholder="e.g., Parking, Gym, Swimming Pool, Security" />
                <small>Separate multiple amenities with commas</small>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>Property Images</h3>
            <div class="images-section">
              <div class="add-url-row">
                <div class="form-group add-url-input">
                  <label>Image URL</label>
                  <input type="url" [(ngModel)]="newImageUrl" [ngModelOptions]="{standalone: true}" placeholder="https://example.com/image.jpg" (keydown.enter)="addImageByUrl(); $event.preventDefault()" />
                </div>
                <button type="button" class="btn btn-primary add-url-btn" (click)="addImageByUrl()">Add URL</button>
              </div>
              <small class="images-hint">Paste an image URL above and click Add URL. For Google Drive links, set the file sharing to &quot;Anyone with the link&quot; so the image can display.</small>
              <div class="image-preview-row" *ngFor="let url of imageUrls; let i = index">
                <img *ngIf="url" [src]="imagePreviewUrl(url)" alt="Preview" class="image-preview" (error)="onImageError($event)" />
                <span *ngIf="!url" class="preview-placeholder">No image</span>
                <div class="image-actions">
                  <button type="button" class="btn btn-outline btn-sm" (click)="removeImage(i)">Remove</button>
                </div>
              </div>
              <button type="button" class="btn btn-outline" (click)="addImageSlot()">+ Add another image slot</button>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-outline" (click)="cancel()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || submitting">
              {{ submitting ? 'Saving...' : (isEdit ? 'Update Property' : 'List Property') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .property-form-page { padding: 2rem 0 4rem; }
    .form-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .form-header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }
    .form-header p {
      color: var(--text-muted);
      font-size: 1.125rem;
    }
    .property-form {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
    }
    .form-section {
      margin-bottom: 2.5rem;
      padding-bottom: 2rem;
      border-bottom: 2px solid var(--border-light);
    }
    .form-section:last-of-type {
      border-bottom: none;
    }
    .form-section h3 {
      font-size: 1.25rem;
      margin-bottom: 1.5rem;
      color: var(--text);
    }
    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-group.full-width { grid-column: 1 / -1; }
    .form-group label {
      display: block;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--text);
      font-size: 0.875rem;
    }
    .form-group input, .form-group select, .form-group textarea {
      width: 100%;
      min-height: 2.75rem;
      padding: 0.75rem 1rem;
      border: 2px solid var(--border);
      border-radius: var(--radius-sm);
      font-size: 1rem;
      font-family: inherit;
      transition: var(--transition);
      box-sizing: border-box;
      display: block;
    }
    .form-group textarea {
      min-height: auto;
    }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
    .form-group small {
      display: block;
      margin-top: 0.25rem;
      color: var(--text-muted);
      font-size: 0.75rem;
    }
    .error {
      display: block;
      color: var(--danger);
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    .images-section {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .add-url-row {
      display: flex;
      gap: 0.75rem;
      align-items: flex-end;
      flex-wrap: wrap;
    }
    .add-url-row .add-url-input {
      flex: 1;
      min-width: 200px;
      margin-bottom: 0;
    }
    .add-url-row .add-url-btn {
      flex-shrink: 0;
    }
    .images-hint {
      margin-bottom: 0.25rem;
    }
    .image-input {
      display: flex;
      gap: 0.5rem;
      align-items: flex-end;
    }
    .image-input input {
      flex: 1;
    }
    .file-input.hidden {
      position: absolute;
      width: 0;
      height: 0;
      opacity: 0;
    }
    .image-preview-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      border: 2px solid var(--border);
      border-radius: var(--radius-sm);
      margin-bottom: 0.75rem;
    }
    .image-preview {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: var(--radius-sm);
    }
    .preview-placeholder {
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg);
      color: var(--text-muted);
      font-size: 0.75rem;
      border-radius: var(--radius-sm);
    }
    .image-actions {
      display: flex;
      gap: 0.5rem;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 2px solid var(--border-light);
    }
    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
      .form-actions {
        flex-direction: column;
      }
    }
  `],
})
export class PropertyFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  propertyId: number | null = null;
  submitting = false;
  imageUrls: string[] = [];
  newImageUrl = '';
  stateNames = getStateNames();
  citiesForState: string[] = [];

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private config: ConfigService,
    public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastrService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      listingType: ['', Validators.required],
      propertyType: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      address: ['', Validators.required],
      locality: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: [''],
      latitude: [null],
      longitude: [null],
      bedrooms: [null],
      bathrooms: [null],
      areaSqft: [null],
      amenities: [''],
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.propertyId = +id;
      this.loadProperty();
    } else {
      this.imageUrls = [''];
    }
    this.updateCitiesForState();
  }

  onStateChange() {
    this.form.patchValue({ city: '' });
    this.updateCitiesForState();
  }

  private updateCitiesForState() {
    const state = this.form.get('state')?.value;
    this.citiesForState = state ? getCitiesForState(state) : [];
  }

  onMapLocation(e: { lat: number; lng: number }) {
    this.form.patchValue({ latitude: e.lat, longitude: e.lng });
  }

  loadProperty() {
    if (!this.propertyId) return;
    this.api.get<Property>('/properties/' + this.propertyId).subscribe({
      next: (p) => {
        this.form.patchValue({
          title: p.title,
          description: p.description || '',
          listingType: p.listingType,
          propertyType: p.propertyType,
          price: p.price,
          address: p.address,
          locality: p.locality || '',
          city: p.city || '',
          state: p.state || '',
          pincode: p.pincode || '',
          latitude: p.latitude || null,
          longitude: p.longitude || null,
          bedrooms: p.bedrooms || null,
          bathrooms: p.bathrooms || null,
          areaSqft: p.areaSqft || null,
          amenities: p.amenities || '',
        });
        this.updateCitiesForState();
        if (p.images && p.images.length) {
          this.imageUrls = p.images.map(img => img.imageUrl);
        } else {
          this.imageUrls = [''];
        }
      },
      error: () => this.toast.error('Failed to load property'),
    });
  }

  imagePreviewUrl(url: string): string {
    return resolvePropertyImageUrl(url, this.config.apiUrl);
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'https://placehold.co/160x120?text=Image+unavailable';
    img.onerror = null;
  }

  addImageByUrl() {
    const url = (this.newImageUrl || '').trim();
    if (!url) {
      this.toast.warning('Enter an image URL');
      return;
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      this.toast.warning('URL must start with http:// or https://');
      return;
    }
    this.imageUrls.push(url);
    this.newImageUrl = '';
    this.toast.success('Image URL added');
  }

  addImageSlot() {
    this.imageUrls.push('');
  }

  addImage() {
    this.imageUrls.push('');
  }

  removeImage(index: number) {
    this.imageUrls.splice(index, 1);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const formValue = this.form.value;
    const images = this.imageUrls.filter(url => (url || '').trim()).map((url, idx) => ({
      imageUrl: (url || '').trim(),
      displayOrder: idx,
    }));

    const payload = {
      ...formValue,
      images,
    };

    const isAdmin = this.auth.getRole() === 'ADMIN';
    const obs = this.isEdit
      ? (isAdmin ? this.api.put<Property>('/admin/properties/' + this.propertyId, payload) : this.api.put<Property>('/properties/' + this.propertyId, payload))
      : (isAdmin ? this.api.post<Property>('/admin/properties', payload) : this.api.post<Property>('/properties', payload));

    obs.subscribe({
      next: () => {
        this.toast.success(this.isEdit ? 'Property updated successfully' : 'Property listed successfully! It will be reviewed by admin.');
        this.router.navigate(['/my-properties']);
      },
      error: (e) => {
        this.toast.error(e.error?.message || 'Failed to save property');
        this.submitting = false;
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/my-properties']);
  }
}
