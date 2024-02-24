import { Component, ElementRef, EventEmitter, OnInit, Output, inject, input } from '@angular/core';
import { IBalloon } from '../../balloon.interface';
import { AnimationBuilder, style, animate, keyframes } from '@angular/animations';


@Component({
  selector: 'app-balloon',
  standalone: true,
  imports: [],
  templateUrl: './balloon.component.html',
  styleUrl: './balloon.component.scss'
})
export class BalloonComponent implements OnInit {
  balloon = input.required<IBalloon>();
  animationBuilder = inject(AnimationBuilder)
  elRef = inject(ElementRef);
  @Output() bolloonPopped = new EventEmitter<string>();
  @Output() bolloonMissed = new EventEmitter<string>();

  animateBalloon() {
    const buffer = 20;
    const maxWidth = window.innerWidth - this.elRef.nativeElement.firstChild.clientWidth - buffer
    const leftPosition = Math.floor(Math.random() * maxWidth)
    const minSpeed = 3;
    const speedVariation = 4
    const speed = minSpeed + Math.random() * speedVariation
    const flyAnimation = this.animationBuilder.build([
      style({
        translate: `${leftPosition}px 0`,
        position: 'fixed',
        left: 0,
        bottom: 0,
      }),
      animate(
        `${speed}s ease-in-out`,
        style({
          translate: `${leftPosition}px -100vh`
        })
      )
    ]);

    const player = flyAnimation.create(this.elRef.nativeElement.firstChild);
    player.play();
    player.onDone(() => {
      console.log('Animation Completed')
      this.bolloonMissed.emit(this.balloon().id)
    })
  }
  pop() {
    const popAnimation = this.animationBuilder.build([
      animate(
        '0.2s ease-out',
        keyframes([
          style({
            scale: '1.2',
            offset:'0.5'
          }),
          style({
            scale: '0.8',
            offset:'0.75'
          }),
        ])
      )
    ]);
    const player = popAnimation.create(this.elRef.nativeElement.firstChild)
    player.play();
    player.onDone(()=>{
      this.bolloonPopped.emit(this.balloon().id)
    })
  }
  ngOnInit(): void {
    this.animateBalloon()
  }
}
