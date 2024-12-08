import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../admin.service';
import { forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Chart } from 'chart.js';
import { CommonModule } from '@angular/common';
import { FilterOrdersPipe } from '../../filter-orders.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './pedidos.component.html',
})
export class PedidosComponent implements OnInit {
  pedidos: any[] = [];
  stats: any[] = [];
  productos: any[] = [];
  filters: any = {
    estado: '',
    usuario_id: null,
    tienda_id: null,
    productoNombre: '',
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.cargarDashboard();
    this.cargarPedidos();
  }

  cargarDashboard(): void {
    this.adminService.dashboard().subscribe((data: any) => {
      this.stats = [
        { label: 'Total de Pedidos', value: data.total_pedidos },
        { label: 'Pedidos en Proceso', value: data.pedidos_en_proceso },
        { label: 'Pedidos Completados', value: data.pedidos_completados },
        { label: 'Usuarios Activos', value: data.total_usuarios },
        { label: 'Nuevos Usuarios', value: data.nuevos_usuarios },
      ];

      this.crearGrafica(
        'pedidosPorTiendaChart',
        data.pedidos_por_tienda,
        'nombre',
        'num_pedidos'
      );
      this.crearGrafica(
        'pedidosPorCiudadChart',
        data.pedidos_por_ciudad,
        'ciudad',
        'num_pedidos'
      );
    });
  }

  cargarPedidos(): void {
    this.adminService.getOrders().subscribe(
      (pedidos: any[]) => {
        this.pedidos = pedidos; // Asigna los pedidos directamente
        console.log('Pedidos cargados:', this.pedidos); // Verifica que los datos llegan
      },
      (error) => console.error('Error al cargar pedidos:', error)
    );
  }

  obtenerDetallesProductos(detalles: any) {
    const productosIds = detalles.productIds.map((item: any) => item.productId);
    return this.adminService
      .getProductos()
      .pipe(
        map((productos: any[]) =>
          productos.filter((producto) => productosIds.includes(producto.id))
        )
      );
  }

  getCantidadProducto(productIds: any[], productId: number): number {
    if (!productIds || !productId) {
      return 0;
    }
    const producto = productIds.find((p) => p.productId === productId);
    return producto ? producto.quantity : 0;
  }

  crearGrafica(
    chartId: string,
    data: any[],
    labelKey: string,
    valueKey: string
  ): void {
    new Chart(chartId, {
      type: 'bar',
      data: {
        labels: data.map((item) => item[labelKey]),
        datasets: [
          {
            label: 'Cantidad',
            data: data.map((item) => item[valueKey]),
            backgroundColor: '#4f46e5',
          },
        ],
      },
    });
  }
}
