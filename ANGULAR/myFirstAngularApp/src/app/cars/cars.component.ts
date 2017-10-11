import { Component, OnInit } from '@angular/core';

import { Car } from "./car"

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css']
})
export class CarsComponent implements OnInit {
  name: string
  cars: Array<Car>
  constructor() { }

  ngOnInit() {
    this.name = "Rhett"
    this.cars= [
    {
      make: "Ford",
      model: "Fiesta",
      year: 2005,
      numbers: [1,2,3]
    },
    {
      make: "Nissan",
      model: "300zx",
      year: 1986,
      numbers: [5,6,7]
    }
    ]
  }

}
