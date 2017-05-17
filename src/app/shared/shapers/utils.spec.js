import { shapeSingleSeries, shapeMultiSeries } from './utils';

const dataPoint = xKey => ({ xKey, yKey: 'axisName' });

const seriesKey = 'seriesKey';
const axisInfo = { x: 'a', y: 'b', seriesKey };
const singleSeries = [dataPoint(1), dataPoint(2)];
const multiSeries = singleSeries.map((x, i) => ({ ...x, [seriesKey]: `series${i}` }));

describe('#shapeSingleSeries', () => {
  it('should produce correct shape', () => {
    expect(shapeSingleSeries(singleSeries)).toMatchSnapshot();
  });
});

describe('#shapeMultiSeries', () => {
  it('should produce correct shape', () => {
    expect(shapeMultiSeries(multiSeries, axisInfo)).toMatchSnapshot();
  });
});
