import { Component } from '@angular/core';
import { AuthService } from '../authservice.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule]
})
export class LoginComponent {
  usuario: string = '';
  password: string = '';
  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    const userData = { usuario: this.usuario, password: this.password };
    this.authService.login(userData).subscribe(
      (response) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['pages/dashboard']);
      },
      (error) => {
        alert('Credenciales inválidas');
      }
    );
  }
}
