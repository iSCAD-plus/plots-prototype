import * as R from 'ramda';

export const shape = ({key, values}) => (values);

export const options = () => {
  const chart = {
    type: 'pieChart',
    height: 450,
    margin: { top: 20, right: 20, bottom: 150, left: 55 },
    x: R.prop('value'),
    y: R.prop('label'),
    showLabels: true,
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
  };

  return {
    chart: chart
  };
};
