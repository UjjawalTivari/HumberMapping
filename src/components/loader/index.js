import React from 'react';

import s from './style.css';

export default class Loader extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      completed: 0,
    };
  }

  componentDidMount() {
    this.timer = setTimeout(() => this.progress(5), 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  progress(completed) {
    if (completed > 100) {
      this.setState({completed: 100});
    } else {
      this.setState({completed});
      const diff = Math.random() * 10;
      this.timer = setTimeout(() => this.progress(completed + diff), 1000);
    }
  }

  render() {
    return (
      <div>
      <div className="cssload-thecube">
        <div className="cssload-cube cssload-c1"></div>
        <div className="cssload-cube cssload-c2"></div>
        <div className="cssload-cube cssload-c4"></div>
        <div className="cssload-cube cssload-c3"></div>
      </div>
      <div className="loadingbar">
        <center>
        <div className="loadingbartitle">Welcome to Humber Map</div>
        <div className="loadingbarloading">Loading..</div>
        </center>
      </div>
      </div>
    );
  }
}
