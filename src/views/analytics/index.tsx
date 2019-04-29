import React, { Component } from "react";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";

import { loadActivity } from "../../store/activity/actions";
import { RootAction, RootState } from "../../store/types";

const mapStateToProps = (state: RootState) => ({
  isLoadingRecords: state.activity.isLoadingRecords,
  records: state.activity.records
});

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators({ loadActivity }, dispatch);

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

class AnalyticsView extends Component<Props, {}> {
  componentDidMount() {
    this.props.loadActivity();
  }

  renderRecords() {
    return (
      <>
        {this.props.records
          .slice()
          .sort(
            (a, b): number => {
              return b.startTime < a.startTime ? -1 : 1;
            }
          )
          .slice(0, 50)
          .map(record => (
            <div key={record.id}>
              <strong>{record.title}</strong>
              <span>
                &nbsp;(
                {(record.endTime - record.startTime).toLocaleString()}
                ms)
              </span>
            </div>
          ))}
      </>
    );
  }

  render() {
    return (
      <div>
        <h1>Analytics</h1>
        <div>
          {this.props.isLoadingRecords ? "Loading..." : this.renderRecords()}
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnalyticsView);
