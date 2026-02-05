import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-col">
            <div class="footer-logo">
              <span class="logo-icon">🏠</span>
              <strong>1Guntha</strong>
            </div>
            <p>Your trusted partner for buying, selling, and renting properties in India. Find your dream home today.</p>
            <div class="social-links">
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="Instagram">📷</a>
              <a href="#" aria-label="LinkedIn">💼</a>
            </div>
          </div>
          <div class="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a routerLink="/">Home</a></li>
              <li><a routerLink="/search">Search Properties</a></li>
              <li><a routerLink="/property/new">List Property</a></li>
              <li><a routerLink="/dashboard">Dashboard</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>For Buyers</h4>
            <ul>
              <li><a routerLink="/search" [queryParams]="{listingType: 'SALE'}">Buy Properties</a></li>
              <li><a routerLink="/search" [queryParams]="{propertyType: 'HOUSE'}">Houses</a></li>
              <li><a routerLink="/search" [queryParams]="{propertyType: 'APARTMENT'}">Apartments</a></li>
              <li><a routerLink="/search" [queryParams]="{propertyType: 'COMMERCIAL'}">Commercial</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>For Renters</h4>
            <ul>
              <li><a routerLink="/search" [queryParams]="{listingType: 'RENT'}">Rent Properties</a></li>
              <li><a routerLink="/search" [queryParams]="{listingType: 'RENT', propertyType: 'APARTMENT'}">Rent Apartments</a></li>
              <li><a routerLink="/search" [queryParams]="{listingType: 'RENT', propertyType: 'HOUSE'}">Rent Houses</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Support</h4>
            <ul>
              <li><a routerLink="/login">Login</a></li>
              <li><a routerLink="/signup">Sign Up</a></li>
              <li><a href="mailto:support@1guntha.com">Contact Us</a></li>
              <li><a href="#">Help Center</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; {{ year }} 1Guntha.com. All rights reserved.</p>
          <div class="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--text);
      color: #94a3b8;
      padding: 3rem 0 1.5rem;
      margin-top: 4rem;
    }
    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }
    .footer-col h4 {
      color: white;
      font-size: 1rem;
      margin-bottom: 1rem;
      font-weight: 600;
    }
    .footer-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      color: white;
      font-size: 1.25rem;
    }
    .logo-icon {
      font-size: 1.5rem;
    }
    .footer-col p {
      font-size: 0.875rem;
      line-height: 1.6;
      margin-bottom: 1rem;
    }
    .social-links {
      display: flex;
      gap: 0.75rem;
    }
    .social-links a {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.1);
      border-radius: var(--radius-sm);
      transition: var(--transition);
      font-size: 1.25rem;
    }
    .social-links a:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }
    .footer-col ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .footer-col ul li {
      margin-bottom: 0.5rem;
    }
    .footer-col ul li a {
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.875rem;
      transition: var(--transition);
    }
    .footer-col ul li a:hover {
      color: white;
    }
    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 0.875rem;
    }
    .footer-links {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      align-items: center;
    }
    .footer-links a {
      color: #94a3b8;
      text-decoration: none;
    }
    .footer-links a:hover {
      color: white;
    }
    @media (max-width: 1024px) {
      .footer-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 768px) {
      .footer-grid {
        grid-template-columns: 1fr;
      }
      .footer-bottom {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
    }
  `],
})
export class FooterComponent {
  year = new Date().getFullYear();
}
