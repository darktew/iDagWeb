import React, { Component } from 'react'
import auth from '../firebase';
import Router from 'next/router'

class LoaddingPage extends Component {
    async componentDidMount() {
        auth.onAuthStateChanged(user => {
            if (user) {
                console.log("login")
                Router.push({
                    pathname: '/home'
                })
            } else {
                console.log("No login")
                Router.push({
                    pathname: '/login'
                })
            }
        })
    }
    render() {
        return (
            <div>
                test
            </div>
        )
    }
}

export default LoaddingPage
