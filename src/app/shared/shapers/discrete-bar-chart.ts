import * as R from 'ramda';

export const shape = ({ key, values }) => {
  return [{ key, values }];
};

export const options = ({ x, y }) => {
  const chart = {
    type: 'discreteBarChart',
    height: 450,
    margin: { top: 20, right: 20, bottom: 150, left: 55 },
    x: R.prop('value'),
    y: R.prop('label'),
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
  };

  return {
    chart: chart
  };
};
