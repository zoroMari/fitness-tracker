import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TrainingService } from './training.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.sass']
})
export class TrainingComponent implements OnInit {
  public onGoingTraining = false;
  private _sub: Subscription;

  constructor(private _trainingService: TrainingService) { }

  ngOnInit(): void {
    this._sub = this._trainingService.exerciseChanged.subscribe(
      exercise => {
        if (exercise) {
          this.onGoingTraining = true;
        } else {
          this.onGoingTraining = false;
        }
      }
    )
  }



}
