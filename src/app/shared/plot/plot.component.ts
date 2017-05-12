import * as S from 'sanctuary';
import * as R from 'ramda';
import gql from 'graphql-tag';
import { Component, OnInit, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';
import * as pieChart from '../shapers/pie-chart';
import * as discreteBarChart from '../shapers/discrete-bar-chart';

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
      (click)="toggleRawDataVisibility()"
      *ngIf="chartData"
      [options]="options"
      [data]="chartData">
    </nvd3>
    <pre [hidden]="!showRaw">{{rawData}}<pre>
  `,
})
export class PlotComponent implements OnInit {
  options: object;
  loading: boolean;
  private rawData: string;
  private preppedData: object;
  private shapers: any;
  private shaper: any;
  private chartData: object = [];
  private showRaw: boolean = false;

  @Input() title: String;
  @Input() query: String;
  @Input() axisInfo: Axis;
  @Input() plotType: string;

  constructor(private apollo: Apollo) {}

  get gqlQuery() {
    return gql`${this.query}`;
  }

  toggleRawDataVisibility() {
    this.showRaw = !this.showRaw;
  }

  ngOnInit() {
    const { x, y } = this.axisInfo;
    const plotType = this.plotType || 'discreteBarChart';
    this.shapers = {
      pieChart,
      discreteBarChart,
    };
    this.shaper = R.prop(plotType)(this.shapers);

    this.options = this.shaper.options({ x, y });

    this.apollo.watchQuery<QueryResponse>({ query: this.gqlQuery })
      .subscribe(({ data }) => {
        this.loading = data.loading;
        if (this.title === "Security Council sanctions-related decisions by type") {
          console.log(this.gqlQuery);
          console.log(this.title);
          for (let x in data.decisionQuery) {
            console.log('' + x + ': ' + JSON.stringify(data.decisionQuery[x]));
          }
          console.log(data);
        }

        const values = R.map(S.pipe([
          R.props([x, y]),
          R.zipObj(['value', 'label']),
        ]), data.decisionQuery);

        //if (data.decisionQuery[0]['seriesKey']) console.log(data.decisionQuery[0]['seriesKey']);
        // console.log(data.decisionQuery);
        // console.log(x, y);
        // console.log(values);
        // console.log('');

        this.preppedData = {
          key: data.decisionQuery[0]['seriesKey'] || this.title,
          values,
        };

        this.rawData = presentData(data.decisionQuery);
        this.chartData = this.shaper.shape(this.preppedData);
      });
  }

  public setPlotType(plotType: string) {
    const { x, y } = this.axisInfo;
    if (!this.shapers) { return; }
    this.plotType = plotType;
    this.shaper = R.prop(this.plotType)(this.shapers);
    this.options = this.shaper.options({ x, y });
    this.chartData = this.shaper.shape(this.preppedData);

    console.log(this.title);
    console.log(this.preppedData);
    console.log(this.chartData);
  }
}
