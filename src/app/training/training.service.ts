import { Injectable } from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { IExercise } from "./exercise.model";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { UIServise } from "../shared/ui.service";

@Injectable({ providedIn: 'root' })
export class TrainingService {
  constructor(
    private _firestore: AngularFirestore,
    private _uiService: UIServise,
  ) {}

  public currentUserMail: string;
  public exerciseChanged = new Subject<IExercise>();
  public exercisesChanged = new Subject<IExercise[]>();
  public finishedExercisesChanged = new Subject<IExercise[]>();
  private _availableExercises: IExercise[] = [];
  private _runningExercise: IExercise;
  private _fbSub: Subscription[] = [];

  public fetchAvailableExercises() {
    this._uiService.loadingStateChange.next(true);
    this._fbSub.push(this._firestore.collection('availableExercises').snapshotChanges()
      .pipe(
        map(docArray => {
          return docArray.map((doc: {[key: string]: any}) => {
            return {
              id: doc.payload.doc.id,
              ...doc.payload.doc.data(),
            };
          });
        })
      ).subscribe(
        (exercises: IExercise[]) => {
          this._uiService.loadingStateChange.next(false);
          this._availableExercises = exercises;
          this.exercisesChanged.next([...this._availableExercises]);
        },
        error => {
          this._uiService.loadingStateChange.next(false);
          this._uiService.showSnackbar('Fetching exercises failed, please try again later', null, 3000);
          this.exercisesChanged.next(null);
        }
      )
    )
  }

  get availableExercises() {
    return this._availableExercises.slice();
  }

  public startExercise(selectedId: string) {
    this._runningExercise = this._availableExercises.find(ex => ex.id === selectedId);
    this.exerciseChanged.next({...this._runningExercise});
  }

  public completeExercise(userMail) {
    this._addDataToDatabase({
      ...this._runningExercise,
      date: new Date(),
      state: 'completed',
      user: userMail,
    }, userMail);
    this._runningExercise = null;
    this.exerciseChanged.next(null);
  }

  public cancelExercise(progress: number, userMail) {
    this._addDataToDatabase({
      ...this._runningExercise,
      duration: this._runningExercise.duration * (progress / 100),
      calories: this._runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled',
      user: userMail,
    }, userMail);
    this._runningExercise = null;
    this.exerciseChanged.next(null);
  }

  get runningExercise() {
    return { ...this._runningExercise };
  }

  public fatchFinishedExercises(userMail: string) {
    this._fbSub.push((this._firestore.collection('users').doc(userMail).collection('finishedExercises')).valueChanges()
      .subscribe(
        (exercises: IExercise[]) => {
          this.finishedExercisesChanged.next(exercises);
        }
      )
    )
  }

  public cancelSubscription() {
    this._fbSub.forEach(sub => sub.unsubscribe());
  }

  private _addDataToDatabase(exercise: IExercise, userMail: string) {
    this._firestore.collection('users').doc(userMail).collection('finishedExercises').add(exercise);
  }

}
