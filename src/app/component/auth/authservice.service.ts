import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  // Método para iniciar sesión
  login(userData: any): Observable<any> {
    // Comprobar si ya existe un token
    if (this.isAuthenticated()) {
      return new Observable((observer) => {
        observer.next({ message: 'Ya has iniciado sesión' });
        observer.complete();
      });
    }

    return this.http.post(`${this.apiUrl}/login`, userData).pipe(
      // Después de un inicio de sesión exitoso, guardar el token en la cookie
      map((response: any) => {
        if (response.token) {
          this.cookieService.set('authToken', response.token);
        }
        return response;
      })
    );
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return this.cookieService.check('authToken');
  }

  // Método para cerrar sesión
  logout(): void {
    this.cookieService.delete('authToken');
  }
}
