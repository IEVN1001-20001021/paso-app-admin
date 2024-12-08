import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AdminService } from '../../admin.service';
import { Chart, registerables } from 'chart.js';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FilterProductsPipe } from '../../filter-products.pipe';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, FilterProductsPipe],
  templateUrl: './productos.component.html',
  styles: ``,
})
export class ProductosComponent implements OnInit {
  productos: any[] = [];
  originalProductos: any[] = []; // Guardar copia de productos originales
  isSalesView = false; // Alterna entre tabla y ventas
  filters = { nombre: '', precio: '', unidadMedida: 'u', fecha: '' };
  pedidosHoy = 0;
  pedidosSemana = 0;
  pedidosMes = 0;
  productosVendidosChart: any; // Gráfico de productos vendidos

  // Variables para ordenar precios y cantidades
  sortPriceIcon = 'fa-sort'; // Icono de precio
  sortQuantityIcon = 'fa-sort'; // Icono de cantidad
  sortPriceTiendaIcon = 'fa-sort'; // Icono de precio tienda
  showCalendar = false; // Controlar visibilidad del calendario

  constructor(private adminService: AdminService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadProductos();
  }

  ngAfterViewInit() {
    if (this.isSalesView) {
      this.createChart();
    }
  }
  

  loadProductos(): void {
    this.adminService.getProductos().subscribe(
      (data: any) => {
        this.productos = data.productos;
        this.originalProductos = [...data.productos]; // Guardar copia de productos originales
        this.pedidosHoy = data.pedidosHoy;
        this.pedidosSemana = data.pedidosSemana;
        this.pedidosMes = data.pedidosMes;

        // Crear el gráfico después de cargar los datos
        this.createChart();
      },
      (error) => {
        console.error('Error loading productos:', error);
      }
    );
  }

  filterProductos(producto: any): boolean {
    return (
      producto.nombre
        .toLowerCase()
        .includes(this.filters.nombre.toLowerCase()) &&
      (this.filters.precio
        ? producto.precio_publico <= this.filters.precio
        : true) &&
      (this.filters.unidadMedida
        ? producto.unidad_medida === this.filters.unidadMedida
        : true) &&
      (this.filters.fecha
        ? producto.fecha_creacion.includes(this.filters.fecha)
        : true)
    );
  }

  toggleView(): void {
    this.isSalesView = !this.isSalesView;
    if (this.isSalesView) {
      setTimeout(() => this.createChart(), 0);
    }
  }
  

  createChart(): void {
    const filteredProducts = this.productos.filter((p) => p.ventas > 0);
    const labels = filteredProducts.map((p) => p.nombre);
    const data = filteredProducts.map((p) => p.ventas);

    if (this.productosVendidosChart) {
      this.productosVendidosChart.destroy();
    }

    this.productosVendidosChart = new Chart('productosVendidosChart', {
      type: 'bar', // Cambiar a 'pie' si es gráfico de pastel
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Cantidad Vendida',
            data: data,
            backgroundColor: [
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 99, 132, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              'rgba(75, 192, 192, 0.5)',
              'rgba(153, 102, 255, 0.5)',
              'rgba(255, 159, 64, 0.5)',
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.label}: ${context.raw}`;
              },
            },
          },
        },
      },
    });
  }

  calculateProductSales(): { labels: string[]; data: number[] } {
    const productSales: { [key: number]: number } = {};
    this.productos.forEach((producto: any) => {
      productSales[producto.id] = producto.ventas || 0;
    });

    const labels: string[] = [];
    const data: number[] = [];
    this.productos.forEach((producto: any) => {
      if (productSales[producto.id]) {
        labels.push(producto.nombre);
        data.push(productSales[producto.id]);
      }
    });

    return { labels, data };
  }

  sortByPrice(): void {
    this.productos.sort((a, b) =>
      this.sortPriceIcon === 'fa-sort-up'
        ? a.precio_publico - b.precio_publico
        : b.precio_publico - a.precio_publico
    );
    this.sortPriceIcon =
      this.sortPriceIcon === 'fa-sort-up' ? 'fa-sort-down' : 'fa-sort-up';
  }

  sortByQuantity(): void {
    this.productos.sort((a, b) =>
      this.sortQuantityIcon === 'fa-sort-up'
        ? a.cantidad - b.cantidad
        : b.cantidad - a.cantidad
    );
    this.sortQuantityIcon =
      this.sortQuantityIcon === 'fa-sort-up' ? 'fa-sort-down' : 'fa-sort-up';
  }

  sortByPriceTienda(): void {
    this.productos.sort((a, b) =>
      this.sortPriceTiendaIcon === 'fa-sort-up'
        ? a.precio_tienda - b.precio_tienda
        : b.precio_tienda - a.precio_tienda
    );
    this.sortPriceTiendaIcon =
      this.sortPriceTiendaIcon === 'fa-sort-up' ? 'fa-sort-down' : 'fa-sort-up';
  }

  applyDateFilter(): void {
    console.log('Fecha seleccionada:', this.filters.fecha);
  }

  applyFilters(): void {
    this.productos = [...this.originalProductos].filter((producto) =>
      this.filterProductos(producto)
    );
  }
}
