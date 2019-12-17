import React, { Component } from "react";

import { Center, Card, FormItem, FormSubmit } from "./styles";

export default class Login extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }
  render() {
    return (
      <loginContainer>
        <Center>
          <Card>
            <h1>Login</h1>
            <form>
              <FormItem
                placeholder="Username goes here..."
                name="username"
                type="text"
                onChange={this.handleChange}
              />
              <FormItem
                placeholder="Password goes here..."
                name="password"
                type="password"
                onChange={this.handleChange}
              />
              <FormSubmit value="SUBMIT" type="submit" />
            </form>
          </Card>
        </Center>
      </loginContainer>
    );
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
}
