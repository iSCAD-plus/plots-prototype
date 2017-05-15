import gql from 'graphql-tag';
import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';

const getPlots = gql`
  query GetPlots {
    getPlots {
      name
      query
      axis {
        x,
        y,
        seriesKey
      }
    }
  }
`;

interface QueryResponse {
  getPlots: object[];
  loading: boolean;
}

@Component({
  selector: 'app-home',
  styleUrls: ['./home.component.css'],
  template: `
    <h3>Plots</h3>
    <ul>
      <div *ngFor="let plot of plots">
        <plot
          [title]="plot.name"
          [query]="plot.query"
          [axisInfo]="plot.axis">
        </plot>
      </div>
    </ul>
  `,
})
export class HomeComponent implements OnInit {
  loading: boolean;
  private plots: object[];

  constructor(private apollo: Apollo) {
    this.plots = [];
  }

  ngOnInit() {
    this.apollo.watchQuery<QueryResponse>({ query: getPlots })
      .subscribe(({ data }) => {
        this.loading = data.loading;
        this.plots = data.getPlots;
        console.log(this.plots);
      });
  }
}
