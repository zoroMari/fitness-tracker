import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IExercise } from '../exercise.model';
import { TrainingService } from '../training.service';


@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.sass']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  public availableExercises: IExercise[];
  private _sub: Subscription;

  constructor(
    private _trainingService: TrainingService,
  ) { }

  ngOnInit(): void {
    this._sub = this._trainingService.exercisesChanged.subscribe(
      exercises => {
        this.availableExercises = exercises;
      }
    )
    this._trainingService.fetchAvailableExercises();
  }

  handleStartTraining(form: NgForm) {
    this._trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy(): void {
      this._sub.unsubscribe();
  }
}
