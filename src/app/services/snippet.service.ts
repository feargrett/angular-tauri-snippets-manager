import { Injectable } from "@angular/core";
import { writeTextFile, BaseDirectory, exists, createDir, readDir, readTextFile, removeFile } from '@tauri-apps/api/fs';
import { SnippetFile } from "../stores/snippets.store";

@Injectable({
  providedIn: 'root'
})
export class SnippetService {

  readonly #BASE_PATH = 'Snippets/';

  async loadSnippets() {
    await this.#createDirectory();
    const snippetFiles: SnippetFile[] = [];
    const files = await readDir(this.#BASE_PATH, { dir: BaseDirectory.Document });
    for (const file of files) {
      const content = '';
      const snippetFile: SnippetFile = { 
        name: file.name!, 
        content 
      };
      snippetFiles.push(snippetFile);
    }
    return snippetFiles;
  }

  async loadSnippetContent(name: string) {
    const path = this.#BASE_PATH + name;
    const content = await readTextFile(
      path, 
      { dir: BaseDirectory.Document }
    );
    return content;
  }

  async saveSnippet(name: string) {
    await this.#createDirectory();
    const fileName = name + '.ts';
    const path = this.#BASE_PATH + fileName;
    const content = 
`//Path: ${path}
const NAME = '${name}';
const sayHello = (name) => 'Hello, ' + name + '!';
console.log(sayHello(NAME));`
    await writeTextFile(
      path, 
      content, 
      { dir: BaseDirectory.Document }
    );
    const snippetFile: SnippetFile = { name: fileName, content, selected: false };
    return snippetFile;
  }

  async saveSnippetContent(name: string, content: string) {
    const path = this.#BASE_PATH + name;
    await writeTextFile(
      path, 
      content, 
      { dir: BaseDirectory.Document }
    );
  }

  async removeSnippet(name: string) {
    const path = this.#BASE_PATH + name;
    await removeFile(
      path, 
      { dir: BaseDirectory.Document }
    );
  }

  async #createDirectory() {
    const existDirectory = await exists(this.#BASE_PATH, { dir: BaseDirectory.Document });
    if (!existDirectory) 
      await createDir(this.#BASE_PATH, { 
          dir: BaseDirectory.Document 
      });
  }
}