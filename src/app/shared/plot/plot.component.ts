import * as S from 'sanctuary';
import * as R from 'ramda';
import gql from 'graphql-tag';
import { Component, OnInit, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';

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
    <nvd3 *ngIf="chartData" [options]="options" [data]="chartData"></nvd3>
  `,
})
export class PlotComponent implements OnInit {
  options: object;
  loading: boolean;
  private chartData: object;

  @Input() title: String;
  @Input() query: String;
  @Input() axisInfo: Axis;
  // @Input() x: String;
  // @Input() y: String;
  // @Input() seriesKey: String;

  constructor(private apollo: Apollo) {
    this.chartData = [];
  }

  get gqlQuery() {
    return gql`${this.query}`;
  }

  ngOnInit() {
    const { x, y } = this.axisInfo;

    this.options = {
      chart: {
        type: 'discreteBarChart',
        height: 450,
        margin : { top: 20, right: 20, bottom: 50, left: 55 },
        x: R.prop(x),
        y: R.prop(y),
        showValues: true,
        duration: 500,
        xAxis: { axisLabel: x },
        yAxis: { axisLabel: y, axisLabelDistance: -10 },
        dispatch: {
          stateChange: e => console.log("stateChange"),
          changeState: e => console.log("changeState"),
          tooltipShow: e => console.log("tooltipShow"),
          tooltipHide: e => console.log("tooltipHide")
        },
        // callback: chart => console.log("!!! lineChart callback !!!"),
      }
    }

    this.apollo.watchQuery<QueryResponse>({ query: this.gqlQuery })
      .subscribe(({ data }) => {
        this.loading = data.loading;
        // this.chartData = R.map(R.props([this.x, this.y]), data.decisionQuery);
        // this.chartData = R.map(R.props([x, y]), data.decisionQuery);
        this.chartData = [{
          key: this.title,
          values: data.decisionQuery,
        }];

        console.log(this.chartData);
      });
  }
}
