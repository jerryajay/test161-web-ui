import {UrlHashComponent} from 'client/modules/core/components/mixins';
import {LoadingComponent} from 'client/modules/core/components/loading';
import {LeaderListComponent} from './leaderlist';

import Highcharts from 'highcharts/highstock';
const BINS = 10;

class PerformanceComponent extends UrlHashComponent {
  constructor(props) {
    super(props);
    this.state = {
      container: props.target._id + '-chart'
    };
  }

  componentDidMount() {
    this.update();
  }

  componentDidUpdate() {
    this.update();
  }

  update() {
    const {ready, performances} = this.props.data;
    if (!ready) {
      return;
    }
    if (!performances || performances.length === 0) {
      return;
    }
    const values = performances;
    const max = values[values.length - 1];
    const min = Math.min(0, values[0]);
    const interval = (max - min) / BINS;
    let labels = [];
    let counts = [];
    let total = values.length;
    for (let i = 0; i <= BINS; i++) {
      const lower = Math.round(i * interval * 100) / 100;
      const upper = Math.round((i + 1) * interval * 100) / 100;
      labels[i] = `>${lower} <=${upper}`;
      counts[i] = 0;
    }
    for (let i of values) {
      const index = Math.floor(i / interval);
      counts[index]++;
    }
    for (let i = 0; i <= BINS; i++) {
      counts[i] = counts[i] / total * 100;
    }
    counts = counts.reverse();
    labels = labels.reverse();
    this.highcharts({labels, counts, total});
  }

  highcharts({labels, counts, total}) {
    const chartOptions = {
      chart: {
        renderTo: this.state.container,
        type: 'column'
      },
      title: {
        text: `Total submissions: ${total}`
      },
      xAxis: {
        title: {
          text: 'Performance'
        },
        // labels:{
        //   rotation: -90,
        // },
        // lineWidth: 0,
        // lineColor: '#999',
        // tickLength: 80,
        // tickColor: '#ccc',
        categories: labels
      },
      yAxis: {
        title: {
          text: 'Percentage of Submissions'
        },
        labels: {
          format: '{value}%'
        }
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        series: {
          grouping: false,
          shadow: false,
          groupPadding: 0,
          pointPadding: 0,
          borderWidth: 0
        }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -16,
        floating: true,
        borderWidth: 1,
        backgroundColor: '#FFFFFF',
        shadow: true
      },
      tooltip: {
        useHTML: true,
        headerFormat: '<span>Performance: {point.key}</span><br/>',
        valueDecimals: 2,
        valuePrefix: '',
        valueSuffix: ' %'
      },
      series: [ {
        name: 'Groups',
        showInLegend: false,
        data: counts
      } ]
    };
    // const myScore = getMyScore(this.props.student, _id);
    // if (myScore > -1) {
    //   const data = counts.map(x => 0);
    //   data[myScore] = counts[myScore];
    //   chartOptions.series.push({
    //     name: 'You',
    //     tooltip: {
    //       useHTML: true,
    //       pointFormat: 'You are here: <b>{point.y}</b><br/>'
    //     },
    //     showInLegend: true,
    //     color: 'rgba(136, 240, 119, 1)',
    //     data: data
    //   });
    // }
    this.chart = new Highcharts.Chart(chartOptions);
  }

  render() {
    const {
      target: {print_name: title, _id},
      data: {ready, leaders}
    } = this.props;
    if (!ready) {
      return (<LoadingComponent />);
    }
    return (
      <div className="row" id={_id}>
        <div className="col-md-12">
          <h1>{title}</h1>
          <div className="alert alert-success text-center" role="alert">
            <span className="h3">
              Top <b>{leaders.length}</b> group
              {leaders.length > 1 ? 's' : null} for {title}!
            </span>
          </div>
          <div className="col-md-8 col-sm-8">
            <div className="row">
              <div id={this.state.container}></div>
            </div>
          </div>
          <div className="col-md-4 col-sm-4">
            <LeaderListComponent {...{leaders}}/>
          </div>
        </div>
      </div>
    );
  }
}

export default {PerformanceComponent};