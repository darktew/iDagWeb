import React, { Component } from 'react'
import VoteList from '../container/VoteList';
import Layout from "../components/Layout";

export class VoteListPage extends Component {


  render() {
    return (
    <Layout>
      <VoteList {...this.props}/>
    </Layout>
    )
  }
}

export default VoteListPage
