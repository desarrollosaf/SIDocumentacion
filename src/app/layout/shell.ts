import { Component, OnInit, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { ResumenOficios, ResumenSolicitudes } from '../core/models';
import { MenuService } from '../core/services/menu.service';
import { OficiosService } from '../core/services/oficios.service';
import { SolicitudesService } from '../core/services/solicitudes.service';
import { Avisos } from '../shared/components/avisos';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

const CLAVE_COLAPSADO = 'sid.sidebar.colapsado';

/** Estructura de la aplicación autenticada: sidebar + topbar + contenido. */
@Component({
  selector: 'sid-shell',
  imports: [RouterOutlet, Sidebar, Topbar, Avisos],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell implements OnInit {
  private readonly menu = inject(MenuService);
  private readonly oficios = inject(OficiosService);
  private readonly solicitudes = inject(SolicitudesService);
  private readonly router = inject(Router);

  protected readonly colapsado = signal(localStorage.getItem(CLAVE_COLAPSADO) === '1');
  protected readonly abiertoMovil = signal(false);

  protected readonly resumenOficios = signal<ResumenOficios | null>(null);
  protected readonly resumenSolicitudes = signal<ResumenSolicitudes | null>(null);

  ngOnInit(): void {
    this.menu.cargar().subscribe();
    this.cargarResumenes();

    // Los contadores se refrescan en cada navegación para reflejar acciones
    // realizadas dentro de las bandejas.
    this.router.events
      .pipe(filter((evento) => evento instanceof NavigationEnd))
      .subscribe(() => {
        this.abiertoMovil.set(false);
        this.cargarResumenes();
      });
  }

  protected alternarMenu(): void {
    // En pantallas angostas el botón abre el panel deslizante; en escritorio
    // alterna entre el sidebar completo y el contraído.
    if (window.innerWidth < 992) {
      this.abiertoMovil.update((abierto) => !abierto);
      return;
    }

    this.colapsado.update((valor) => {
      localStorage.setItem(CLAVE_COLAPSADO, valor ? '0' : '1');
      return !valor;
    });
  }

  protected cerrarMovil(): void {
    this.abiertoMovil.set(false);
  }

  private cargarResumenes(): void {
    this.oficios.resumen().subscribe({
      next: (resumen) => this.resumenOficios.set(resumen),
      // Un fallo de contadores no debe interrumpir la navegación.
      error: () => this.resumenOficios.set(null),
    });

    this.solicitudes.resumen().subscribe({
      next: (resumen) => this.resumenSolicitudes.set(resumen),
      error: () => this.resumenSolicitudes.set(null),
    });
  }
}
