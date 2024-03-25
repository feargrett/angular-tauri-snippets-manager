import { TuiRootModule, TuiDialogModule, TuiAlertModule, TUI_SANITIZER, TuiThemeNightModule, TuiSvgModule } from "@taiga-ui/core";
import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DomSanitizer } from "@angular/platform-browser";
import { ListComponent } from "./components/list/list.component";
import { EditorComponent } from "./components/editor/editor.component";
import { appWindow } from "@tauri-apps/api/window";
import { from } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TuiRootModule, TuiDialogModule, 
            TuiAlertModule, TuiThemeNightModule, ListComponent,
            EditorComponent, TuiSvgModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [{ provide: TUI_SANITIZER, useValue: DomSanitizer }],
})
export class AppComponent {

  isMaximized = signal(false);

  readonly #onResize$ = from(
    appWindow.onResized(async () => {
      const isMaximized = await appWindow.isMaximized();
      this.isMaximized.set(isMaximized);
    })
  );

  constructor() {
    this.#onResize$.pipe(takeUntilDestroyed()).subscribe();
    effect(() => {
      this.isMaximized() ? appWindow.maximize() : appWindow.unmaximize();
    });
  }
  
  minimize() {
    appWindow.minimize();
  }

  toggleSize() {
    this.isMaximized.update(isMaximized => !isMaximized);
  }

  close() {
    appWindow.close();
  }
}