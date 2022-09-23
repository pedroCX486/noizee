import { trigger, transition, style, animate } from '@angular/animations';
import { AfterViewInit, Component, Input } from '@angular/core';
import { Sound } from '@shared/sound.interface';

@Component({
  selector: 'app-soundbox',
  templateUrl: './soundbox.component.html',
  styleUrls: ['./soundbox.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(300, style({ opacity: 1 }))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(300, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class SoundboxComponent implements AfterViewInit {

  @Input() sound!: Sound;

  public soundVolume = 0.30;

  private audioElement!: HTMLAudioElement;
  private volumeControl!: HTMLInputElement;
  private audioCtx!: AudioContext;
  private track!: MediaElementAudioSourceNode;
  private gainNode!: GainNode;

  constructor() { }

  ngAfterViewInit() {
    this.audioElement = (document.getElementById(this.sound.filename) as HTMLAudioElement);
    this.volumeControl = (document.getElementById(this.sound.filename + "-volume") as HTMLInputElement)
  }

  audioControls(sound: Sound): void {
    if (!this.track) {
      this.audioCtx = new AudioContext();
      this.track = this.audioCtx.createMediaElementSource(this.audioElement);
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.value = this.soundVolume;
      this.track.connect(this.gainNode).connect(this.audioCtx.destination);
      this.audioCtx.resume();
    }

    if (this.audioElement.paused) {
      this.volumeControls();
      sound.playing = true;
      this.audioElement.play();
    } else {
      sound.playing = false;
      this.audioElement.pause();
    }
  }

  volumeControls(): void {
    this.volumeControl.addEventListener('input', (e) => {
      if (this.gainNode) {
        this.gainNode.gain.value = Number((e.target as HTMLInputElement).value);
      }
    }, false);
  }

}
