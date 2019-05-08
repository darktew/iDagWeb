import React, { Component } from 'react'
import MenuList from '../container/MenuList'
import Layout from '../container/layout';
import withAuthentication from "../components/Sessions/withAuthentication";
import withAuthorization from '../components/Sessions/withAuthorization';
import { compose } from 'recompose';
import { connect} from 'react-redux';


export class MenuListPage extends Component {


  render() {
    return (
    <Layout>
      <MenuList {...this.props}/>
    </Layout>
    )
  }
}
export default withAuthorization(false)(MenuListPage)
