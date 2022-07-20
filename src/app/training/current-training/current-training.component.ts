import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TimeInterval } from 'rxjs/internal/operators/timeInterval';
import { AuthService } from 'src/app/auth/auth.service';
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
  public currentUserMail: string;

  constructor(
    private _dialog: MatDialog,
    private _trainingService: TrainingService,
    private _authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.startOrResumeTimer();
    this.currentUserMail = this._authService.activeUserEmail;
  }

  startOrResumeTimer() {
    const step = this._trainingService.runningExercise.duration / 100 * 1000;

    this.timer = setInterval(() => {
      this.progress = this.progress + 1;
      if (this.progress >= 100) {
        clearInterval(this.timer);
        this._trainingService.completeExercise(this.currentUserMail);
      }
    }, step)
  }

  handleStop() {
    console.log('this.currentUserMail >>>', this.currentUserMail);

    clearInterval(this.timer);
    const dialogRef = this._dialog.open(StopTrainingComponent, {
      data: {
        progress: this.progress,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._trainingService.cancelExercise(this.progress, this.currentUserMail);
      } else {
        this.startOrResumeTimer();
      }
    });
  }
}
