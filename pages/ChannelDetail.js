import React, { Component } from "react";
import Layout from "../container/layout";
import ChannelDetail from "../container/ChannelDetail";
import withAuthorization from "../components/Sessions/withAuthorization";

export class ChannelDetailPage extends Component {
  static async getInitialProps({ req, query, params }) {
    return { query, params };
  }
  render() {
    return (
      <Layout>
        <ChannelDetail {...this.props} />
      </Layout>
    );
  }
}

export default withAuthorization(true)(ChannelDetailPage);
