import { Component } from '@angular/core';
import { AdminService } from '../../admin.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-shop',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-shop.component.html',
  styles: ``,
})
export class AddShopComponent {
  shop = {
    name: '',
    address: '',
    state: 'Guanajuato', // Estado predefinido
    city: '',
    schedule: '',
    phone: '',
    email: '',
    logo_url:
      'https://drive.google.com/uc?export=view&id=1w5xOSyc8jszURZC2--Fh7iEjtsvu795I', // URL estática por defecto
  };

  cities: string[] = [
    'León',
    'Guanajuato',
    'Irapuato',
    'Celaya',
    'San Miguel de Allende',
  ];

  constructor(private adminService: AdminService) {}

  // Método para enviar los datos del formulario
  onSubmit() {
    if (!this.shop.city) {
      alert('Por favor selecciona una ciudad.');
      return;
    }

    this.adminService.registerShop(this.shop).subscribe({
      next: (response) => {
        alert('Tienda registrada exitosamente');
        console.log('Respuesta del servidor:', response);
        // Reinicia el formulario después de enviarlo
        this.shop = {
          name: '',
          address: '',
          state: 'Guanajuato',
          city: '',
          schedule: '',
          phone: '',
          email: '',
          logo_url:
            'https://drive.google.com/uc?export=view&id=1w5xOSyc8jszURZC2--Fh7iEjtsvu795I', // Reinicia la URL estática
        };
      },
      error: (err) => {
        alert('Ocurrió un error al registrar la tienda');
        console.error('Error del servidor:', err);
      },
    });
  }
}
