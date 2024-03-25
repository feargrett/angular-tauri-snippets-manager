import { Component, DestroyRef, Injector, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiButtonModule, TuiDialogService, TuiScrollbarModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiElasticContainerModule, TuiInputModule } from "@taiga-ui/kit";
import { SnippetsStore } from '../../stores/snippets.store';
import {PolymorpheusComponent} from '@tinkoff/ng-polymorpheus';
import { DialogYesNoComponent } from '../dialogs/dialog-yes-no/dialog-yes-no.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [TuiInputModule, TuiButtonModule, ReactiveFormsModule,
            TuiTextfieldControllerModule, TuiElasticContainerModule,
            TuiScrollbarModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {

  readonly snippetStore = inject(SnippetsStore);

  readonly newSnippetForm = new FormGroup({
    name: new FormControl(''),
  });

  dialogs = inject(TuiDialogService);

  injector = inject(Injector);

  destroyRef = inject(DestroyRef);

  constructor() {
    this.snippetStore.loadSnippets();
  }

  async addSnippet() {
    if (!this.newSnippetForm.value.name) return;
    await this.snippetStore.addSnippet(this.newSnippetForm.value.name);
    this.newSnippetForm.reset();
  }

  async removeSnippet(name: string) {
    this.dialogs.open<boolean>(
      new PolymorpheusComponent(DialogYesNoComponent, this.injector),
      {
          data: 'Are you sure you want to delete this snippet?',
          dismissible: true,
          label: 'Delete',
          size: 's',
          closeable: false,
      },
    ).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap(isConfirmed => isConfirmed && this.snippetStore.removeSnippet(name))
    ).subscribe();
  }
}
