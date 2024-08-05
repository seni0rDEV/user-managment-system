import { Routes } from '@angular/router';
import { EmployeeComponent } from './pages/employee/employee.component';
import { LoginComponent } from './pages/login/login.component';


// ================ Old code  ================= 
// export const routes: Routes = [
//    { path: '', component: LoginComponent },
  
//   { path: '', component: EmployeeComponent }
// ];


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'employee', component: EmployeeComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Default route
];