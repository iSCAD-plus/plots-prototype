import * as S from 'sanctuary';
import * as R from 'ramda';
import gql from 'graphql-tag';
import { Component, OnInit, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';
import getShaper from '../shapers';

const presentData = S.pipe([
  R.map(R.omit(['__typename'])),
  x => JSON.stringify(x, null, 2),
]);

interface QueryResponse {
  decisionQuery: object[]
  loading: boolean
}

interface Axis {
  x: string
  y: string
  seriesKey: string
}

@Component({
  selector: 'plot',
  template: `
  <h3>{{title}}</h3>
  <form>
    <input
      type="radio"
      name="chartType"
      [(ngModel)]="plotType"
      (click)="setPlotType('pieChart')"
      value="pieChart"
    >Pie Chart |
    <input
      type="radio"
      name="chartType"
      [(ngModel)]="plotType"
      (click)="setPlotType('discreteBarChart')"
      value="discreteBarChart"
    > Bar Chart
    </form>
    <nvd3
      (click)="toggleDisplayJsonVisibility()"
      *ngIf="chartData"
      [options]="options"
      [data]="chartData">
    </nvd3>
    <pre [hidden]="!showJson">{{displayJson}}<pre>
  `,
})
export class PlotComponent implements OnInit {
  private showJson: boolean;
  private loading: boolean;
  private options: object;
  private rawData: object[];
  private chartData: object[];
  private displayJson: string;

  @Input() title: string;
  @Input() query: string;
  @Input() axisInfo: Axis;
  @Input() plotType: string;

  constructor(private apollo: Apollo) { }

  get gqlQuery() {
    return gql`${this.query}`;
  }

  public setPlotType(plotType: string) {
    this.plotType = plotType;
    const shaper = getShaper(plotType);
    this.options = shaper.options(this.axisInfo);
    this.chartData = shaper.shape(this.rawData);
  }

  toggleDisplayJsonVisibility() {
    this.showJson = !this.showJson;
  }

  ngOnInit() {
    const { x, y } = this.axisInfo;

    this.apollo
      .query<QueryResponse>({ query: this.gqlQuery })
      .subscribe(({ data }) => {
        const { seriesKey } = this.axisInfo;
        this.loading = data.loading;
        this.plotType = seriesKey ? 'multiBarChart' : 'discreteBarChart';
        this.rawData = data.decisionQuery;
        this.displayJson = presentData(data.decisionQuery);

        const shaper = getShaper(this.plotType);
        this.options = shaper.options(this.axisInfo);
        this.chartData = shaper.shape(data.decisionQuery, seriesKey);
        if (seriesKey) console.log(this.chartData);
      });
  }
}
