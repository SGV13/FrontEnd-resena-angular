// src/app/components/cancha-list/cancha-list.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Importamos CommonModule para *ngFor y *ngIf (si más adelante lo usamos),
// e importamos FormsModule para [(ngModel)].
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cancha-list',
  standalone: true,
  imports: [CommonModule, FormsModule],  // ← aquí agregamos los módulos que usamos
  templateUrl: './cancha-list.component.html',
  styleUrls: ['./cancha-list.component.css']
})
export class CanchaListComponent {
  buscador: string = '';

  canchas = [
    { id: 'c1', nombre: 'Cancha 1', disponible: true },
    { id: 'c2', nombre: 'Cancha 2', disponible: false },
    { id: 'c3', nombre: 'Cancha 3', disponible: true },
  ];

  constructor(private router: Router) {}

  buscar() {
    alert(`Buscar cancha: ${this.buscador}`);
  }

  verReservas() {
    this.router.navigate(['/reservas']);
  }

  reservar(cancha: any) {
    if (!cancha.disponible) {
      alert(`La cancha "${cancha.nombre}" no está disponible.`);
      return;
    }
    alert(`Simulación: Reservar "${cancha.nombre}".`);
  }
}
