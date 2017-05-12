import * as S from 'sanctuary';
import * as R from 'ramda';
import gql from 'graphql-tag';
import { Component, OnInit, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';
import * as pieChart from '../shapers/pie-chart';
import * as discreteBarChart from '../shapers/discrete-bar-chart';

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
  <h3>{{title}}</h3>{{query}}
  <form>
      <input type="radio" name="chartType" [(ngModel)]="plotType" (click)="setPlotType('pieChart')" value="pieChart">Pie Chart |
      <input type="radio" name="chartType"  [(ngModel)]="plotType" (click)="setPlotType('discreteBarChart')" value="discreteBarChart"> Bar Chart
    </form>
    <nvd3 *ngIf="chartData" [options]="options" [data]="chartData"></nvd3>
  `,
})
export class PlotComponent implements OnInit {
  options: object;
  loading: boolean;
  private chartData: object;
  private preppedData: object;
  private shapers: any;
  private shaper: any;

  @Input() title: String;
  @Input() query: String;
  @Input() axisInfo: Axis;
  @Input() plotType: string;

  constructor(private apollo: Apollo) {
    this.chartData = [];
  }

  get gqlQuery() {
    return gql`${this.query}`;
  }

  ngOnInit() {
  const { x, y } = this.axisInfo;
  const plotType = this.plotType || 'discreteBarChart';
  this.shapers = {
    pieChart,
    discreteBarChart,
    };
    this.shaper = R.prop(plotType)(this.shapers);

  this.options = this.shaper.options({x,y});

    this.apollo.watchQuery<QueryResponse>({ query: this.gqlQuery })
      .subscribe(({ data }) => {
        this.loading = data.loading;
        // this.chartData = R.map(R.props([this.x, this.y]), data.decisionQuery);
        // this.chartData = R.map(R.props([x, y]), data.decisionQuery);

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
          //R.tap(console.log),
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

          this.chartData = this.shaper.shape(this.preppedData);

          //console.log('chart data');
          //console.log(this.chartData);
      });
      }

      public setPlotType(plotType: string) {
      const { x, y } = this.axisInfo;
      if (!this.shapers) { return; }
      this.plotType = plotType;
      this.shaper = R.prop(this.plotType)(this.shapers);
      this.options = this.shaper.options({x,y});
      this.chartData = this.shaper.shape(this.preppedData);

      console.log(this.title);
      console.log(this.preppedData);
      console.log(this.chartData);
      }
}
