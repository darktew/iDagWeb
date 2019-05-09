import React, { Component } from 'react'
import OrderList from '../container/OrderList';
import Layout from '../container/layout';
import withAuthorization from '../components/Sessions/withAuthorization';


export class OrderListPage extends Component {


  render() {
    return (
    <Layout>
      <OrderList {...this.props}/>
    </Layout>
    )
  }
}
export default withAuthorization(false)(OrderListPage)
