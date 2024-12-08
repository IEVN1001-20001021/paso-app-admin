import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterProducts',
})
export class FilterProductsPipe implements PipeTransform {
  transform(productos: any[], filters: any): any[] {
    if (!productos || !filters) {
      return productos;
    }
    return productos.filter((producto) => {
      return (
        producto.nombre.toLowerCase().includes(filters.nombre.toLowerCase()) &&
        (filters.precio ? producto.precio_publico <= filters.precio : true) &&
        (filters.unidadMedida
          ? producto.unidad_medida === filters.unidadMedida
          : true) &&
        (filters.fecha ? producto.fecha_creacion.includes(filters.fecha) : true)
      );
    });
  }
}
