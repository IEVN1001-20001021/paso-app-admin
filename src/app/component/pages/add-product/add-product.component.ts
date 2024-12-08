import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../admin.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-product.component.html',
  styles: ``,
})
export class AddProductComponent implements OnInit {
  product = {
    shop: '',
    name: '',
    description: '',
    quantity: 0,
    unit: '',
    storePrice: 0,
    publicPrice: 0, // Este campo es calculado automáticamente
    image: '',
  };

  shops: any[] = []; // Almacenará las tiendas

  defaultImageUrl =
    'https://drive.google.com/file/d/15xQAzNgRl84Jvnn-kR1_PcRooaJJCzCD/view'; // URL predeterminada de la imagen

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.getShops(); // Obtener tiendas al cargar el componente
    this.product.image = this.defaultImageUrl; // Establecemos la URL predeterminada en el campo de la imagen
  }

  // Obtener tiendas desde la base de datos
  getShops() {
    this.adminService.getShops().subscribe({
      next: (shops) => {
        this.shops = shops;
      },
      error: (err) => {
        console.error('Error al obtener las tiendas', err);
      },
    });
  }

  // Al enviar el formulario, calculamos el precio público (10% sobre el precio tienda)
  onSubmit() {
    // Calculamos el precio público
    this.product.publicPrice = this.product.storePrice * 1.1; // 10% más que el precio tienda
    console.log(this.product);
    this.adminService.registerProduct(this.product).subscribe({
      next: (response) => {
        alert('Producto registrado exitosamente');
        console.log(response);
      },
      error: (err) => {
        alert('Ocurrió un error al registrar el producto');
        console.error(err);
      },
    });
  }
}
