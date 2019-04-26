import React, { Component } from 'react'
import auth from '../firebase'
import Header from '../components/header'
import styled from 'styled-components'


class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentUser: null,
    }
  }
  componentDidMount() {

  }
  logout = e => {
    e.preventDefault()
    auth.signOut().then(response => {
      this.setState({
        currentUser: null
      })
    })
  }
  render() {
    const { currentUser } = this.state;
    console.log("CerrentUser",currentUser);
    return (
        <Container>
          <div>
          <Header/>
          {/* <p>Hello {currentUser.email}</p> */}
          <button onClick={this.logout}>Logout</button>
         </div>
        </Container>
    )
  }
}
const Container = styled.div`
`
export default Home
