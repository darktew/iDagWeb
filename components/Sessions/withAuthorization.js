import React from 'react';
import Router from 'next/router';

import auth from '../../firebase';

const withAuthorization = (needsAuthorization) => (Component) => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      auth.onAuthStateChanged(authUser => {
        if (!authUser && needsAuthorization) {
          Router.push({ pathname: '/login' })
        } 
      });
    }

    render() {
      return (
        <Component { ...this.props } />
      );
    }
  }

  return WithAuthorization;
}

export default withAuthorization;