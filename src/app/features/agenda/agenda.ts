import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { EventoAgenda } from '../../core/models';
import { AgendaService } from '../../core/services/agenda.service';
import { Cargando } from '../../shared/components/cargando';
import { EmptyState } from '../../shared/components/empty-state';
import { PageHeader } from '../../shared/components/page-header';

interface Celda {
  fecha: Date;
  delMes: boolean;
  esHoy: boolean;
  eventos: EventoAgenda[];
}

/**
 * Calendario mensual de fechas límite. Reemplaza al calendario de la vista
 * `Agenda` sin depender de librerías externas.
 */
@Component({
  selector: 'sid-agenda',
  imports: [RouterLink, DatePipe, PageHeader, EmptyState, Cargando],
  templateUrl: './agenda.html',
  styleUrl: './agenda.scss',
})
export class Agenda implements OnInit {
  private readonly agenda = inject(AgendaService);

  protected readonly diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  protected readonly mesActual = signal(new Date());
  protected readonly eventos = signal<EventoAgenda[]>([]);
  protected readonly cargando = signal(true);
  protected readonly diaSeleccionado = signal<Celda | null>(null);

  protected readonly etiquetaMes = computed(() =>
    this.mesActual().toLocaleDateString('es-MX', { month: 'long', year: 'numeric' }),
  );

  /** Rejilla de 6 semanas que siempre empieza en lunes. */
  protected readonly celdas = computed<Celda[]>(() => {
    const base = this.mesActual();
    const primero = new Date(base.getFullYear(), base.getMonth(), 1);

    // getDay(): 0 = domingo; se desplaza para que la semana inicie en lunes.
    const desplazamiento = (primero.getDay() + 6) % 7;
    const inicio = new Date(primero);
    inicio.setDate(primero.getDate() - desplazamiento);

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    return Array.from({ length: 42 }, (_, i) => {
      const fecha = new Date(inicio);
      fecha.setDate(inicio.getDate() + i);

      return {
        fecha,
        delMes: fecha.getMonth() === base.getMonth(),
        esHoy: fecha.getTime() === hoy.getTime(),
        eventos: this.eventosDe(fecha),
      };
    });
  });

  ngOnInit(): void {
    this.cargarMes();
  }

  protected mesAnterior(): void {
    const base = this.mesActual();
    this.mesActual.set(new Date(base.getFullYear(), base.getMonth() - 1, 1));
    this.diaSeleccionado.set(null);
    this.cargarMes();
  }

  protected mesSiguiente(): void {
    const base = this.mesActual();
    this.mesActual.set(new Date(base.getFullYear(), base.getMonth() + 1, 1));
    this.diaSeleccionado.set(null);
    this.cargarMes();
  }

  protected irAHoy(): void {
    this.mesActual.set(new Date());
    this.diaSeleccionado.set(null);
    this.cargarMes();
  }

  protected seleccionar(celda: Celda): void {
    this.diaSeleccionado.set(celda.eventos.length ? celda : null);
  }

  private cargarMes(): void {
    this.cargando.set(true);

    const base = this.mesActual();
    // Se pide un margen de una semana a cada lado para cubrir la rejilla completa.
    const desde = new Date(base.getFullYear(), base.getMonth(), -7);
    const hasta = new Date(base.getFullYear(), base.getMonth() + 1, 7);

    this.agenda.eventos(this.aIso(desde), this.aIso(hasta)).subscribe({
      next: (eventos) => {
        this.eventos.set(eventos);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  private eventosDe(fecha: Date): EventoAgenda[] {
    const clave = this.aIso(fecha);
    return this.eventos().filter((evento) => evento.start?.slice(0, 10) === clave);
  }

  private aIso(fecha: Date): string {
    // Formato local, para no desfasar el día por la zona horaria.
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${fecha.getFullYear()}-${mes}-${dia}`;
  }
}
