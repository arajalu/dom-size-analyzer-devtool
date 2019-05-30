import React, { Component } from "react";
import { render } from "react-dom";

class App extends Component {
  constructor() {
    super();
  }

  render() {
    return <div>TEST</div>;
  }
}

render(<App />, document.getElementById("app"));
