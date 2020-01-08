import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EnvironmentService, IdentityService } from '@tenlastic/ng-authentication';
import { ElectronService } from '@tenlastic/ng-electron';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  constructor(
    public electronService: ElectronService,
    public environmentService: EnvironmentService,
    public identityService: IdentityService,
    public router: Router,
  ) {}

  public close() {
    const window = this.electronService.remote.getCurrentWindow();
    window.close();
  }

  public maximize() {
    const window = this.electronService.remote.getCurrentWindow();
    if (!window.isMaximized()) {
      window.maximize();
    } else {
      window.unmaximize();
    }
  }

  public minimize() {
    const window = this.electronService.remote.getCurrentWindow();
    window.minimize();
  }
}
