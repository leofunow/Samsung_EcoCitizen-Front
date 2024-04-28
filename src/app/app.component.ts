import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { AngularYandexMapsModule } from 'angular8-yandex-maps';
import { NzGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, NzGridModule, CommonModule, RouterOutlet, NzIconModule, NzLayoutModule, NzMenuModule, AngularYandexMapsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isCollapsed = false;
}
