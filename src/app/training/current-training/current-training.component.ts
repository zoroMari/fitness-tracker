import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TimeInterval } from 'rxjs/internal/operators/timeInterval';
import { StopTrainingComponent } from './stop-training.component';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.sass']
})
export class CurrentTrainingComponent implements OnInit {
  public progress = 0;
  public timer: number;
  @Output() onStopExercise = new EventEmitter<void>();

  constructor(private _dialog: MatDialog) { }

  ngOnInit(): void {
    this.startOrResumeTimer();
  }

  startOrResumeTimer() {
    this.timer = setInterval(() => {
      this.progress = this.progress + 5;
      if (this.progress >= 100) {
        clearInterval(this.timer);
      }
    }, 1000)
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
        this.onStopExercise.emit();
      } else {
        this.startOrResumeTimer();
      }
    });
  }
}
