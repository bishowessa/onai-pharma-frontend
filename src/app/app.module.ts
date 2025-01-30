import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component'; // Assuming this file exists
import { RouterModule } from '@angular/router'; // Import RouterModule
import { NavbarComponent } from './navbar/navbar.component'; // Import NavbarComponent
import { LoginComponent } from './login/login.component'; // Import LoginComponent
import { RegisterComponent } from './register/register.component'; // Import RegisterComponent
import { ProductsComponent } from './products/products.component'; // Import ProductsComponent
import { ProfileComponent } from './profile/profile.component'; // Import ProfileComponent
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngIf

@NgModule({
  declarations: [
    // AppComponent,
    // NavbarComponent,
    // LoginComponent,
    // RegisterComponent,
    // ProductsComponent,
    // ProfileComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([]), // Define routing here if necessary
    CommonModule // Add CommonModule for *ngIf and other structural directives
  ],
  providers: [],
//   bootstrap: [AppComponent]
})
export class AppModule { }
