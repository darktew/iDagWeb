import React, { Component } from "react";
import Home from "../container/Home";
import Layout from "../container/layout";
import withAuthorization from "../components/Sessions/withAuthorization";
import MyApp from './_app';
class HomePage extends Component {
  render() {
    return (
      <Layout>
        <Home {...this.props} />
      </Layout>
    );
  }
}

export default withAuthorization(true)(HomePage);
