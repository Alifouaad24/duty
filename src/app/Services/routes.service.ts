import { Injectable } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {

  constructor(private http: ApiService) {}

    loadRoutesFromApi(): Observable<any> {
    return this.http.getData('api/System');
  }
}
