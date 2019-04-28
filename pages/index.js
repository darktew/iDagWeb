import React, { Component } from 'react'
import auth from '../firebase';
import Router from 'next/router';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

class Index extends Component {
    async componentDidMount() {
        auth.onAuthStateChanged(user => {
            console.log(user)
            if (user) {
                localStorage.setItem('@user',JSON.stringify(user));
                Router.push({
                    pathname: '/home'
                })
            } else {
                Router.push({
                    pathname: '/login'
                })
            }
        })
    }
    render() {
       return (
            <CircularProgress style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                marginTop: '-50px', 
                marginLeft: '-50px', 
                width: '100px', 
                height: '100px'
            }}
            />
       )
    }
}

export default Index
