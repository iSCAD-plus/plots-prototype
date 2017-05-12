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
        margin : { top: 20, right: 20, bottom: 150, left: 55 },
        x: R.prop('value'),
        y: R.prop('label'),
        showValues: true,
        valueFormat: Math.floor,
        duration: 500,
        xAxis: {
        axisLabel: x,
        rotateLabels: 22.5,
        },
        yAxis: {
          axisLabel: y,
          axisLabelDistance: -10,
          tickFormat: Math.floor,
        },
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

        const values = R.map(S.pipe([
          R.props([x, y]),
          R.zipObj(['value', 'label']),
          R.tap(console.log),
        ]), data.decisionQuery);

        if (data.decisionQuery[0]['seriesKey']) console.log(data.decisionQuery[0]['seriesKey']);
        // console.log(data.decisionQuery);
        // console.log(x, y);
        // console.log(values);
        // console.log('');

        this.chartData = [{
          key: data.decisionQuery[0]['seriesKey'] || this.title,
          values,
        }];

        // console.log(this.chartData);
      });
  }
}
