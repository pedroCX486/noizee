import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  soundList;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    document.body.style.backgroundColor = '#121212';
    document.body.style.color = 'darkgray';
    this.loadSounds();
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

  pauseAll() {
    this.soundList.forEach(element => {
      (document as any).getElementById(element.filename).pause();
      element.playing = false;
    });
  }

  getJSON(arg): Observable<any> {
    return this.http.get(arg);
  }

}
