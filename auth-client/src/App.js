import React from "react";

import Routes from "./routes";

import GlobalStyle from "./styles/global";

import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "./components/Alert";

const options = {
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: "30px",
  transition: transitions.SCALE
};

const App = () => (
  <AlertProvider template={AlertTemplate} {...options}>
    <GlobalStyle />
    <Routes />
  </AlertProvider>
);

export default App;
