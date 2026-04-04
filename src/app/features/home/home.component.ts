import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Property } from '../../core/models/property.model';
import { PropertyCardComponent } from '../../shared/property-card/property-card.component';
import { SkeletonLoaderComponent } from '../../shared/skeleton-loader/skeleton-loader.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PropertyCardComponent, SkeletonLoaderComponent, CarouselModule],
  template: `
   <carousel>
  <slide>
    <a href="#" target="_blank" class="carouselimg"><img src="assets/images/carousel/1.jpg" alt="first slide" style="display: block; width: 100%; max-height:200px;"></a>
  </slide>
  <slide>
    <a href="#" target="_blank" class="carouselimg"><img src="assets/images/carousel/2.jpg" alt="second slide" style="display: block; width: 100%; max-height:200px;"></a>
  </slide>
  <slide>
    <a href="#" target="_blank" class="carouselimg"><img src="assets/images/carousel/3.jpg" alt="third slide" style="display: block; width: 100%; max-height:200px;"></a>
  </slide>
</carousel>
<br/>


 <div class="loancalcicon" id="loancalcid" onClick="showpopup1()">
	    <img src="assets/images/calcicon.jpg">
  </div>
   <div class="loancalcicon" id="wtsapshareid" onClick="wtsapsharehandle()" style="top:60%">
	    <img src="assets/images/whatsapicon.png">
  </div>
  <div class="popup" id="popupid1" >
	  <div class="closeicon popupody" id="closeiconid">
		<span class="" onClick="hidepopup1()">x</span>
		  </div>
		  <div class="formdata">
				  <label>Enter Amount:</label><br />
				  <input type="text" id="initamtid" name="name" size="12" maxlength="32" value="300000" /><br /><br />
				  <label>Rate of Intrest</label><br />
				  <input type="text" id="roiid" name="roi" size="4" value="12" />%<br /><br />
					<label>Enter Tenure in Years</label><br />
				  <input type="text" id="tenureid" name="tenure" size="4" maxlength="12" value="3"/><br /><br />
				  <input type="submit"  value="Calculate!" style="color:#000;" onClick="calcval()"/><br /><br />
				  <label>Final Amount will be</label><br />
				  <input type="text" name="finalamt" id="finalamtid" size="16" maxlength="12" disabled/><br />
		  </div>
	  </div>



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

     <div class="row nomargin">
  <div class="col-xs-12 col-sm-6  col-md-3 col-lg-3">
	<div class="servicecards text-center">
		<img src="assets/images/poplogo.png" class="img-fluid logoservice">
		<h5 style="font-weight:bold; margin:5px;">POP service</h5>
		<p> Modern POP (Plaster of Paris) designs blend architectural elegance with functional lighting to transform any ceiling into a masterpiece.
</p>
		<input type ="button" value="Get Quote" onClick="showpopup()">
	</div>
  </div>
  <div class="col-xs-12 col-sm-6  col-md-3 col-lg-3">
	<div class="servicecards text-center">
		<img src="assets/images/paintlogo.png" class="img-fluid logoservice">
		<h5 style="font-weight:bold; margin:5px;">Paint service</h5 >
		<p> The Professional Touch<br/>
Transforming spaces with a stroke of perfection. Quality finishes that stand the test of time.</p>
		<input type ="button" value="Get Quote" onClick="showpopup()">
	</div>
  </div>
  <div class="col-xs-12 col-sm-6  col-md-3 col-lg-3">
	<div class="servicecards text-center">
		<img src="assets/images/lightlogo.png" class="img-fluid logoservice">
		<h5 style="font-weight:bold; margin:5px;">Electrical service</h5>
		<p> Professional & warm
<br/>
We craft lighting solutions that transform ordinary spaces into extraordinary experiences.
From concept to installation, Lighting service brings brilliance to every corner.</p>
		<input type ="button" value="Get Quote" onClick="showpopup()">
	</div>
  </div>
  <div class="col-xs-12 col-sm-6  col-md-3 col-lg-3">
	<div class="servicecards text-center">
		<img src="assets/images/constructionlogo.png" class="img-fluid logoservice">
		<h5 style="font-weight:bold; margin:5px;">Construction & ReConstruction service</h5 >
		<p> Strong & reassuring
<br/>
Reconstruction service restores what matters most — your space, your comfort, your peace of mind.
From damage to done, we rebuild with precision, care, and craftsmanship you can trust.</p>
		<input type ="button" value="Get Quote" onClick="showpopup()">
	</div>
  </div>
  </div>
  <div class="row nomargin"> 
  <div class="col-xs-12 col-sm-6  col-md-3 col-lg-3">
	<div class="servicecards text-center">
		<img src="assets/images/doorlogo.png" class="img-fluid logoservice">
		<h5 style="font-weight:bold; margin:5px;">Door and Framing</h5 >
		<p> Bold & confident
<br/>
We deliver precision-built doors and framing solutions that define the character of every space.
Door and Framing service — where strength, style, and craftsmanship meet at every threshold.</p>
		<input type ="button" value="Get Quote" onClick="showpopup()">
	</div>
  </div>
  
  <div class="col-xs-12 col-sm-6  col-md-3 col-lg-3">
	<div class="servicecards text-center">
		<img src="assets/images/tileslogo.png" class="img-fluid logoservice">
		<h5 style="font-weight:bold; margin:5px;">Tiles service</h5 >
		<p> Elegant & aspirational
<br/>
Tiles service brings together exquisite design and superior quality to transform every surface into a statement.
From floors to walls, we lay the foundation of spaces that inspire and endure.</p>
		<input type ="button" value="Get Quote" onClick="showpopup()">
	</div>
  </div>
 
  <div class="col-xs-12 col-sm-6  col-md-3 col-lg-3">
	<div class="servicecards text-center">
		<img src="assets/images/hardwarelogo.png" class="img-fluid logoservice">
		<h5 style="font-weight:bold; margin:5px;">Hardware service</h5 >
		<p>  Strong & reliable
<br/>
Hardware service supplies and installs premium fittings, fixtures, and accessories that hold every space together.
From the smallest hinge to the grandest finish, we deliver quality you can see and feel.</p>
		<input type ="button" value="Get Quote" onClick="showpopup()">
	</div>
  </div>
  <div class="col-xs-12 col-sm-6  col-md-3 col-lg-3">
	<div class="servicecards text-center">
		<img src="assets/images/fabrication.png" class="img-fluid logoservice">
		<h5 style="font-weight:bold; margin:5px;">Fabrication service</h5 >
		<p>  Strong & industrial
<br/>
Fabrication service delivers precision-engineered metal and structural solutions built to the highest standards of quality and durability.
From concept to completion, we fabricate with skill, accuracy, and craftsmanship that stands the test of time.</p>
		<input type ="button" value="Get Quote" onClick="showpopup()">
	</div>
  </div>
  </div>
  <div class="row nomargin"> 
  <div class="col-xs-12 col-sm-6  col-md-3 col-lg-3">
	<div class="servicecards text-center">
		<img src="assets/images/furniturelogo.png" class="img-fluid logoservice">
		<h5 style="font-weight:bold; margin:5px;">Furniture service</h5 >
		<p> Furniture service creates beautifully crafted pieces that bring warmth, character, and purpose to every living space.
From custom designs to timeless classics, we build furniture that tells your story for generations to come.
</p>
		<input type ="button" value="Get Quote" onClick="showpopup()">
	</div>
  </div>

  </div>

  
  <div class="popup" id="popupid">
	  <div class="closeicon popupody" id="closeiconid1" onClick="hidepopup()">
		<span class="">x</span>
		  </div>
		  <div class="formdata">
				 <form action="/action_page.php">
						<div class="mb-3 mt-3">
						<label for="name" class="form-label">Your Name: </label>
						<input type="name" size="12" class="form-control" id="name" placeholder="Enter name" name="namename">
					  </div>
					 
					  <div class="mb-3 mt-3">
						<label for="email"  class="form-label">Email: </label>
						<input type="email" size="12" class="form-control" id="email" placeholder="Enter email" name="email">
					  </div>
					   
					  
					  <div class="mb-3 mt-3">
						<label for="number"  class="form-label">Your Mobile Number: </label>
						<input type="number" size="12" class="form-control" id="number" placeholder="Enter number" name="number">
					  </div>
					   

					  <label for="comment" class="form-label">Comments: </label>
						<textarea class="form-control" rows="5" id="comment" name="text"></textarea>
					  

					  <!-- <a href="https://wa.me/8585838365" class="whatsapp-button" target="_blank" rel="noopener noreferrer">
						  <i class="fa fa-whatsapp"></i>
						  <span>Enquiry on WhatsApp</span>
						</a> -->
						<br/>
						<button onclick="send_handle()" class="btn btn-success">Enquiry on WhatsApp</button>
					</form>
				
		  </div>
	  </div>
	  
	  
 

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
            <h5>Houses</h5>
            <p>Independent houses and villas</p>
          </a>
          <a routerLink="/search" [queryParams]="{propertyType: 'APARTMENT'}" class="category-card">
            <div class="category-icon">🏢</div>
            <h5>Apartments</h5>
            <p>Flats and apartments</p>
          </a>
          <a routerLink="/search" [queryParams]="{propertyType: 'LAND'}" class="category-card">
            <div class="category-icon">🌾</div>
            <h5>Land</h5>
            <p>Plots and land parcels</p>
          </a>
          <a routerLink="/search" [queryParams]="{propertyType: 'COMMERCIAL'}" class="category-card">
            <div class="category-icon">🏬</div>
            <h5>Commercial</h5>
            <p>Shops, offices, and more</p>
          </a>
        </div>
      </div>
    </section>


<div class="chart">
<img src="assets/images/chart.png" class="img-fluid">
</div>
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
      color: #000;
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
    .category-card h5 {
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
      .loancalcicon{
	      width: 50px;
        height: 50px;
        position: fixed;
        left: 0px;
        top: 50%;
        display: flex;
      cursor:pointer;
      z-index:99;
    }

.popup1{
	width :50%;
	height : 90%;
	background-color: rgba(73, 73, 77, 0.78);
	z-index:99;
	position: absolute;
	display:none;
}
.closeicon1{
	width: 50px;
    height: 50px;
    position: absolute;
    right: 0px;
    top: 10px;
    display: flex;
	cursor:pointer;
	z-index:999;
	color: #000;
	font-weight: bold;
	font-size:25pt;
}

.visibleok{
	display:block!important;
}


.popup{
	width : 50%;
	height : 100%;
	background-color: rgba(73, 73, 77, 0.88);
	z-index:9999;
	position: fixed;
	display:none;
	transform: translateX(50%);
	top: 0;
}
.closeicon{
	width: 50px;
    height: 50px;
    position: absolute;
    right: 0px;
    top: 10px;
    display: flex;
	cursor:pointer;
	z-index:999;
	color: #000;
	font-weight: bold;
	font-size:25pt;
}

.visibleok{
	display:block!important;
}

.hidepopup{
	display:none;	
}

.formdata{
	text-align: center;
	transform: translateY(5%);
  color: #000;
  margin: 0 auto;
  width: 60%;
  
}
.logoservice{
	width: 50px;
	height: 50px;
}



.form-label{
	color: #ffff;
}
.servicecards{
	margin: 15px;
    background-color: cadetblue;
	padding:10px;
  text-align: center;
}

.servicename{
	font-weight: bold !important;
}

.hidepopup{
	display:none;	
}
.chart{
text-align: center;
}
.chart img{
width : 80%;
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
      /* GLOBAL STYLES
-------------------------------------------------- */
/* Padding below the footer and lighter body text */

body {
  padding-bottom: 40px;
  color: #5a5a5a;
}


/* CUSTOMIZE THE NAVBAR
-------------------------------------------------- */

/* Special class on .container surrounding .navbar, used for positioning it into place. */
.navbar-wrapper {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 20;
}

/* Flip around the padding for proper display in narrow viewports */
.navbar-wrapper > .container {
  padding-right: 0;
  padding-left: 0;
}
.navbar-wrapper .navbar {
  padding-right: 15px;
  padding-left: 15px;
}
.navbar-wrapper .navbar .container {
  width: auto;
}


/* CUSTOMIZE THE CAROUSEL
-------------------------------------------------- */

/* Carousel base class */
.carousel {
  height: 500px;
  margin-bottom: 60px;
}
/* Since positioning the image, we need to help out the caption */
.carousel-caption {
  z-index: 10;
}

/* Declare heights because of positioning of img element */
.carousel .item {
  height: 500px;
  background-color: #777;
}
.carousel-inner > .item > img {
  position: absolute;
  top: 0;
  left: 0;
  min-width: 100%;
  height: 500px;
}


/* MARKETING CONTENT
-------------------------------------------------- */

/* Center align the text within the three columns below the carousel */
.marketing .col-lg-4 {
  margin-bottom: 20px;
  text-align: center;
}
.marketing h2 {
  font-weight: normal;
}
.marketing .col-lg-4 p {
  margin-right: 10px;
  margin-left: 10px;
}


/* Featurettes
------------------------- */

.featurette-divider {
  margin: 80px 0; /* Space out the Bootstrap <hr> more */
}

/* Thin out the marketing headings */
.featurette-heading {
  font-weight: 300;
  line-height: 1;
  letter-spacing: -1px;
}

.carouselimg img{
transition: transform .2s;
}

.carouselimg img:hover{
transform: scale(1.2); 
}

/* RESPONSIVE CSS
-------------------------------------------------- */

@media (min-width: 768px) {
  /* Navbar positioning foo */
  .navbar-wrapper {
    margin-top: 20px;
  }
  .navbar-wrapper .container {
    padding-right: 15px;
    padding-left: 15px;
  }
  .navbar-wrapper .navbar {
    padding-right: 0;
    padding-left: 0;
  }

  /* The navbar becomes detached from the top, so we round the corners */
  .navbar-wrapper .navbar {
    border-radius: 4px;
  }

  /* Bump up size of carousel content */
  .carousel-caption p {
    margin-bottom: 20px;
    font-size: 21px;
    line-height: 1.4;
  }

  .featurette-heading {
    font-size: 50px;
  }
}

@media (min-width: 992px) {
  .featurette-heading {
    margin-top: 120px;
  }
}
    @media (max-width: 768px) {

      .hero h1 { font-size: 2.5rem; }
      .hero-subtitle { font-size: 1.125rem; }
      .search-box { flex-direction: column; color: #000; }
      .section-header { flex-direction: column; align-items: flex-start; gap: 1rem; }

      .popup{
        width :100%;
        height : 100%;
        transform: translateX(0%);
      }	
    }
  `],
})
export class HomeComponent implements OnInit {
  featured: Property[] = [];
  loading = true;
  searchType = 'buy';
  searchQuery = '';


  constructor(private api: ApiService, private router: Router, private cdr: ChangeDetectorRef) {}

   slides: {image: string; text?: string}[] =  [
    {image: 'assets/images/nature/5.jpg'},
    {image: 'assets/images/nature/4.jpg'},
    {image: 'assets/images/nature/3.jpg'}
  ];
  showIndicator = true;
 
  switchIndicator(): void {
    this.showIndicator = !this.showIndicator;
  }

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
