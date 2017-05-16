import * as R from 'ramda';
import { shapeSingleSeries } from './utils.js';

export const shape = R.identity;

export const options = ({ x, y }) => ({
  chart: {
    type: 'pieChart',
    height: 450,
    margin: { top: 20, right: 20, bottom: 150, left: 55 },
    x: R.prop(x),
    y: R.prop(y),
    showLabels: false,
    duration: 500,
    labelThreshold: 0.01,
    labelSunbeamLayout: true,
    legend: {
      margin: {
        top: 5,
        right: 35,
        bottom: 5,
        left: 0,
      },
    },
  }
});
