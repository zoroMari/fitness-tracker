import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IExercise } from '../exercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.sass']
})
export class NewTrainingComponent implements OnInit {
  @Output() trainingStart = new EventEmitter<void>();
  public availableExercises: IExercise[] = [];

  constructor(private _trainingService: TrainingService) { }

  ngOnInit(): void {
    this.availableExercises = this._trainingService.availableExercises;
  }

  handleStartTraining() {
    this.trainingStart.emit();
  }
}
