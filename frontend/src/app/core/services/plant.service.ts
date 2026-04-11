import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse, Plant, PlantFilters } from '../types/models';

@Injectable({ providedIn: 'root' })
export class PlantService {
  private readonly http = inject(HttpClient);

  getPlants(filters: PlantFilters = {}) {
    return this.http
      .get<ApiResponse<PaginatedResponse<Plant>>>(`${environment.apiBaseUrl}/plants`, {
        params: this.buildParams(filters)
      })
      .pipe(map((response) => response.data));
  }

  getAdminPlants(filters: PlantFilters = {}) {
    return this.http
      .get<ApiResponse<PaginatedResponse<Plant>>>(`${environment.apiBaseUrl}/admin/plants`, {
        params: this.buildParams(filters)
      })
      .pipe(map((response) => response.data));
  }

  getPlantById(plantId: number) {
    return this.http
      .get<ApiResponse<Plant>>(`${environment.apiBaseUrl}/plants/${plantId}`)
      .pipe(map((response) => response.data));
  }

  createPlant(formData: FormData) {
    return this.http
      .post<ApiResponse<Plant>>(`${environment.apiBaseUrl}/plants`, formData)
      .pipe(map((response) => response.data));
  }

  updatePlant(plantId: number, formData: FormData) {
    return this.http
      .put<ApiResponse<Plant>>(`${environment.apiBaseUrl}/plants/${plantId}`, formData)
      .pipe(map((response) => response.data));
  }

  deletePlant(plantId: number) {
    return this.http
      .delete<ApiResponse<Plant>>(`${environment.apiBaseUrl}/plants/${plantId}`)
      .pipe(map((response) => response.data));
  }

  private buildParams(filters: PlantFilters) {
    let params = new HttpParams();

    for (const [key, value] of Object.entries(filters)) {
      if (value === undefined || value === null || value === '') {
        continue;
      }

      params = params.set(key, String(value));
    }

    return params;
  }
}
