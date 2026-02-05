import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

declare global {
  interface Window {
    google?: { maps: unknown };
    __googleMapsResolve?: () => void;
  }
}

@Injectable({ providedIn: 'root' })
export class GoogleMapsService {
  private loadPromise: Promise<void> | null = null;

  get apiKey(): string {
    return (environment as { googleMapsApiKey?: string }).googleMapsApiKey || '';
  }

  get isAvailable(): boolean {
    return !!this.apiKey && !!window.google?.maps;
  }

  load(): Promise<void> {
    if (window.google?.maps) return Promise.resolve();
    if (this.loadPromise) return this.loadPromise;
    const key = this.apiKey;
    if (!key) {
      this.loadPromise = Promise.reject(new Error('Google Maps API key not set'));
      return this.loadPromise;
    }
    this.loadPromise = new Promise((resolve, reject) => {
      const cbName = '__ngGoogleMapsInit_' + Date.now();
      (window as unknown as Record<string, () => void>)[cbName] = () => {
        delete (window as unknown as Record<string, unknown>)[cbName];
        if (window.google?.maps) resolve();
        else reject(new Error('Google Maps failed to load'));
      };
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&callback=${cbName}`;
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        delete (window as unknown as Record<string, unknown>)[cbName];
        reject(new Error('Google Maps script failed to load'));
      };
      document.head.appendChild(script);
    });
    return this.loadPromise;
  }
}
