import { Component, OnInit, computed, effect, signal, viewChildren } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BalloonComponent } from './components/balloon/balloon.component';
import { IBalloon } from './balloon.interface';
import { Balloon } from './balloon.class';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,BalloonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'BalloonPoppingGame';

  balloonOnScreen = 5
  balloons: IBalloon[] = [];
  score = 0
  missed = signal(0);
  maxMisses = 10

  balloonElements = viewChildren(BalloonComponent);
  createBalloonOnDemand = effect(()=>{
    if(!this.gameOver() && this.balloonElements().length< this.balloonOnScreen){
      this.balloons = [...this.balloons,new Balloon()]
    }
  })
  startGame(){
    this.missed.set(0);
    this.score = 0
    this.balloons = new Array(this.balloonOnScreen).fill(0).map(()=> new Balloon())
  }
  gameOver = computed(()=>{
    return this.missed() === this.maxMisses
  })
  balloonPopped(balloonId:String){
    this.score++;
    this.balloons = this.balloons.filter((x)=>x.id != balloonId) 
    this.balloons = [...this.balloons,new Balloon()]
  }
  bolloonMissed(balloonId:String){
    this.missed.update(val=>val+1)
    this.balloons = this.balloons.filter((x)=>x.id != balloonId);
    
  }



  ngOnInit(): void {
    this.startGame()
  }
}
