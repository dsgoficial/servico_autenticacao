import React, { Component } from "react";

import Routes from "./routes";

import GlobalStyle from "./styles/global";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <GlobalStyle />
        <Routes />
      </React.Fragment>
    );
  }
}

export default App;
