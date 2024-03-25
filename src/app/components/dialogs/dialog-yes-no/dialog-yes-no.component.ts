import { Component, Inject } from '@angular/core';
import { TuiButtonModule, TuiDialogContext } from '@taiga-ui/core';
import {POLYMORPHEUS_CONTEXT} from '@tinkoff/ng-polymorpheus';

@Component({
  selector: 'app-dialog-yes-no',
  standalone: true,
  imports: [TuiButtonModule],
  templateUrl: './dialog-yes-no.component.html',
  styleUrl: './dialog-yes-no.component.css'
})
export class DialogYesNoComponent {
  constructor(
      @Inject(POLYMORPHEUS_CONTEXT)
      private readonly context: TuiDialogContext<boolean, string>,
  ) {}

  get message() {
    return this.context.data;
  }

  no() {
    this.context.completeWith(false);
  }

  yes() {
    this.context.completeWith(true);
  }
}
