import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IExercise } from '../exercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.sass']
})
export class NewTrainingComponent implements OnInit {
  public availableExercises: IExercise[] = [];

  constructor(private _trainingService: TrainingService) { }

  ngOnInit(): void {
    this.availableExercises = this._trainingService.availableExercises;
  }

  handleStartTraining(form: NgForm) {
    this._trainingService.startExercise(form.value.exercise);
  }
}
