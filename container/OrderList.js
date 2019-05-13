import React, { Component } from "react";
import database from "../firebase/database";
import styled from "styled-components";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import MoreIcon from "@material-ui/icons/MoreVert";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Router from "next/router";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";

export class OrderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderList: [],
      winnerTitle: "",
      anchorEl: null,
      orderId: "",
      nameMenu: "",
      total: 0,
      uid: "",
      winnerId: "",
      openAction: [],
      editOpen: [],
      indexItem: null
    };
  }

  async componentDidMount() {
    await this.getWinner();
  }

  getWinner = () => {
    database
      .ref(`winner`)
      .orderByChild(`date`)
      .startAt(`${new Date().getMonth()} ${new Date().getDay()}`)
      .on("value", async snapshot => {
        const data = snapshot.val();
        const keys = Object.keys(snapshot.val());
        const winnerData = keys.map(key => ({ _id: key, ...data[key] }));
        const userData = await this.getUser();

        const orderList = await this.getOrderList(winnerData, userData);
        let openAction = [];
        let editOpen = [];
        if (orderList) {
          orderList.map((e, i) => {
            openAction.push(false);
            editOpen.push(false);
          });
        }
        !this.unset &&
          this.setState({
            orderList: orderList ? orderList : [],
            winnerTitle: Object.values(data)[0].winnerName,
            winnerId: Object.keys(data)[0],
            openAction,
            editOpen
          });
      });
  };
  getOrderList = (userOrder, userDetail) => {
    return new Promise((resolve, reject) => {
      const dataUserOrder = userOrder[0].userOrder ? Object.values(userOrder[0].userOrder) : [];
      const keys = userOrder[0].userOrder ?  Object.keys(userOrder[0].userOrder): [];
      const orderUser = keys ? keys.map(key => ({ uid: key, ...userOrder[0].userOrder[key] })) : [];
      let data;
      if(orderUser && orderUser.length !== 0) {
        data = userDetail.map((e, i) => {
          const usingData =
            orderUser &&
            orderUser.reduce(
              (prev, current, index) => {
                if (e._id === current.uid) {
                  prev.data.uid = e._id;
                  prev.data.fullname = e.fullname;
                  prev.data.order = current.order;
                  prev.data._id = userOrder[0]._id;
                  prev.data.isEdit = false;
                } else {
                  prev.data.uid = e._id;
                  prev.data.fullname = e.fullname;
                  prev.data._id = userOrder[0]._id;
                  prev.data.isEdit = false;
                }
                return prev;
              },
              { data: {} }
            );
          return usingData.data;
        });
      }
      resolve(data);
    });
  };

  editOpen = (index, itemEdit) => {
    const { openAction, orderList } = this.state;
    openAction[index] = false;
    itemEdit.isEdit = true;
    orderList[index] = itemEdit;
    this.setState({ isEdit: true, anchorEl: null, openAction, orderList });
  };
  closeEdit = (index) => {
    const { orderList } = this.state;
    orderList[index].isEdit = false;
    this.setState({ orderList });
  }
  handleChangeText = event => {
    this.setState({ nameMenu: event.target.value });
  };
  handleChangeTotal = event => {
    this.setState({ total: parseInt(event.target.value) });
  };
  handleClickMenus = (event, orderId, uid, index) => {
    const { openAction } = this.state;
    openAction[index] = !openAction[index];
    this.setState({
      anchorEl: event.currentTarget,
      orderId,
      uid,
      openAction,
      indexItem: index
    });
  };
  submitForm = e => {
    e.preventDefault();
    const { nameMenu, total, winnerId, uid, indexItem, orderList } = this.state;
    let order = [];
    order.push({
      nameMenu,
      total
    });
    database.ref(`winner/${winnerId}/userOrder/${uid}`).update({
      order,
      uid
    });
    orderList[indexItem].isEdit = false;
    this.getWinner();
    this.setState({ orderList });
  };
  handleCloseMenus = index => {
    const { openAction } = this.state;
    openAction[index] = false;
    this.setState({ anchorEl: null, openAction });
  };

  
  getUser = () => {
    return new Promise((resolve, reject) => {
      database.ref(`user`).on("value", snapshot => {
        const data = snapshot.val();
        const keys = Object.keys(snapshot.val());
        const userData = keys.map(key => ({ _id: key, ...data[key] }));
        resolve(userData);
      });
    });
  };
  renderItem = () => {
    const { orderList, anchorEl ,total, nameMenu, openAction } = this.state;
    return (
      orderList &&
      orderList.map((e, i) => {
        return (
          <TableRow key={"rows" + i}>
            <TableCell key={"fullname" + i}>{e.fullname}</TableCell>
            {e.order ? (
              // e.order.map((eOrder, i) => (
                <>
                  <TableCell key={"itemName" + i}>
                    {Object.values(e.order).map((eOrder, i) => (
                        e.isEdit ? (
                          <div style={{ display: 'flex', flexDirection: 'column' }} key={`inputFromName ${i}`}>
                            <InputForm
                              onChange={this.handleChangeText}
                              defaultValue={eOrder.nameMenu}
                            />
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column' }} key={`inputFromName ${i}`}>
                            <p>{eOrder.nameMenu}</p>
                          </div>
                        ))
                      )
                    }
                  </TableCell>
                  <TableCell key={"itemTotal" + i}>
                    {Object.values(e.order).map((eOrder, i) => (
                          e.isEdit ? (
                            <div style={{ display: 'flex', flexDirection: 'column' }} key={`inputFromTotal ${i}`}>
                              <InputForm
                                onChange={this.handleChangeText}
                                defaultValue={eOrder.total}
                              />
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column' }} key={`inputFromTotal ${i}`}>
                              <p>{eOrder.total} กล่อง</p>
                            </div>
                          ))
                        )
                      }
                  </TableCell>
                </>
            ) : (
              <>
                <TableCell key={"itemEdit 3" + i}>
                  {e.isEdit ? (
                    <InputForm
                      onChange={this.handleChangeText}
                      defaultValue={''}
                    />
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell key={"itemEdit 4" + i}>
                  {e.isEdit ? (
                    <InputForm
                      onChange={this.handleChangeTotal}
                      defaultValue={0}
                      type="number"
                    />
                  ) : (
                    "-"
                  )}
                </TableCell>
              </>
            )}
            <TableCell align="center" key={"icons" + i}>
              {e.isEdit ? (
              <>
                <IconButton key={"editIcon" + i} type="submit">
                  <ActionButton src="../static/image/confirm.png" />
                </IconButton>
                <IconButton key={"deleteIcon" + i} onClick={() => this.closeEdit(i)}>
                  <ActionButton src="../static/image/cancel.png" />
                </IconButton>
              </> 
              ) : (
                <IconButton
                  key={"MoreIcon" + i}
                  aria-owns={anchorEl ? "simple-menu" : "defaults"}
                  aria-haspopup="true"
                  onClick={event =>
                    this.handleClickMenus(event, e._id, e.uid, i)
                  }
                >
                  <MoreIcon />
                </IconButton>
              )}
              <Menu
                key={"Menu Items" + i}
                id="simple-menu"
                anchorEl={anchorEl}
                open={openAction[i]}
                onClose={() => this.handleCloseMenus(i)}
              >
                <MenuItem
                  onClick={() => this.editOpen(i, e)}
                  key={`menuButton ${i}`}
                >
                  <ActionButton src="../static/image/pencil-edit-button.png" />
                </MenuItem>
                <MenuItem onClick={this.deleteOpen}>
                  <ActionButton src="../static/image/delete.png" />
                </MenuItem>
              </Menu>
            </TableCell>
          </TableRow>
        );
      })
    );
  };
  componentWillUnmount() {
    this.unset = true;
  }
  render() {
    const { orderList,winnerTitle } = this.state;
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
                <TableCell align="left">amount</TableCell>
                <TableCell align="center">action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{this.renderItem()}</TableBody>
          </Table>
        </FormVote>
      </Container>
    );
  }
}

export default OrderList;

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
  border-radius: 5px;
  margin: 1vw;
`;

const HeaderChannel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0.5vw 5vw 0 0;
  > h1 {
    margin: 0;
  }
  > button.Addnew {
    color: white;
    background-color: #f41b00;
    width: 10vw;
    font-size: 1.5vw;
    border-radius: 5px;
  }
`;

const FormVote = styled.form`
  width: 100%;
`;
const FormInput = styled.div``;

const InputVote = styled.input`
  font-size: 1.2vw;
  padding: 1vw;
  margin: 1vw;
  height: 3vw;
  width: 3vw;
`;
