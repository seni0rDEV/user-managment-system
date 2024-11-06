import { Component } from '@angular/core';
// import { LoginComponent } from '../../pages/login/login.component';
import { Router, RouterModule } from '@angular/router';
// import { TokenService } from '../../service/token.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
// import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  //
  
}
