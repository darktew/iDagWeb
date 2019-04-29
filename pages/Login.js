import React, { Component } from 'react'
import LoginForm from '../container/LoginForm' 
import withAuthentication from "../components/Sessions/withAuthentication";
import withAuthorization from '../components/Sessions/withAuthorization';
import { compose } from 'recompose';
import { connect} from 'react-redux';

class LoginPage extends Component {
  // static getInitialProps( context ) {
  //   console.log('renderPage', context)
  // }
  componentDidMount() {
    console.log('props', this.props);
  }
  render() {
    return (
      <LoginForm {...this.props}/>
    )
  }
}

const mapStateToProps = state => ({
  authUser: state.authUser 
})
export default connect(mapStateToProps)(compose(withAuthentication, withAuthorization(false))(LoginPage))