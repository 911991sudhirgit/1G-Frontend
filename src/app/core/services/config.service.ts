import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

export interface AppConfig {
  apiUrl: string;
}

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private _apiUrl = environment.apiUrl;

  get apiUrl(): string {
    return this._apiUrl;
  }

  /** Load runtime config (e.g. from /config.json on Heroku). Call before app uses API. */
  load(): Promise<void> {
    return fetch('/config.json')
      .then((res) => (res.ok ? res.json() : null))
      .then((config: AppConfig | null) => {
        if (config?.apiUrl) {
          this._apiUrl = config.apiUrl.replace(/\/$/, '');
        }
      })
      .catch(() => {
        // Keep default from environment
      });
  }
}
