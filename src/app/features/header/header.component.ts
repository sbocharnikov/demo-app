import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  isAuthenticated: Observable<boolean> = this.authService.isAuthenticated;

  constructor(private authService: AuthService) {
  }

  logout(): void {
    this.authService.logout();
  }
}
