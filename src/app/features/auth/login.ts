import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { NotificacionService } from '../../core/services/notificacion.service';

@Component({
  selector: 'sid-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly ruta = inject(ActivatedRoute);
  private readonly avisos = inject(NotificacionService);

  protected readonly appName = environment.appName;
  protected readonly institucion = environment.institucion;

  protected readonly enviando = signal(false);
  protected readonly mostrarPassword = signal(false);
  protected readonly errorLogin = signal<string | null>(null);

  protected readonly formulario = this.fb.nonNullable.group({
    usuario: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  protected alternarPassword(): void {
    this.mostrarPassword.update((visible) => !visible);
  }

  protected enviar(): void {
    if (this.formulario.invalid || this.enviando()) {
      this.formulario.markAllAsTouched();
      return;
    }

    const { usuario, password } = this.formulario.getRawValue();

    this.enviando.set(true);
    this.errorLogin.set(null);

    this.auth.login(usuario.trim(), password).subscribe({
      next: (respuesta) => {
        this.enviando.set(false);
        this.avisos.exito(`Bienvenido, ${respuesta.user.nombre ?? respuesta.user.rfc}.`);

        // Se respeta el destino solicitado antes de la autenticación.
        const destino = this.ruta.snapshot.queryParamMap.get('destino') ?? '/inicio';
        void this.router.navigateByUrl(destino);
      },
      error: (error: { error?: { message?: string } }) => {
        this.enviando.set(false);
        this.errorLogin.set(
          error.error?.message ?? 'No fue posible iniciar sesión. Verifica tus datos.',
        );
      },
    });
  }
}
