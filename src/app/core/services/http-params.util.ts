import { HttpParams } from '@angular/common/http';

/**
 * Convierte un objeto de filtros a HttpParams omitiendo los valores vacíos,
 * para que la URL solo lleve los filtros realmente aplicados.
 */
export function aHttpParams(filtro: object): HttpParams {
  let params = new HttpParams();

  for (const [clave, valor] of Object.entries(filtro)) {
    if (valor === undefined || valor === null || valor === '') {
      continue;
    }
    params = params.set(clave, String(valor));
  }

  return params;
}
