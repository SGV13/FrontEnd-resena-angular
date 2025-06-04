// src/app/models/reserva.model.ts
export interface Reserva {
  codigoreserva: string;             // UUID
  fechaReserva: string;   // "2025-07-12"
  fechaUsoCancha: string; // "2025-07-12"
  horaInicio: string;     // "18:30"
  horaFin: string;        // "20:30"
  nombreCliente: string;
  nombreCancha: string;
  nombreEstado: string;     // e.g. "PENDIENTE", "CONFIRMADA", "FINALIZADA"
  tieneResena?: boolean; 
}
