import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Sound } from '@shared/sound.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public soundList!: Sound[];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadSounds();
  }

  public showEditorModal(): void {
    alert('The editor modal is deactivated for this version, due to Bootstrap dependency removal. It\'s being reworked and soon will be available!');
  }

  // Sounds related functions
  loadSounds(): void {
    this.getSoundList().subscribe({
      next: data => {
        this.soundList = data;
      },
      error: error => {
        alert('Couldn\'t load sound list! (' + error.status + ' ' + error.statusText + ')');
      }
    });
  }

  getSoundList(): Observable<any> {
    return this.http.get('./assets/soundlist.json');
  }

  muteAllSounds(): void {
    this.soundList.forEach(sound => {
      (document.getElementById(sound.filename) as HTMLAudioElement).pause();
      sound.playing = false;
    });
  }
}
