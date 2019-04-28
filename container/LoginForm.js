import React from 'react';
import auth from '../firebase';
import styled from 'styled-components';
import Router from 'next/router'
    
class LoginForm extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          email: '',
          password: '',
          currentUser: null,
          message: ''
        }
      }
      componentDidMount() {
    
      }

      onChange = e => {
        const { name, value } = e.target
    
        this.setState({
          [name]: value
        })
      }
    
      onSubmit = e => {
        e.preventDefault()
    
        const { email, password } = this.state
        
        auth.signInWithEmailAndPassword(email, password)
        .then(response => {
          this.setState({
            currentUser: response.user
          })
        })
        .catch(error => {
          this.setState({
            message: error.message
          })
        });
        Router.push({
          pathname: '/home',
          query: email
        })
      }
    
      render() {
        const { message } = this.state
        return (
          <Container>
            <Headers>
                <p>Admin Login</p>
                <img src="static/image/dish.png" />
            </Headers>
            <Bodys>
                <form onSubmit={this.onSubmit}>
                  <div className="field">
                    <label className="label">Email</label>
                    <div className="control">
                      <input
                        className="input"
                        type="email"
                        name="email"
                        onChange={this.onChange}
                      />
                    </div>
                  </div>
    
                  <div className="field">
                    <label className="label">Password</label>
                    <div className="control">
                      <input
                        className="input"
                        type="password"
                        name="password"
                        onChange={this.onChange}
                      />
                    </div>
                  </div>
                     {message ? <p className="help is-danger">{message}</p> : null}
                  <div className="button">
                    <div className="control">
                      <button className="button">Login</button>
                    </div>
                  </div>
                </form>
            </Bodys>
          </Container>
        )
      }
    }
    
const Container = styled.div`
display:flex;
width:100%;
justify-content:center;
flex-direction:column;
align-items: center;
`
const Headers = styled.div`
display:flex;
justify-content:center;
flex-direction:column;
align-items: center;
>p{
  font-size:5vw;
  margin: 2vw;
}
>img{
  width:20vw;
  height:20vw;
}
`
const Bodys = styled.div`
display:flex;
width:100%;
flex-direction:column;
align-items: center;
> form > div.field > label.label{
  font-size:2.5vw
}
> form > div.field > div.control > input.input{
  font-size:2.5vw;
  border-radius:10px;
}
> form > div.button{
  display:flex;
  justify-content:center;
  align-items: center;
}
> form > div.button >div.control {
  width:50%;
}
> form > div.button >div.control >button.button{
  font-size:2.5vw;
  border-radius:10px;
  margin:1vw;
  background-color: red;
  color:white;
  width:100%;
}
`




export default LoginForm