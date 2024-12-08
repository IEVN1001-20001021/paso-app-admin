import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ApiInfo {
  title: string;
  version: string;
  url: string;
  endpoints: any[];
}

@Component({
  selector: 'app-gestion-apis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-apis.component.html',
  styles: ``,
})
export class GestionApisComponent implements OnInit {
  apiUrl: string = '';
  apis: ApiInfo[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    const savedApis = localStorage.getItem('apis');
    if (savedApis) {
      this.apis = JSON.parse(savedApis);
    }
  }

  addApi() {
    this.adminService.getApiDocumentation(this.apiUrl).subscribe(
      (data: any) => {
        if (data.info) {
          const apiInfo: ApiInfo = {
            title: data.info.title,
            version: data.info.version,
            url: this.apiUrl,
            endpoints: this.extractEndpoints(data.paths),
          };

          this.apis.push(apiInfo);
          this.saveApisToLocalStorage();
        } else {
          alert('Información inasequible de la API');
        }
      },
      (error) => {
        console.error('Error fetching API info:', error);
        alert('Información inasequible de la API');
      }
    );
  }

  private extractEndpoints(paths: any): any[] {
    return Object.entries(paths).map(([path, methods]: any) => {
      const method = Object.keys(methods)[0];
      const details = methods[method];
      return {
        path,
        method: method.toUpperCase(),
        description: details.description,
      };
    });
  }

  private saveApisToLocalStorage() {
    localStorage.setItem('apis', JSON.stringify(this.apis));
  }
}
