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
  Editor = DecoupledEditor;
  textTitle;
  textContent;

  soundList;

  constructor(private http: HttpClient) {
    this.resetEditor();
  }

  ngOnInit() {
    document.body.style.backgroundColor = '#121212';
    this.loadSounds();

    this.loadEditorFromStorage();
    this.infiniteEditorSaving();
  }

  loadSounds() {
    this.getJSON('./assets/soundlist.json').toPromise().then((data) => {
      this.soundList = data;
    }).catch(error => {
      alert('Couldn\'t load sound list! (' + error.status + ' ' + error.statusText + ')');
    });
  }

  audioControls(sound) {
    const soundElement = (document as any).getElementById(sound);
    const volumeElement = (document as any).getElementById(sound + '-volume');
    const soundObj = this.soundList.find(element => element.filename === sound) as any;
    let playPromise;

    if (soundElement.paused) {
      this.volumeControls(sound, volumeElement.value);
      soundObj.playing = true;
      soundElement.play();
    } else {
      soundObj.playing = false;
      soundElement.pause();
    }
  }

  volumeControls(sound, volume) {
    (document as any).getElementById(sound).volume = Number(volume) / 100;
  }

  stopSounds() {
    this.soundList.forEach(element => {
      (document as any).getElementById(element.filename).pause();
      element.playing = false;
    });
  }

  // Editor related functions
  resetEditor() {
    this.textTitle = 'Your title';
    this.textContent = 'Your ideas.';
  }

  loadEditorFromStorage() {
    if (localStorage.getItem('textEditor') != null) {
      this.textTitle = JSON.parse(localStorage.getItem('textEditor')).title;
      this.textContent = JSON.parse(localStorage.getItem('textEditor')).content;
    }
  }

  infiniteEditorSaving() {
    setTimeout(() => {
      localStorage.setItem('textEditor', JSON.stringify({ title: this.textTitle, content: this.textContent }));
      this.infiniteEditorSaving();
    }, 500);
  }

  editorReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  print() {
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

  // Misc.
  getJSON(arg): Observable<any> {
    return this.http.get(arg);
  }
}
