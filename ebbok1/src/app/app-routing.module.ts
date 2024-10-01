import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { BlogCreateComponent } from './components/blog-create/blog-create.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SearchComponent } from './components/search/search.component';
import { ChatComponent } from './components/chat/chat.component';
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirects empty path to home
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'createblogs', component: BlogCreateComponent },
  {path:'settings',component:SettingsComponent},
  {path:'search',component:SearchComponent},
 {path:'chat',component:ChatComponent}
  // Add other routes as necessary
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
