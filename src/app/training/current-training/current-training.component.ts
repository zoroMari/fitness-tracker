import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TimeInterval } from 'rxjs/internal/operators/timeInterval';
import { TrainingService } from '../training.service';
import { StopTrainingComponent } from './stop-training.component';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.sass']
})
export class CurrentTrainingComponent implements OnInit {
  public progress = 0;
  public timer: number;

  constructor(
    private _dialog: MatDialog,
    private _trainingService: TrainingService,
  ) { }

  ngOnInit(): void {
    this.startOrResumeTimer();
  }

  startOrResumeTimer() {
    const step = this._trainingService.runningExercise.duration / 100 * 1000;

    this.timer = setInterval(() => {
      this.progress = this.progress + 1;
      if (this.progress >= 100) {
        clearInterval(this.timer);
        this._trainingService.completeExercise();
      }
    }, step)
  }

  handleStop() {
    clearInterval(this.timer);
    const dialogRef = this._dialog.open(StopTrainingComponent, {
      data: {
        progress: this.progress,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._trainingService.cancelExercise(this.progress);
      } else {
        this.startOrResumeTimer();
      }
    });
  }
}
