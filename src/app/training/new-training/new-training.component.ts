import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UIServise } from 'src/app/shared/ui.service';
import { IExercise } from '../exercise.model';
import { TrainingService } from '../training.service';


@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.sass']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  public availableExercises: IExercise[];
  public isLoading = false;
  private _subExChange: Subscription;
  private _subLoading: Subscription;

  constructor(
    private _trainingService: TrainingService,
    private _uiService: UIServise,
  ) { }

  ngOnInit(): void {
    this._subLoading = this._uiService.loadingStateChange.subscribe(
      isLoading => this.isLoading = isLoading
    )

    this._subExChange = this._trainingService.exercisesChanged.subscribe(
      exercises => {
        this.availableExercises = exercises;
      }
    )
    this.fetchExercises();
  }

  handleStartTraining(form: NgForm) {
    this._trainingService.startExercise(form.value.exercise);
  }

  public fetchExercises() {
    this._trainingService.fetchAvailableExercises();
  }

  ngOnDestroy(): void {
      this._subExChange.unsubscribe();
      this._subLoading.unsubscribe();
  }
}
