import { Component, Input, Output, EventEmitter, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsService } from '../../core/services/google-maps.service';

declare const google: {
  maps: {
    Map: new (el: HTMLElement, opts: unknown) => {
      setZoom: (z: number) => void;
      getZoom: () => number;
      panTo: (c: { lat: number; lng: number }) => void;
      addListener: (event: string, fn: (e: { latLng?: { lat: () => number; lng: () => number } }) => void) => { remove: () => void };
    };
    Marker: new (opts: { position: { lat: number; lng: number }; map: unknown; title?: string }) => { setMap: (m: unknown) => void };
    event: { removeListener: (listener: { remove: () => void }) => void };
  };
};

@Component({
  selector: 'app-property-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="map-wrapper">
      <div *ngIf="!apiKey" class="map-placeholder">
        <p>Set <code>googleMapsApiKey</code> in environment to show the map.</p>
      </div>
      <div *ngIf="apiKey && loadError" class="map-placeholder map-error">
        <p>{{ loadError }}</p>
      </div>
      <div class="map-container" *ngIf="apiKey && !loadError"></div>
    </div>
  `,
  styles: [`
    .map-wrapper { position: relative; width: 100%; min-height: 300px; }
    .map-container { width: 100%; height: 300px; }
    .map-placeholder {
      width: 100%;
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg);
      border: 2px dashed var(--border);
      border-radius: var(--radius);
      color: var(--text-muted);
      font-size: 0.9375rem;
    }
    .map-placeholder code { background: var(--surface); padding: 0.2rem 0.4rem; border-radius: 4px; }
    .map-error { border-color: var(--danger); color: var(--danger); }
  `],
})
export class PropertyMapComponent implements AfterViewInit, OnDestroy {
  @Input() latitude: number | null = null;
  @Input() longitude: number | null = null;
  @Input() mode: 'view' | 'pick' = 'view';
  @Output() locationChange = new EventEmitter<{ lat: number; lng: number }>();

  loadError = '';
  private map: InstanceType<typeof google.maps.Map> | null = null;
  private marker: InstanceType<typeof google.maps.Marker> | null = null;
  private clickListener: { remove: () => void } | null = null;

  constructor(
    private maps: GoogleMapsService,
    private cdr: ChangeDetectorRef,
  ) {}

  get apiKey(): string {
    return this.maps.apiKey;
  }

  ngAfterViewInit(): void {
    if (!this.apiKey) {
      this.cdr.detectChanges();
      return;
    }
    this.maps.load().then(() => this.initMap()).catch((err: Error) => {
      this.loadError = err?.message || 'Failed to load map';
      this.cdr.detectChanges();
    });
  }

  private initMap(): void {
    const center = this.latitude != null && this.longitude != null
      ? { lat: this.latitude, lng: this.longitude }
      : { lat: 20.5937, lng: 78.9629 };
    const mapEl = document.querySelector('.map-container');
    if (!mapEl) return;
    this.map = new google.maps.Map(mapEl as HTMLElement, {
      center,
      zoom: this.latitude != null && this.longitude != null ? 15 : 5,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
    });
    if (this.latitude != null && this.longitude != null) {
      this.placeMarker(this.latitude, this.longitude);
    }
    if (this.mode === 'pick') {
      this.clickListener = this.map.addListener('click', (e: { latLng?: { lat: () => number; lng: () => number } }) => {
        if (!e.latLng) return;
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        this.placeMarker(lat, lng);
        this.locationChange.emit({ lat, lng });
      });
    }
    this.cdr.detectChanges();
  }

  private placeMarker(lat: number, lng: number): void {
    if (!this.map) return;
    if (this.marker) this.marker.setMap(null);
    this.marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
      title: 'Property location',
    });
    this.map.panTo({ lat, lng });
    if (this.map.getZoom() < 14) this.map.setZoom(15);
  }

  ngOnDestroy(): void {
    if (this.clickListener) this.clickListener.remove();
    this.marker = null;
    this.map = null;
  }
}
