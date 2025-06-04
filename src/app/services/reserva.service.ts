// src/app/services/reserva.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Reserva } from '../models/reserva.model';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  // Ahora apuntamos directamente al recurso /clientes/{id}/reservas
  private baseUrl = 'http://localhost:8082/api/v1';

  constructor(private http: HttpClient) {}

  listarPorCliente(clienteId: string): Observable<Reserva[]> {
    // Ruta correcta según tu backend:
    const url = `${this.baseUrl}/clientes/${clienteId}/reservas`;
    return this.http.get<Reserva[]>(url).pipe(
      catchError(this.manejarError)
    );
  }

  private manejarError(error: HttpErrorResponse) {
    console.error('Error en ReservaService:', error);
    const msg = error.error
      ? error.error
      : 'Se ha presentado un problema tratando de llevar a cabo la operación deseada';
    return throwError(() => new Error(msg));
  }
}
