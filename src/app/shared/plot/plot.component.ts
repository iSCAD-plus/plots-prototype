import * as S from 'sanctuary';
import * as R from 'ramda';
import gql from 'graphql-tag';
import { Component, OnInit, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';
import getShaper from '../shapers';
import { shapeTable } from '../shapers/utils';

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
      (click)="setPlotType(barType)"
      [value]="barType"
    > Bar Chart |
    <input
      type="radio"
      name="chartType"
      [(ngModel)]="plotType"
      (click)="setPlotType('table')"
      value="table"
    >Table
    </form>
    <div *ngIf="isChart(plotType)">
      <nvd3
        *ngIf="chartData"
        [options]="options"
        [data]="chartData">
      </nvd3>
    </div>
    <div *ngIf="plotType === 'table'">
      <table datatable class="row-border hover">
        <thead>
          <tr>
            <th *ngFor="let key of chartData.header">{{key}}</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let data of chartData.values">
            <td *ngFor="let datum of data">
              {{datum}}
            </td>
          </tr>
      </table>
    </div>
  `,
})
export class PlotComponent implements OnInit {
  private loading: boolean;
  private options: object;
  private rawData: object[];
  private chartData: object[];
  private tableData: object;
  private barType: string;

  @Input() title: string;
  @Input() query: string;
  @Input() axisInfo: Axis;
  @Input() plotType: string;

  constructor(private apollo: Apollo) {
  }

  get gqlQuery() {
    return gql`${this.query}`;
  }

  isChart(plotType) {
    return plotType && plotType.toLowerCase().includes('chart');
  }

  formatData() {
    const shaper = getShaper(this.plotType);
    this.options = shaper.options(this.axisInfo);
    this.chartData = shaper.shape(this.rawData, this.axisInfo);
  }

  public setPlotType(plotType: string) {
    this.plotType = plotType;
    this.formatData();
  }

  ngOnInit() {
    const { seriesKey } = this.axisInfo;

    this.apollo
      .query<QueryResponse>({ query: this.gqlQuery })
      .subscribe(({ data }) => {
        this.loading = data.loading;
        this.barType = seriesKey ? 'multiBarChart' : 'discreteBarChart';
        this.plotType = this.barType;
        this.rawData = data.decisionQuery;
        this.formatData();
      });
  }
}
