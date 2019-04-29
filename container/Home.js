import React, { Component } from "react";
import auth from "../firebase";
import styled from "styled-components";
import Router from "next/router";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: {}
    };
  }
  componentDidMount() {
    const currentUser = auth.currentUser;
    this.setState({ currentUser })
  }

  getUser = () => {};

  logout = e => {
    e.preventDefault();
    auth.signOut().then(response => {
      this.setState({
        currentUser: null
      });
      localStorage.clear();
    });
    Router.push({
      pathname: "/login"
    });
  };
  render() {
    return (
      <Container>
        <div>
            <button onClick={this.logout}>Logout</button>
        </div>
      </Container>
    );
  }
}
const Container = styled.div``;
export default Home;
