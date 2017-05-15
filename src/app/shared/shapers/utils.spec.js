import { getBarChartValues } from './utils';

const dataPoint = { xKey: 1, yKey: 'axisName' };

const multiSeries = [
  { ...dataPoint, seriesKey: 'series1' },
  { ...dataPoint, seriesKey: 'series2' },
];

const singleSeries = [
  dataPoint,
  dataPoint,
];

describe('#getBarChartValues', () => {
  describe('should produce correct shape when seriesKey is:', () => {
    it('present', () => {
      expect(getBarChartValues(multiSeries)).toMatchSnapshot();
    });

    it('absent', () => {
      expect(getBarChartValues(singleSeries)).toMatchSnapshot();
    });
  });
});
