import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateMapComponent } from './create-map/create-map.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'create-map', component: CreateMapComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
