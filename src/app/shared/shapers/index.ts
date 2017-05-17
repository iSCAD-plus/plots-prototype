import * as multiBarChart from './multi-bar-chart'
import * as discreteBarChart from './discrete-bar-chart'
import * as pieChart from './pie-chart'
import * as table from './table';

const shapers = { multiBarChart, discreteBarChart, pieChart, table };

export default name => shapers[name]
