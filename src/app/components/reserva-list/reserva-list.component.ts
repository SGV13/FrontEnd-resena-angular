// src/app/components/reserva-list/reserva-list.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ReservaService } from '../../services/reserva.service';
import { ResenaService } from '../../services/resena.service';

// Modelo de Reserva (atributos mínimos que usas en la tabla)
export interface Reserva {
  codigoreserva: string;
  fechaReserva: string;
  fechaUsoCancha: string;
  horaInicio: string;
  horaFin: string;
  nombreCliente: string;
  nombreCancha: string;
  nombreEstado: string;
  tieneResena?: boolean;
}

// Importamos CommonModule para poder usar *ngIf, *ngFor en un componente standalone
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reserva-list',
  standalone: true,
  imports: [CommonModule], // Asegúrate de incluir CommonModule
  templateUrl: './reserva-list.component.html',
  styleUrls: ['./reserva-list.component.css']
})
export class ReservaListComponent implements OnInit {
  reservas: Reserva[] = [];
  errorMsg = '';
  // Aquí puedes fijar un cliente estático (o inyectar el ID real de la sesión)
  clienteId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

  constructor(
    private reservaService: ReservaService,
    private resenaService: ResenaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarReservas();
  }

  private cargarReservas(): void {
    this.reservaService.listarPorCliente(this.clienteId).subscribe({
    next: (data: Reserva[]) => {
      // ─── Normalizamos nombreEstado para que quede sin espacios y en MAYÚSCULAS ───
      data.forEach(r => {
        r.nombreEstado = (r.nombreEstado ?? '').trim().toUpperCase();
      });

      this.reservas = data;
      this.marcarReservasConResena();
    },
    error: (err) => {
      this.errorMsg = 'Error al obtener reservas: ' + (err.message || err.statusText);
    }
  });
  }

  private marcarReservasConResena(): void {
    if (!this.reservas || this.reservas.length === 0) {
      return;
    }

    // Para cada reserva, consultamos si hay reseñas
    const observables = this.reservas.map(reserva => {
      return this.resenaService.listarPorReserva(reserva.codigoreserva).pipe(
        // Si da 404 u otro error, devolvemos array vacío
        catchError(() => of([])),
        map((listaResenas: any[]) => ({
          codigoreserva: reserva.codigoreserva,
          existe: Array.isArray(listaResenas) && listaResenas.length > 0
        }))
      );
    });

    forkJoin(observables).subscribe({
      next: (resultados) => {
        resultados.forEach(res => {
          const idx = this.reservas.findIndex(r => r.codigoreserva === res.codigoreserva);
          if (idx >= 0) {
            this.reservas[idx].tieneResena = res.existe;
          }
        });
      },
      error: (err) => {
        console.error('Error verificando reseñas:', err);
      }
    });
  }

  escribirResena(reserva: Reserva): void {
    const estado = reserva.nombreEstado.trim().toUpperCase();
    if (estado !== 'FINALIZADA') {
      alert(
        `No puedes dejar reseña hasta que la reserva se finalice.\nEstado actual: ${reserva.nombreEstado}`
      );
      return;
    }
    if (reserva.tieneResena) {
      alert('Ya existe una reseña para esta reserva.');
      return;
    }
    // Navegamos al formulario
    this.router.navigate(['/reservas', reserva.codigoreserva, 'resenas', 'nueva']);
  }

  irACanchas(): void {
    // Ajusta esta ruta a la que corresponda para “vista de canchas”
    this.router.navigate(['/canchas']);
  }

  ordenarPorFecha(reservas: Reserva[]): Reserva[] {
    return reservas.slice().sort((a, b) => {
      const fa = new Date(a.fechaUsoCancha).getTime();
      const fb = new Date(b.fechaUsoCancha).getTime();
      return fa - fb;
    });
  }
}
