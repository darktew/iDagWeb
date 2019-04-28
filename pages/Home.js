import React, { Component } from "react";
import Home from "../container/Home";
import Layout from "../components/Layout";

class HomePage extends Component {
  
  render() {
    return (
      <Layout >
        <Home {...this.props}/>
      </Layout>
    );
  }
}

export default HomePage;
