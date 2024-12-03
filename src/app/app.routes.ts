import { Routes } from '@angular/router';
import { EmployeeComponent } from './pages/admin/employee.component';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/shared/layout/layout.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
// import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { UserComponent } from './pages/user/user.component';
import { SuperadminComponent } from './pages/superadmin/superadmin.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import ResetpasswordComponent from './pages/resetpassword/resetpassword.component';
// import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
// import { superAdmin } from '../../api/src/users/UserController';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '',
         redirectTo: 'login',
          pathMatch: 'full'
      },
      
      {
        path: 'login',
        // redirectTo: '',
        component: LoginComponent,
        canActivate: [guestGuard],
      },
      // {
      //   path: 'register',
      //   component: RegisterComponent,
      //   canActivate: [guestGuard],
      // },

      {
        path: 'forgetpassword',
        component: ForgetPasswordComponent,
        canActivate: [guestGuard],
      },

      {
        path: 'resetpassword/:token',
        component: ResetpasswordComponent,
        canActivate: [guestGuard],
      },

      {
        path: 'user',
        data: { role: 'user' },
        component: UserComponent,
        canActivate: [authGuard],
      },
      {
        path: 'admin',
        component: EmployeeComponent,
        data: { role: 'admin' },
        canActivate: [authGuard],
        // children: [
        //   {
        //     path: 'register',
        //     component: RegisterComponent,
        //     canActivate: [authGuard],
        //     data: { role: 'admin' },
        //   },
        // ],
      },
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [authGuard],
        data: { role: 'admin' },
      },
      {
        path: 'superadmin',
        data: { role: 'superadmin' },
        component: SuperadminComponent,
        canActivate: [authGuard],
      },
    ],
  },
];
