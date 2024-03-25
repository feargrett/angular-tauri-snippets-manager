import { computed, effect, inject } from "@angular/core";
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { SnippetService } from "../services/snippet.service";

export interface SnippetFile {
  name: string;
  content: string;
  selected?: boolean;
}

export type SnippetState = {
  snippetFiles: SnippetFile[];
  isLoading: boolean;
  filter: { query: string; order: 'asc' | 'desc' };
};

const initialState: SnippetState = {
  snippetFiles: [],
  isLoading: false,
  filter: { query: '', order: 'asc' },
};

export const SnippetsStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed(({ snippetFiles }) => ({
    selectedSnippet: computed(() => snippetFiles().find(snippet => snippet.selected)),
  })),
  
  withMethods((
    store, 
    snippetService = inject(SnippetService)
  ) => ({

    loadSnippets: async () => {
      patchState(store, { isLoading: true });
      const snippetFiles = await snippetService.loadSnippets();
      patchState(store, { snippetFiles, isLoading: false });
    },

    addSnippet: async (name: string) => {
      if (store.isLoading()) return;
      const existSnippet = store.snippetFiles().some(snippet => snippet.name === name + '.ts');
      if (existSnippet) return;
      const snippetFile: SnippetFile = await snippetService.saveSnippet(name);
      patchState(store, ({
        snippetFiles: [...store.snippetFiles(), snippetFile] 
      }));
    },

    setSelectedSnippet: async (name: string) => {
      if (store.isLoading()) return;
      patchState(store, { isLoading: true });
      const existSnippet = store.snippetFiles().some(snippet => snippet.name === name);
      if (!existSnippet) {
        patchState(store, { isLoading: false });
        return;
      }
      const content = await snippetService.loadSnippetContent(name);
      patchState(store, (state) => ({
        snippetFiles: state.snippetFiles.map(snippet => ({
          ...snippet,
          selected: snippet.name === name,
          content: snippet.name === name ? content : snippet.content
        })),
        isLoading: false
      }));
    },

    updateSnippetContent: async (name: string, content: string) => {
      patchState(store, { isLoading: true });
      const existSnippet = store.snippetFiles().some(snippet => snippet.name === name);
      if (!existSnippet) {
        patchState(store, { isLoading: false });
        return;
      }
      await snippetService.saveSnippetContent(name, content);
      patchState(store, (state) => ({
        snippetFiles: state.snippetFiles.map(snippet => ({
          ...snippet,
          content: snippet.name === name ? content : snippet.content
        })),
        isLoading: false
      }));
    },

    removeSnippet: async (name: string) => {
      if (store.isLoading()) return;
      patchState(store, { isLoading: true });
      await snippetService.removeSnippet(name);
      patchState(store, (state) => ({
        snippetFiles: state.snippetFiles.filter(snippet => snippet.name !== name),
        isLoading: false
      }));
    },
    /* updateQuery: (query: string) => {
      patchState(store, (state) => ({
        filter: { ...state.filter, query }
      }));
    } */
  })),
  /* withHooks({
    onInit: (store) => {
      console.log('Store initialized', store);
      effect(() => console.log('Filter changed --> ', store.filter()));
    },
    onDestroy: (store) => console.log('Store destroyed', store)
  })  */
);