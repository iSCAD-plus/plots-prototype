import { shapeSingleSeries, shapeMultiSeries } from './utils';

const dataPoint = xKey => ({ xKey, yKey: 'axisName' })
const a = dataPoint(1);
const b = dataPoint(2);
const singleSeries = [a, b];
const multiSeries = singleSeries.map((x, i) => ({ ...x, seriesKey: `series${i}` }));

describe('#shapeSingleSeries', () => {
  it('should produce correct shape', () => {
    expect(shapeSingleSeries(singleSeries)).toMatchSnapshot();
  });
});

describe('#shapeMultiSeries', () => {
  it('should produce correct shape', () => {
    expect(shapeMultiSeries(multiSeries, 'seriesKey')).toMatchSnapshot();
  });
});
