import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { NavigateComponent } from './components/navigate/navigate.component';
import { BlogComponent } from './components/blog/blog.component';
import { NgOptimizedImage } from '@angular/common'
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http'; // Correct import for HttpClientModule
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; 
import { MatCardModule } from '@angular/material/card';
import { BlogCreateComponent } from './components/blog-create/blog-create.component';
import { SettingsComponent } from './components/settings/settings.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SearchComponent } from './components/search/search.component'; // Import MatSelectModule
import { MatTableModule } from '@angular/material/table';
import { ChatComponent } from './components/chat/chat.component';

@NgModule({
  declarations: [
    AppComponent,
 NavigateComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    BlogComponent,
   BlogCreateComponent,
   SettingsComponent,
   SearchComponent,
   ChatComponent
 

  ],
  imports: [
    BrowserModule,
    MatTableModule,
    NgOptimizedImage,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    HttpClientModule, // Include HttpClientModule in the imports array
    FormsModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule // You might want to include this as well if you are using common directives
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
