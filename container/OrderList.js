import React, { Component } from 'react';
import database from '../firebase/database';
import styled from 'styled-components';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import MoreIcon from '@material-ui/icons/MoreVert';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Router from 'next/router';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';


export class OrderList extends Component {
  constructor(props){
    super(props);
    this.state = {
      orderList: [],
      page: 0,
      rowsPerPage: 5,
      winnerTitle: '',
      anchorEl: null,
      orderId: '',
      isEdit: false,
      nameMenu: '',
      total: 0,
      uid: '',
      winnerId: '',
      openAction: []
    }
  }

  async componentDidMount() {
    await this.getWinner();
  }

  getWinner = () => {
    database.ref(`winner`).orderByChild(`date`).equalTo(`Thu Apr 25 2019 11:30:00 GMT+0700 (+07)`).on('value', async(snapshot) => {
      const data = snapshot.val();

      const keys = Object.keys(snapshot.val());
      const winnerData = keys.map(key => ({_id: key, ...data[key]}))
      const userData = await this.getUser();

      const orderList = await this.getOrderList(winnerData,userData);
      let openAction = [];
      if(orderList) {
        orderList.map((e,i) => openAction.push(false))
      }
      !this.unset && this.setState({ orderList, winnerTitle: Object.values(data)[0].winnerName, winnerId: Object.keys(data)[0], openAction});
    })
  }
  getOrderList = (userOrder, userDetail) => {
    return new Promise((resolve,reject ) => {
     const data = userDetail.map((e,i) => {
      const usingData = userOrder[0].userOrder.reduce((prev, current, index) => {
         if(e._id === current.uid) {
          prev.data.uid = e._id;
          prev.data.order = current.order;
          prev.data.fullname = e.fullname;
          prev.data._id = userOrder[0]._id;
          return prev.data;
         } else {
           prev.data.uid = e._id;
           prev.data.fullname = e.fullname;
           prev.data._id = userOrder[0]._id
           return prev.data;
         }
       }, { data: {} })
       return usingData
      })
      resolve(data)
    })
  }

  editOpen = () => {
    this.setState({ isEdit: true, anchorEl: null })
  }
  handleChangeText = (event) => {
    this.setState({ nameMenu: event.target.value })
  }
  handleChangeTotal = (event) => {
    this.setState({ total: event.target.value })
  }
  handleClickMenus = (event,orderId,uid,index) => {
    const { openAction } = this.state;
    openAction[index] = !openAction[index];
    this.setState({ anchorEl: event.currentTarget, orderId,uid, openAction});
  };
  submitForm = (e) => {
    e.preventDefault();
    const { nameMenu, total,winnerId,uid } = this.state;

    database.ref(`winner/${winnerId}/userOrder`).orderByChild(`uid`).equalTo(uid).on('value', (snapshot) => {
        snapshot.forEach((chlid) => {
          const order = [];
          order.push({
            nameMenu: nameMenu,
            total: total
          })
          chlid.ref.update({
            order: order
          });
        })
    })

    this.setState({ isEdit: false })
  } 
  handleCloseMenus = (index) => {
    const { openAction } = this.state;
    openAction[index] = false;
    this.setState({ anchorEl: null, openAction });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };
  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };
  getUser = () => { 
    return new Promise((resolve,reject) => {
      database.ref(`user`).on('value',(snapshot) => {
        const data = snapshot.val();
        const keys = Object.keys(snapshot.val());
        const userData = keys.map(key => ({_id: key, ...data[key]}))
        resolve(userData);
      })
    })
  }
  renderItem = () => {
    const { orderList,anchorEl, isEdit, total, nameMenu, openAction } = this.state;
    return orderList.map((e,i) => {
      return (
        <TableRow key={"rows" + i}>
          <TableCell>{e.fullname}</TableCell>
          {e.order  &&
            e.order.map((e,i) => (
          <>
            <TableCell>
              { isEdit ? 
                <InputForm onChange={ this.handleChangeText } defaultValue={nameMenu} />
                : 
                e.nameMenu}
            </TableCell>
            <TableCell>
              {
                isEdit ? 
                <InputForm onChange={ this.handleChangeText } defaultValue={total} />
                :
                e.total
              }
            </TableCell>
          </>
          ))}
          <TableCell align="center">
          { isEdit ?
            <IconButton
              key={"editIcon" + i}
              type="submit"
            >
              <ActionButton
                    src="../static/image/pencil-edit-button.png"
              />
            </IconButton>
            :
            <IconButton 
                key={"MoreIcon" + i}
                aria-owns={anchorEl ? 'simple-menu' : 'defaults'}
                aria-haspopup="true"
                onClick={(event) => this.handleClickMenus(event,e._id,e.uid,i)}
                >
                <MoreIcon />
              </IconButton>
          }
              <Menu
                key={"Menu Items" + i}
                id="simple-menu"
                anchorEl={anchorEl}
                open={openAction[i]}
                onClose={() => this.handleCloseMenus(i)}
              >
                <MenuItem onClick={this.editOpen} key={`menuButton ${i}`}>
                  <ActionButton
                    src="../static/image/pencil-edit-button.png"
                  />
                </MenuItem>
                <MenuItem onClick={this.deleteOpen}>
                  <ActionButton
                    src="../static/image/delete.png"
                  />
                </MenuItem>
              </Menu>
          </TableCell>
        </TableRow>
      )
    })
  }
  componentWillUnmount() {
    this.unset = true;
  }
  render() {
    const { orderList, page, rowsPerPage, open,winnerTitle } = this.state;
    return (
      <Container>
      <HeaderChannel>
        <h1>รายการอาหาร</h1>
        <h2>{winnerTitle}</h2>
      </HeaderChannel>
      <FormVote onSubmit={this.submitForm}>
      <Table style={{ minWidth: 700 }}>
        <TableHead>
          <TableRow>
            <TableCell align="left">username</TableCell>
            <TableCell align="left">menu</TableCell>
            <TableCell align="left">total</TableCell>
            <TableCell align="center">action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{this.renderItem()}</TableBody>
      </Table>
      </FormVote>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={orderList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        backIconButtonProps={{
          "aria-label": "Previous Page"
        }}
        nextIconButtonProps={{
          "aria-label": "Next Page"
        }}
        onChangePage={this.handleChangePage}
        onChangeRowsPerPage={this.handleChangeRowsPerPage}
      />
    </Container>
    )
  }
}

export default OrderList


////////////////////////////////


const Container = styled.div``;

const ActionButton = styled.img`
  cursor: pointer;
  width: 1.5vw;
  height: 1.5vw;
  margin: 0 0.5vw;
`;

const InputForm = styled.input`
  padding: 1vw;
  font-size: 1vw;
  border-radius:5px;
  margin:1vw;
`;

const HeaderChannel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction:column;
  padding: 0.5vw 5vw 0 0;
  > h1 {
    margin: 0;
  }
  > button.Addnew {
    color:white;
    background-color: #F41B00;
    width:10vw;
    font-size:1.5vw;
    border-radius:5px;
  }
`

const FormVote = styled.form`
  width:100%;
`

const InputVote = styled.input`
  font-size: 1.2vw;
  padding: 1vw;
  margin: 1vw;
  height: 3vw;
  width: 3vw;
`


