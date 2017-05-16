import * as R from 'ramda';
import { shapeMultiSeries } from './utils.js'

export const shape = shapeMultiSeries;

export const options = ({ x, y }) => ({
  chart: {
    type: 'multiBarChart',
    height: 450,
    margin : {
      top: 20,
      right: 20,
      bottom: 45,
      left: 45
    },
    x: R.prop(x),
    y: R.prop(y),
    clipEdge: true,
    duration: 500,
    stacked: true,
    reduceXTicks: false,
    xAxis: {
      axisLabel: x,
      showMaxMin: false,
      rotateLabels: 22.5,
      staggerLabels: true,
    },
    yAxis: {
      axisLabel: y,
      axisLabelDistance: -20,
      tickFormat: Math.floor,
    }
  }
});
