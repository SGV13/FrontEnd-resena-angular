// src/app/components/resena-form/resena-form.component.ts

import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ResenaService } from '../../services/resena.service';

@Component({
  selector: 'app-resena-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './resena-form.component.html',
  styleUrls: ['./resena-form.component.css'],
})
export class ResenaFormComponent implements OnInit {
  resenaForm!: FormGroup;
  reservaId!: string;
  errorMsg = '';
  successMsg = '';

  // Para el sistema de estrellas:
  hoverRating = 0; // índice de estrella sobre la que estamos haciendo hover

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private resenaService: ResenaService
  ) {}

  ngOnInit(): void {
    // Extraer el reservaId de la ruta
    this.reservaId = this.route.snapshot.paramMap.get('reservaId')!;
    this.crearFormulario();
  }

  private crearFormulario(): void {
    this.resenaForm = this.fb.group({
      calificacion: [
        null,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(5),
          Validators.pattern('^[0-9]+$'),
        ],
      ],
      comentario: [
        '',
        [Validators.required, Validators.minLength(20), Validators.maxLength(500)],
      ],
    });
  }

  /**
   * Acceso rápido a los controles del formulario
   */
  get f() {
    return this.resenaForm.controls as { [key: string]: any };
  }

  /**
   * Se dispara al pasar el ratón por encima de una estrella (1 a 5)
   */
  onStarHover(index: number): void {
    this.hoverRating = index;
  }

  /**
   * Se dispara cuando el ratón sale de la zona de estrellas
   */
  resetHover(): void {
    this.hoverRating = 0;
  }

  /**
   * Se dispara al hacer clic en una estrella: se guarda el valor en el formControl 'calificacion'
   */
  setRating(index: number): void {
    this.resenaForm.get('calificacion')!.setValue(index);
  }

  /**
   * Envía el formulario al backend
   */
  onSubmit(): void {
    this.errorMsg = '';
    this.successMsg = '';

    if (this.resenaForm.invalid) {
      this.errorMsg = 'Por favor corrige los errores en el formulario.';
      return;
    }

    const payload = {
      calificacion: this.resenaForm.value.calificacion,
      comentario: this.resenaForm.value.comentario.trim(),
    };

    this.resenaService.crear(this.reservaId, payload).subscribe({
      next: () => {
        this.successMsg = 'Reseña registrada correctamente.';
        // Opcional: resetear el formulario
        this.resenaForm.reset();
        // Después de 2 segundos, redirigir a Mis Reservas
        setTimeout(() => {
          this.router.navigate(['/reservas']);
        }, 2000);
      },
      error: (err) => {
        this.errorMsg = err.message || 'Error al registrar reseña.';
      },
    });
  }

  /**
   * Cancela y vuelve a la lista de reservas
   */
  cancelar(): void {
    this.router.navigate(['/reservas']);
  }
}
