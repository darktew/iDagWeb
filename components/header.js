import React, { Component } from 'react'
import styled from 'styled-components';

class Header extends Component {
  render() {
    return (
      <Container>
        <div className="left">
          <img src="static/image/dish.png" />
        </div>
        <div className="right">
          <img src="static/image/dish.png" />
        </div>
      </Container>
    )
  }
}

const Container = styled.div`
display:flex;
width:100%;
height:6vw;
>div.left{
  display:flex;
  flex:1;
}
>div.left >img {
  width:5vw;
 
}
>div.right {
  display:flex;
  justify-content:flex-end;
  flex:1;
}
>div.right >img {
  width:5vw;
}
  
  
`

export default Header


