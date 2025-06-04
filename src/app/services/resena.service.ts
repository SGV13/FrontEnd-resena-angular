// src/app/services/resena.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Resena } from '../models/resena.model';

@Injectable({
  providedIn: 'root'
})
export class ResenaService {
  // Este baseUrl debe apuntar a /api/v1/reservas
  private baseUrl = 'http://localhost:8082/api/v1/reservas';

  constructor(private http: HttpClient) {}

  /**
   * Crea una nueva reseña para la reserva dada.
   * POST /api/v1/reservas/{reservaId}/resenas
   */
  crear(reservaId: string, payload: { calificacion: number; comentario: string }): Observable<any> {
    const url = `${this.baseUrl}/${reservaId}/resenas`;
    return this.http.post(url, payload, { responseType: 'text' }).pipe(
      catchError(this.manejarError)
    );
  }

  /**
   * LISTA las reseñas asociadas a una reserva.
   * GET /api/v1/reservas/{reservaId}/resenas
   * Si ocurre error (p. ej. 404), devuelve un array vacío.
   */
  listarPorReserva(reservaId: string): Observable<Resena[]> {
    const url = `${this.baseUrl}/${reservaId}/resenas`;
    return this.http.get<Resena[]>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al listar reseñas de reserva:', error);
        // Devolvemos un array vacío para que el componente trate “sin reseñas”
        return of([] as Resena[]);
      })
    );
  }

  /**
   * Manejador de errores genérico para otras llamadas que no sean listarPorReserva
   */
  private manejarError(error: HttpErrorResponse) {
    console.error('Error en ResenaService:', error);
    const msg = error.error ? error.error : 'Error al comunicarse con el servidor';
    return throwError(() => new Error(msg));
  }
}
