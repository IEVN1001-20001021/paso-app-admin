import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterShops',
})
export class FilterShopsPipe implements PipeTransform {
  transform(tiendas: any[], filter: any): any[] {
    if (!tiendas || !filter) {
      return tiendas;
    }
    return tiendas.filter((tienda) => {
      return tienda.nombre.toLowerCase().includes(filter.nombre.toLowerCase());
    });
  }
}
