import { trigger, transition, style, animate } from '@angular/animations';
import { Component, Input } from '@angular/core';
import { Sound } from '../sound.interface';

@Component({
  selector: 'app-soundbox',
  templateUrl: './soundbox.component.html',
  styleUrls: ['./soundbox.component.scss'],
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
export class SoundboxComponent {

  @Input() sound!: Sound;

  constructor() { }

  audioControls(sound: Sound): void {
    const soundElement = (document.getElementById(sound.filename) as HTMLAudioElement);

    if (soundElement.paused) {
      this.volumeControls(sound);
      sound.playing = true;
      soundElement.play();
    } else {
      sound.playing = false;
      soundElement.pause();
    }
  }

  volumeControls(sound: Sound): void {
    (document.getElementById(sound.filename) as HTMLAudioElement).volume = Number((document.getElementById(sound.filename + '-volume') as HTMLInputElement).value);
  }

}
