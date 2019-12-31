import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './noizee/main/main.component';


const routes: Routes = [{ path: '**', loadChildren: './noizee/noizee.module#NoizeeModule' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
