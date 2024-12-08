import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterOrders',
})
export class FilterOrdersPipe implements PipeTransform {
  transform(pedidos: any[], filters: any): any[] {
    if (!pedidos || !filters) {
      return pedidos;
    }

    return pedidos.filter((pedido) => {
      const matchesEstado =
        !filters.estado ||
        pedido.estado.toLowerCase().includes(filters.estado.toLowerCase());
      const matchesUsuario =
        !filters.usuario_id || pedido.usuario_id == filters.usuario_id;
      const matchesTienda =
        !filters.tienda_id || pedido.tienda_id == filters.tienda_id;
      const matchesProducto =
        !filters.productoNombre ||
        pedido.detalles.productDetails.some((producto: any) =>
          producto.nombre
            .toLowerCase()
            .includes(filters.productoNombre.toLowerCase())
        );

      return (
        matchesEstado && matchesUsuario && matchesTienda && matchesProducto
      );
    });
  }
}
