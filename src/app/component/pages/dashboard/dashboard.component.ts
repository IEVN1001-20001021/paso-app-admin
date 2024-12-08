import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: ``,
})
export class DashboardComponent implements OnInit {
  stats = {
    totalPedidos: 0,
    pedidosEnProceso: 0,
    pedidosCompletados: 0,
    totalUsuarios: 0,
    nuevosUsuarios: 0,
    pedidosPorTienda: [] as { nombre: string; num_pedidos: number }[],
    pedidosPorCiudad: [] as { ciudad: string; num_pedidos: number }[],
  };

  constructor(private adminService: AdminService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.adminService.dashboard().subscribe(
      (data) => {
        this.stats.totalPedidos = data.total_pedidos;
        this.stats.pedidosEnProceso = data.pedidos_en_proceso;
        this.stats.pedidosCompletados = data.pedidos_completados;
        this.stats.totalUsuarios = data.total_usuarios;
        this.stats.nuevosUsuarios = data.nuevos_usuarios;

        this.stats.pedidosPorTienda = data.pedidos_por_tienda;
        this.stats.pedidosPorCiudad = data.pedidos_por_ciudad;

        this.createCharts();
      },
      (error) => {
        console.error('Error loading dashboard data:', error);
      }
    );
  }

  createCharts(): void {
    const tiendaLabels = this.stats.pedidosPorTienda.map((t) => t.nombre);
    const tiendaData = this.stats.pedidosPorTienda.map((t) => t.num_pedidos);

    const ciudadLabels = this.stats.pedidosPorCiudad.map((c) => c.ciudad);
    const ciudadData = this.stats.pedidosPorCiudad.map((c) => c.num_pedidos);

    // Gráfico de pastel para Pedidos por Tienda
    new Chart('pedidosPorTiendaChart', {
      type: 'pie', // Cambio a pie para gráfico de pastel
      data: {
        labels: tiendaLabels,
        datasets: [
          {
            data: tiendaData,
            backgroundColor: [
              '#36A2EB',
              '#FF6384',
              '#FFCE56',
              '#4BC0C0',
              '#FF9F40',
            ], // Colores de cada sección
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `${context.label}: ${context.raw} pedidos`;
              },
            },
          },
        },
      },
    });

    // Gráfico de pastel para Pedidos por Ciudad
    new Chart('pedidosPorCiudadChart', {
      type: 'pie', // Cambio a pie para gráfico de pastel
      data: {
        labels: ciudadLabels,
        datasets: [
          {
            data: ciudadData,
            backgroundColor: [
              '#FFCD56',
              '#4BC0C0',
              '#FF9F40',
              '#FF6384',
              '#36A2EB',
            ], // Colores de cada sección
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `${context.label}: ${context.raw} pedidos`;
              },
            },
          },
        },
      },
    });
  }
}
