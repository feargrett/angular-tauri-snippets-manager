import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule, NGX_MONACO_EDITOR_CONFIG } from 'ngx-monaco-editor-v2';
import { SnippetsStore } from '../../stores/snippets.store';
import { TuiMarkerIconModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [MonacoEditorModule, FormsModule, TuiMarkerIconModule],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
  providers: [{ provide: NGX_MONACO_EDITOR_CONFIG, useValue: () => null }]
})
export class EditorComponent {

  snippetStore = inject(SnippetsStore);

  editorOptions = {
    theme: 'vs-dark', 
    language: 'typescript',
    minimap: { enabled: false },
  };

  code = computed(() => this.snippetStore.selectedSnippet()?.content ?? '');
  name = computed(() => this.snippetStore.selectedSnippet()?.name ?? '');
}
