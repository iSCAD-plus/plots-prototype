import * as R from 'ramda';
import { shapeSingleSeries } from './utils.js';

export const shape = shapeSingleSeries;

export const options = ({ x, y }) => ({
  chart: {
    type: 'discreteBarChart',
    height: 450,
    margin: { top: 20, right: 20, bottom: 150, left: 55 },
    x: R.prop(x),
    y: R.prop(y),
    showValues: true,
    valueFormat: Math.floor,
    duration: 500,
    xAxis: {
      axisLabel: x,
      rotateLabels: 22.5,
      staggerLabels: true,
    },
    yAxis: {
      axisLabel: y,
      axisLabelDistance: -10,
      tickFormat: Math.floor,
    },
  }
})
