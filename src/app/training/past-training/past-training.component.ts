import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IExercise } from '../exercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.sass']
})
export class PastTrainingComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private _trainingService: TrainingService) { }

  displayedColumns: string[] = ['date', 'name', 'duration', 'calories', 'state'];
  dataSource = new MatTableDataSource<IExercise>();

  ngOnInit(): void {
    this.dataSource.data = this._trainingService.pastExercises;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  handleFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

