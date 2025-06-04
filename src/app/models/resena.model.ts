// src/app/models/resena.model.ts
export interface Resena {
  id?: string;         // UUID de la reseña (no es obligatorio en el payload)
  // reservaId se usa en el servicio, no es necesario en la interfaz de forma obligatoria
  calificacion: number; 
  comentario: string;
  fecha?: string;
}
