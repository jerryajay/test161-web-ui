import {Component} from 'react';
import {getPointClass} from '../points';

class SummaryComponent extends Component {
  render() {
    const {student} = this.props;
    const {target_stats = []} = student;
    let scores = target_stats.map(result => {
      let {
        high_score: points_earned,
        max_score: points_avail,
        target_name: asst
      } = result;
      if (!points_earned) {
        points_earned = 0;
      }
      return {asst, points_avail, points_earned};
    });
    const list = scores.map(score => {
      const {points_earned, points_avail, asst} = score;
      const className = getPointClass(score);
      return (
        <tr key={asst} className={className}>
          <td>{asst}</td>
          <td>{points_earned}/{points_avail}</td>
        </tr>
      );
    });
    return (
      <div className="row">
        <table className="table">
          <thead>
            <tr>
              <th>Assignment</th>
              <th>Best Score</th>
            </tr>
          </thead>
          <tbody>
            {list}
          </tbody>
        </table>
      </div>
    );
  }
}

export default {SummaryComponent};
