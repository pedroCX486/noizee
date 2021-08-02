import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ModalDirective } from 'ngx-bootstrap/modal';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { style, animate, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(600, style({ opacity: 1 }))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(600, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class MainComponent implements OnInit {

  @ViewChild('editorModal', { static: false }) editorModal: ModalDirective;
  public Editor = DecoupledEditor;
  public textTitle: string;
  public textContent: string;

  public soundList: Array<any>;

  constructor(private http: HttpClient) {
    this.resetEditor();
  }

  ngOnInit(): void {
    document.body.style.backgroundColor = '#121212';
    this.loadSounds();

    this.loadEditorFromStorage();
    this.infiniteEditorSaving();
  }

  // Audio related functions
  loadSounds(): void {
    this.getJSON('./assets/soundlist.json').toPromise().then((data) => {
      this.soundList = data;
    }).catch(error => {
      alert('Couldn\'t load sound list! (' + error.status + ' ' + error.statusText + ')');
    });
  }

  audioControls(sound: any): void {
    const soundElement = (document as any).getElementById(sound);
    const volumeElement = (document as any).getElementById(sound + '-volume');
    const soundObj = this.soundList.find(element => element.filename === sound) as any;

    if (soundElement.paused) {
      this.volumeControls(sound, volumeElement.value);
      soundObj.playing = true;
      soundElement.play();
    } else {
      soundObj.playing = false;
      soundElement.pause();
    }
  }

  volumeControls(sound: any, volume: any): void {
    (document as any).getElementById(sound).volume = Number(volume) / 100;
  }

  stopSounds(): void {
    this.soundList.forEach(element => {
      (document as any).getElementById(element.filename).pause();
      element.playing = false;
    });
  }

  // Editor related functions
  resetEditor(): void {
    this.textTitle = 'Your title';
    this.textContent = 'Your ideas.';
  }

  loadEditorFromStorage(): void {
    if (localStorage.getItem('textEditor') != null) {
      this.textTitle = JSON.parse(localStorage.getItem('textEditor')).title;
      this.textContent = JSON.parse(localStorage.getItem('textEditor')).content;
    }
  }

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
    const printWindow = window.open('', 'Noizee', 'height=720,width=1280');

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

  // Misc
  getJSON(url: string): Observable<any> {
    return this.http.get(url);
  }
}
