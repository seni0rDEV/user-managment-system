import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, IEmployee } from '../../models/Employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  apiurl = 'http://localhost:5513/api/users/employee';
  constructor(private http: HttpClient) {}

  getAllEmployee(): Observable<ApiResponse<IEmployee[]>> {
    return this.http.get<ApiResponse<IEmployee[]>>(`${this.apiurl}`);
    // console.log(response.data);
  }

  getEmployee(id: string): Observable<ApiResponse<IEmployee>> {
    return this.http.get<ApiResponse<IEmployee>>(`${this.apiurl}/${id}`);
  }

  createEmployee(employee: IEmployee): Observable<any> {
    return this.http.post(`${this.apiurl}`, employee);
  }

  updateEmployee(id: string, employee: IEmployee): Observable<any> {
    return this.http.put(`${this.apiurl}/${id}`, employee);
  }

  deleteEmployee(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiurl}/${id}`);
  }
}
