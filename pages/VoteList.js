import React, { Component } from 'react'
import VoteList from '../container/VoteList';
import Layout from '../container/layout';
import withAuthentication from "../components/Sessions/withAuthentication";
import withAuthorization from '../components/Sessions/withAuthorization';
import { compose } from 'recompose';
import { connect} from 'react-redux';


export class VoteListPage extends Component {


  render() {
    return (
    <Layout>
      <VoteList {...this.props}/>
    </Layout>
    )
  }
}
export default withAuthorization(false)(VoteListPage)
