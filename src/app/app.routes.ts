// src/app/app.routes.ts
import { Routes } from '@angular/router';

import { CanchaListComponent } from './components/cancha-list/cancha-list.component';
import { ReservaListComponent } from './components/reserva-list/reserva-list.component';
import { ResenaFormComponent } from './components/resena-form/resena-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'canchas', pathMatch: 'full' },
  { path: 'canchas', component: CanchaListComponent },
  { path: 'reservas', component: ReservaListComponent },
  { path: 'reservas/:reservaId/resenas/nueva', component: ResenaFormComponent },
  { path: '**', redirectTo: 'canchas' }
];