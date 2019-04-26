import React, { Component } from 'react'
import { connectedRef } from '../database';
import LoginForm from '../container/LoginForm' 


class LoginPage extends Component {
  render() {
    return (
      <LoginForm />
    )
  }
}
export default LoginPage