import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl: string = "https://dutyapi.somee.com/";
  constructor(private http: HttpClient) { }

  getData(endPoint: string): Observable<any> {

    var data = this.http.get(`${this.baseUrl}${endPoint}`);
    return data;
  }


  postData(endPoint: string, dataToSend: any): Observable<any> {
    var data = this.http.post(`${this.baseUrl}${endPoint}`, dataToSend);
    return data;
  }

  putData(endPoint: string, dataToSend: any): Observable<any> {
    var deta = this.http.put(`${this.baseUrl}${endPoint}`, dataToSend);
    return deta;
  }

  deleteData(endPoint: string): Observable<any> {
    var deta = this.http.delete(`${this.baseUrl}${endPoint}`);
    return deta;
  }
}
