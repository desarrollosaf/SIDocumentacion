import { Component, inject, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../core/services/auth.service';
import { ResumenOficios, ResumenSolicitudes } from '../core/models';

/** Barra superior: alternar menú, pendientes y cuenta del usuario. */
@Component({
  selector: 'sid-topbar',
  imports: [RouterLink],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class Topbar {
  private readonly auth = inject(AuthService);

  readonly resumenOficios = input<ResumenOficios | null>(null);
  readonly resumenSolicitudes = input<ResumenSolicitudes | null>(null);

  readonly alternarMenu = output<void>();

  protected readonly usuario = this.auth.usuario;
  protected readonly iniciales = this.auth.iniciales;

  protected readonly menuCuentaAbierto = signal(false);
  protected readonly panelAvisosAbierto = signal(false);

  protected totalPendientes(): number {
    return (
      (this.resumenOficios()?.entradaPendientes ?? 0) +
      (this.resumenSolicitudes()?.pendientes ?? 0)
    );
  }

  protected alternarCuenta(): void {
    this.menuCuentaAbierto.update((abierto) => !abierto);
    this.panelAvisosAbierto.set(false);
  }

  protected alternarAvisos(): void {
    this.panelAvisosAbierto.update((abierto) => !abierto);
    this.menuCuentaAbierto.set(false);
  }

  protected cerrarPaneles(): void {
    this.menuCuentaAbierto.set(false);
    this.panelAvisosAbierto.set(false);
  }

  protected cerrarSesion(): void {
    this.cerrarPaneles();
    this.auth.cerrarSesion();
  }

}
