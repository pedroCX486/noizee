import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-ckeditor-modal',
  templateUrl: './ckeditor-modal.component.html',
  styleUrls: ['./ckeditor-modal.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(400, style({ opacity: 1 }))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(400, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class CkeditorModalComponent implements OnInit {

  public Editor = DecoupledEditor;
  public textTitle!: string;
  public textContent!: string;

  @Output() closeModal = new EventEmitter<void>();

  private storageSubject: Subject<void> = new Subject();
  public textSaved = false;

  constructor() {
    this.resetEditor();
  }

  ngOnInit(): void {
    this.loadEditorFromStorage();
    this.initializeContinuousStorage();
  }

  initializeContinuousStorage(): void {
    this.storageSubject.pipe(debounceTime(1000)).subscribe(() => {
      localStorage.setItem('textEditor', JSON.stringify({ title: this.textTitle, content: this.textContent }));
      this.textSaved = true;

      setTimeout(() => {
        this.textSaved = false;
      }, 1000);
    });
  }

  resetEditor(): void {
    this.textTitle = 'Your title';
    this.textContent = 'Your ideas.';
  }

  closeEditorModal(): void {
    this.closeModal.emit();
  }

  loadEditorFromStorage(): void {
    if (localStorage.getItem('textEditor') != null) {
      this.textTitle = JSON.parse(localStorage.getItem('textEditor')!).title;
      this.textContent = JSON.parse(localStorage.getItem('textEditor')!).content;
    }
  }

  updateStorage(): void {
    this.storageSubject.next();
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
