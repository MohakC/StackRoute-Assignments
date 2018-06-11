import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';
import { DataService} from '../data.service';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})

export class DataComponent implements OnInit {
  public states = [];
  public num_killed = [];
  public data_file = {};
  public tally = {
    "Alabama" : 0,
    "Alaska" : 0,
    "Arizona" : 0,
    "Arkansas" : 0,
    "California" : 0,
    "Colorado" : 0,
    "Connecticut" : 0,
    "Delaware" : 0,
    "Florida" : 0,
    "Georgia" : 0,
    "Hawaii" : 0,
    "Idaho" : 0,
    "Illinois" : 0,
    "Indiana" : 0,
    "Iowa" : 0,
    "Kansas" : 0,
    "Kentucky" : 0,
    "Louisiana" : 0, 
    "Maine" : 0,
    "Maryland" : 0,
    "Massachusetts" : 0,
    "Michigan" : 0,
    "Minnesota" : 0,
    "Mississippi" : 0,
    "Missouri" : 0,
    "Montana" : 0,
    "Nebraska" : 0,
    "Nevada" : 0,
    "New Hampshire" : 0, 
    "New Jersey" : 0,
    "New Mexico" : 0,
    "New York" : 0,
    "North Carolina" : 0,
    "North Dakota" : 0,
    "Ohio" : 0,
    "Oklahoma" : 0,
    "Oregon" : 0,
    "Pennsylvania" : 0,
    "Rhode Island" : 0,
    "South Carolina" : 0,
    "South Dakota" : 0,
    "Tennessee" : 0,
    "Texas" : 0,
    "Utah" : 0,
    "Vermont" : 0,
    "Virginia" : 0, 
    "Washington" : 0,
    "West Virginia" : 0,
    "Wisconsin" : 0,
    "Wyoming" : 0,
    "District of Columbia" : 0
};

  constructor(private dataSource: DataService) { }

  ngOnInit() {
    this.getJSONData();
  }

  getJSONData() {
    this.dataSource.getData().subscribe((res) => {
      this.data_file = res;
      this.createTable();
    });
  }

  createTable() {
    let tempTally = this.tally;
    let tempStates = this.states;
    let tempKilled = this.num_killed;
    for (let attr in this.data_file) {
      let entry = this.data_file[attr];
      tempTally[entry.state] = Number(tempTally[entry.state]) + Number(entry.killed);
    }
    for(let attr in tempTally) {
      tempStates.push(`${attr} : ${tempTally[attr]} \n`); 
    }
  }
}