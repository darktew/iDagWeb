import React from 'react';
import { connect } from 'react-redux';
import Router from 'next/router'

import auth from '../../firebase';

const withAuthentication = (Component) => {
  class WithAuthentication extends React.Component {
    componentDidMount() {
      const { onSetAuthUser } = this.props;
      auth.onAuthStateChanged(authUser => {
        console.log('authUser', authUser);
        if(authUser) {
          onSetAuthUser(authUser)
          if(Router.pathname === '/login') {
            Router.replace('/home')
          }
        } else {
          onSetAuthUser(null);
        }        
      });
    }

    render() {
      return (
        <Component { ...this.props } />
      );
    }
  }

  const mapDispatchToProps = (dispatch) => ({
    onSetAuthUser: (authUser) => dispatch({ type: 'AUTH_USER_SET', authUser }),
  });

  return connect(null ,mapDispatchToProps)(WithAuthentication);
}

export default withAuthentication;