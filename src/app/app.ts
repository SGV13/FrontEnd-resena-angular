// src/app/app.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule], // ← aquí agregamos RouterOutlet y CommonModule
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {}
