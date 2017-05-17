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
      (click)="setPlotType('discreteBarChart')"
      value="discreteBarChart"
    > Bar Chart
    </form>
    <div *ngIf="showChart">
      <nvd3
        (click)="toggleDisplayJsonVisibility()"
        *ngIf="chartData"
        [options]="options"
        [data]="chartData">
      </nvd3>
    </div>
    <div *ngIf="showTable">
      <table datatable class="row-border hover">
        <thead>
          <tr>
            <th *ngFor="let key of tableData[0].header">{{key}}</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let data of tableData[0].values">
            <td *ngFor="let datum of data">
              {{datum}}
            </td>
          </tr>
      </table>
    </div>
  `,
})
export class PlotComponent implements OnInit {
  private showChart: boolean;
  private showTable: boolean;
  private loading: boolean;
  private options: object;
  private rawData: object[];
  private chartData: object[];
  private tableData: object;

  @Input() title: string;
  @Input() query: string;
  @Input() axisInfo: Axis;
  @Input() plotType: string;

  constructor(private apollo: Apollo) {
    this.showChart = true;
    this.showTable = false;
    this.tableData = [{
      'header': ['x', 'y'],
    }];
  }

  get gqlQuery() {
    return gql`${this.query}`;
  }

  formatData() {
    const shaper = getShaper(this.plotType);
    this.options = shaper.options(this.axisInfo);
    this.chartData = shaper.shape(this.rawData, this.axisInfo);
    this.tableData = shapeTable(this.rawData, this.axisInfo);
  }

  public setPlotType(plotType: string) {
    this.plotType = plotType;
    this.formatData();
  }

  toggleDisplayJsonVisibility() {
    //this.showChart = !this.showChart;
    this.showTable = !this.showTable;
  }

  ngOnInit() {
    const { seriesKey } = this.axisInfo;

    this.apollo
      .query<QueryResponse>({ query: this.gqlQuery })
      .subscribe(({ data }) => {
        this.loading = data.loading;
        this.plotType = seriesKey ? 'multiBarChart' : 'discreteBarChart';
        this.rawData = data.decisionQuery;
        this.formatData();
      });
  }
}
