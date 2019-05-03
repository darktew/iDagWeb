import React, { Component } from 'react';
import Layout from '../container/layout';
import withAuthentication from "../components/Sessions/withAuthentication";
import withAuthorization from '../components/Sessions/withAuthorization';
import { compose } from 'recompose';
import { connect} from 'react-redux';
import ChannelDetai from '../container/ChannelDetail'

class ChannelDetailPage extends Component {
  render() {
    return (
    <Layout>
        <ChannelDetai {...this.props}/>
    </Layout>
    )
  }
}

export default (ChannelDetailPage)
