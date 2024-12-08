import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'http://localhost:5000';
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  registerProduct(product: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-product`, product);
  }

  getShops(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/shops`);
  }

  registerShop(shop: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-shop`, shop);
  }

  dashboard(): Observable<any> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(`${this.apiUrl}/dashboard`, { headers });
  }
  getProductos(): Observable<any[]> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any[]>(`${this.apiUrl}/productos`, { headers });
  }
  getTiendas(): Observable<any> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(`${this.apiUrl}/tiendas`, { headers });
  }
  getOrders(): Observable<any> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(`${this.apiUrl}/pedidos`, { headers });
  }
  getApiDocumentation(apiBase: string): Observable<any> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(`${apiBase}/swagger`, { headers });
  }
}
