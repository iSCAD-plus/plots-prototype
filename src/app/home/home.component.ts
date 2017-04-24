import * as R from 'ramda';
import gql from 'graphql-tag';
import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';

import mockData from './mockData';

function format(xs: object[]): any[] {
  return R.map(R.props(['year', 'count']), xs);
};

const decisionByYear = gql`
  query DecisionByYear {
    decisionQuery {
      year
      count
    }
  }
`;

interface QueryResponse {
  decisions
  loading
}

@Component({
  selector: 'app-home',
  styleUrls: ['./home.component.css'],
  template: `
    <h3>Decision By Year</h3>
    <app-barchart *ngIf="chartData" [data]="chartData"></app-barchart>
  `,
})
export class HomeComponent implements OnInit {
  loading: boolean;
  private chartData: Array<any>;

  constructor(private apollo: Apollo) {
    this.chartData = format(mockData);
  }

  ngOnInit() {
    // this.apollo.watchQuery<QueryResponse>({ query: decisionByYear })
    //   .subscribe(({ data }) => {
    //     console.log(data);
    //     this.chartData = [];
    //     this.loading = data.loading;
    //     this.chartData = format(data.decisionQuery);
    //   });
  }
}
