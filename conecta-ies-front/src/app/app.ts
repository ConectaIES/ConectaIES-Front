import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './features/layout/components/header/header';
import { AccessibilityToolbarComponent } from './shared/components/accessibility-toolbar/accessibility-toolbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, AccessibilityToolbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('conecta-ies-front');
}
