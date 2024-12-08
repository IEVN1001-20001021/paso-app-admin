import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AdminService } from '../../admin.service';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterShopsPipe } from "../../filter-shops.pipe";

@Component({
  selector: 'app-tiendas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, FilterShopsPipe],
  templateUrl: './tiendas.component.html',
  styles: ``,
})
export class TiendasComponent implements OnInit, AfterViewInit {
  isSalesView = false;
  tiendas: any[] = [];
  filters = { nombre: '' };
  tiendaPedidosChart: any;
  tiendaIngresosChart: any;
  sortOrdersIcon = 'fa-sort';
  sortIncomeIcon = 'fa-sort';

  constructor(private adminService: AdminService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadTiendas();
  }

  ngAfterViewInit() {
    if (this.isSalesView) {
      this.createCharts();
    }
  }

  loadTiendas(): void {
    this.adminService.getTiendas().subscribe(
      (data: any) => {
        this.tiendas = data.tiendas;
        this.createCharts();
      },
      (error) => {
        console.error('Error loading tiendas:', error);
      }
    );
  }

  toggleView(): void {
    this.isSalesView = !this.isSalesView;
    if (this.isSalesView) {
      setTimeout(() => this.createCharts(), 0);
    }
  }

  createCharts(): void {
    const labels = this.tiendas.map((tienda) => tienda.nombre);
    const pedidosData = this.tiendas.map((tienda) => tienda.cantidadPedidos);
    const ingresosData = this.tiendas.map((tienda) =>
      parseFloat(tienda.totalIngresos)
    );

    if (this.tiendaPedidosChart) {
      this.tiendaPedidosChart.destroy();
    }

    if (this.tiendaIngresosChart) {
      this.tiendaIngresosChart.destroy();
    }

    this.tiendaPedidosChart = new Chart('tiendaPedidosChart', {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            data: pedidosData,
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
      },
    });

    this.tiendaIngresosChart = new Chart('tiendaIngresosChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Ingresos Totales',
            data: ingresosData,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  sortByOrders(): void {
    this.tiendas.sort((a, b) =>
      this.sortOrdersIcon === 'fa-sort-up'
        ? a.cantidadPedidos - b.cantidadPedidos
        : b.cantidadPedidos - a.cantidadPedidos
    );
    this.sortOrdersIcon =
      this.sortOrdersIcon === 'fa-sort-up' ? 'fa-sort-down' : 'fa-sort-up';
  }

  sortByIncome(): void {
    this.tiendas.sort((a, b) =>
      this.sortIncomeIcon === 'fa-sort-up'
        ? parseFloat(a.totalIngresos) - parseFloat(b.totalIngresos)
        : parseFloat(b.totalIngresos) - parseFloat(a.totalIngresos)
    );
    this.sortIncomeIcon =
      this.sortIncomeIcon === 'fa-sort-up' ? 'fa-sort-down' : 'fa-sort-up';
  }

  applyFilters(): void {
    this.tiendas = [...this.tiendas].filter((tienda) =>
      tienda.nombre.toLowerCase().includes(this.filters.nombre.toLowerCase())
    );
  }
}
