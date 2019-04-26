import LoginPage from './pages/Login';
import React from 'react'
import Router from 'next/router'
import LoaddingPage from './pages/Loading';
import LoginForm from './container/LoginForm';

export default class App extends React.Component {
   
    render() {
        return (
            <LoaddingPage/>
        )
    }
}
