import { Component, OnInit } from '@angular/core';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'app-ckeditor-modal',
  templateUrl: './ckeditor-modal.component.html',
  styleUrls: ['./ckeditor-modal.component.scss']
})
export class CkeditorModalComponent implements OnInit {

  public Editor = DecoupledEditor;
  public textTitle!: string;
  public textContent!: string;

  constructor() {
    this.resetEditor();
  }

  ngOnInit(): void {
    this.loadEditorFromStorage();
    this.infiniteEditorSaving();
  }

  resetEditor(): void {
    this.textTitle = 'Your title';
    this.textContent = 'Your ideas.';
  }

  closeEditorModal(): void {
    console.log('Does nothing yet.');
  }

  loadEditorFromStorage(): void {
    if (localStorage.getItem('textEditor') != null) {
      this.textTitle = JSON.parse(localStorage.getItem('textEditor')!).title;
      this.textContent = JSON.parse(localStorage.getItem('textEditor')!).content;
    }
  }

  // TODO: Migrate this to a debounce
  infiniteEditorSaving(): void {
    setTimeout(() => {
      localStorage.setItem('textEditor', JSON.stringify({ title: this.textTitle, content: this.textContent }));
      this.infiniteEditorSaving();
    }, 500);
  }

  editorReady(editor: any): void {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  // Printing text to the browser print UI
  printText(): void {
    const printWindow: Window = window.open('', 'Noizee', 'height=720,width=1280')!;

    printWindow.document.write('<html><head><title>' + this.textTitle + '</title>');
    printWindow.document.write('</head><body >');
    printWindow.document.write('<h1>' + this.textTitle + '</h1>');
    printWindow.document.write(this.textContent);
    printWindow.document.write('</body></html>');

    printWindow.document.close();
    printWindow.focus();

    printWindow.print();
    printWindow.close();
  }
}
