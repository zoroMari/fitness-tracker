import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { IExercise } from "./exercise.model";

@Injectable({ providedIn: 'root' })
export class TrainingService {
  public exerciseChanged = new Subject<IExercise>();

  private _exercises: IExercise[] = [];

  private _availableExercises: IExercise[] = [
    {
      id: 'crunches',
      name: 'Crunches',
      duration: 30,
      calories: 8,
    },
    {
      id: 'touch-toes',
      name: 'Touch Toes',
      duration: 180,
      calories: 15,
    },
    {
      id: 'side-lunges',
      name: 'Side Lunges',
      duration: 120,
      calories: 18,
    },
    {
      id: 'burpees',
      name: 'Burpees',
      duration: 60,
      calories: 8,
    },
  ];

  private _runningExercise: IExercise;

  get availableExercises() {
    return this._availableExercises.slice();
  }

  public startExercise(selectedId: string) {
    this._runningExercise = this._availableExercises.find(ex => ex.id === selectedId);
    this.exerciseChanged.next({...this._runningExercise});
  }

  public completeExercise() {
    this._exercises.push({
      ...this._runningExercise,
      date: new Date(),
      state: 'completed',
    });
    this._runningExercise = null;
    this.exerciseChanged.next(null);
  }

  public cancelExercise(progress: number) {
    this._exercises.push({
      ...this._runningExercise,
      duration: this._runningExercise.duration * (progress / 100),
      calories: this._runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled',
    });
    this._runningExercise = null;
    this.exerciseChanged.next(null);
  }

  get runningExercise() {
    return { ...this._runningExercise };
  }

  get pastExercises() {
    return this._exercises.slice();
  }

}
