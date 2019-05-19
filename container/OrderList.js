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
import TextField from '@material-ui/core/TextField';
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import moment  from "moment";
import { PDFExport } from "@progress/kendo-react-pdf";
import _ from 'lodash';
import auth from '../firebase';

export class OrderList extends Component {

  pdfExportComponent;
  constructor(props) {
    super(props);
    this.state = {
      orderList: [],
      winnerTitle: "",
      anchorEl: null,
      nameMenu: "",
      total: 0,
      openAction: [],
      editOpen: [],
      userData: [],
      userId: '',
      timeItem: '',
      indexList: null,
      orderIndex: null
    };
  }

  async componentDidMount() {
    await this.getUser();
  }

  getWinner = async(timeItem) => { 
    return new Promise((resolve, reject) => {
      database
      .ref('winner')
      .orderByChild('date')
      .equalTo(moment(new Date(timeItem)).valueOf())
      .once('value', snapshot => {
        const dataWinner = snapshot.val();
        const keys = Object.keys(dataWinner)
        const data = keys.map(key => ({_id: key, ...dataWinner[key]}));
        resolve(data);
      })
    })
  };
  getUser = async() => {
    const {editOpen, openAction} = this.state;
    const time = await localStorage.getItem('timeItem');
    const dataWinner = await this.getWinner(time);
    database.ref(`user`).on("value", snapshot => {
      const data = snapshot.val();
      const keys = Object.keys(snapshot.val());
      const userData = keys.map(key => ({ _id: key, ...data[key] }));
      let orderList = [];
      userData.reduce((prev,current,index) => {
        if(current.order && current.order[moment(new Date(time)).valueOf()]) {
          orderList.push(current.order[moment(new Date(time)).valueOf()]);
          Object.keys(current.order).map((data, index) => {
            current.order[data][index].isEditItem = false;
          })
        } else { 
          current.isEdit = false;
        }
        editOpen.push(false);
        openAction.push(false);
        return prev;
      }, [])
      console.log(orderList)
      const result = _(orderList).flatMap(key => (key[moment(new Date(time)).valueOf()])).groupBy('nameMenu').value();
      this.setState({
        winnerId: dataWinner[0]._id,
        winnerTitle: dataWinner[0].winnerName,
        userData,
        editOpen,
        openAction,
        orderList: result,
        timeItem: time
      })
    });
  };

  editOpen = (index, itemEdit, data = {}) => {
    const { openAction, userData, orderIndex,timeItem } = this.state;
    if(orderIndex) {
      userData[index].order[moment(new Date(timeItem)).valueOf()][orderIndex - 1].isEditItem = !userData[index].order[moment(new Date(timeItem)).valueOf()][orderIndex - 1].isEditItem;
    }
    openAction[index] = false;
    itemEdit.isEdit = true;
    this.setState({ isEdit: true, anchorEl: null, openAction, userData });
  };
  closeEdit = (index) => {
    const { userData, orderIndex } = this.state;
    if(orderIndex) {
      userData[index].order[moment(new Date(timeItem)).valueOf()][orderIndex - 1].isEditItem = !userData[index].order[moment(new Date(timeItem)).valueOf()][orderIndex - 1].isEditItem;
    }
    userData[index].isEdit = false;
    this.setState({ userData });
  }
  handleChangeText = event => {
    this.setState({ nameMenu: event.target.value });
  };
  handleChangeTotal = event => {
    this.setState({ total: parseInt(event.target.value) });
  };
  handleClickMenus = (event, uid, index, indexItem = null) => {
    const { openAction, userData } = this.state;
    openAction[index] = !openAction[index];
    this.setState({
      anchorEl: event.currentTarget,
      openAction,
      userId: uid,
      indexList: index,
      orderIndex: indexItem
    })
  };
  submitForm = e => {
    e.preventDefault();
    const { nameMenu, total, userId, indexList, userData, orderIndex, timeItem } = this.state;
    const pushValue = [];
    if(orderIndex) {
      database.ref(`user/${userId}/order/${moment(new Date(timeItem)).valueOf()}/${orderIndex - 1}`).update({
        nameMenu: nameMenu ? nameMenu : userData[indexList].order[moment(new Date(timeItem)).valueOf()][orderIndex - 1].nameMenu,
        total: total ? total : userData[indexList].order[moment(new Date(timeItem)).valueOf()][orderIndex - 1].total
      })
      userData[indexList].order[moment(new Date(timeItem)).valueOf()][orderIndex - 1].isEditItem = false;
    } else {
          pushValue.push({
            nameMenu: nameMenu,
            total: total
          })
      database.ref(`user/${userId}/order/${moment(new Date(timeItem)).valueOf()}`).set(pushValue);
      userData[indexList].isEdit = false;
    }
    this.getUser();
    this.setState({ userData });
  };
  handleCloseMenus = (index, indexItem = null) => {
    const { openAction, userData, orderIndex } = this.state;
    openAction[index] = false;
    this.setState({ anchorEl: null, openAction, userData });
  };

  
  
  renderItem = () => {
    const { userData, anchorEl, openAction, nameMenu, timeItem } = this.state;
    let rowUser = [], rowTotal = [];
    userData.map((e,i) => {
      let tempRowMenu = [], tempRowTotal = [],  tempRowAction = [];
      if(e.order && e.order[moment(new Date(timeItem)).valueOf()]) {
        let resultMenu = [], resultTotal = [], resultAction = [] ;
        Object.values(e.order[moment(new Date(timeItem)).valueOf()]).map((current,index) => {
          if(current.isEditItem) {
            resultMenu.push(
              <TextField key={`nameMenu${index}`} placeholder="เมนูอาหาร" margin="dense" defaultValue={current.nameMenu} onChange={this.handleChangeText}/>
            )
            resultTotal.push(
              <TextField placeholder="จำนวน" key={`total${index}`} type="number" margin="dense" defaultValue={current.total}  onChange={this.handleChangeTotal}/>
            )
            resultAction.push(
              <div key={`actionButton${index}`}>
                <IconButton key={"editIcon" + index} type="submit">
                  <ActionButton src="../static/image/confirm.png" />
                </IconButton>
                <IconButton key={"deleteIcon" + index} onClick={() => this.closeEdit(i)}>
                  <ActionButton src="../static/image/cancel.png" />
                </IconButton>
              </div> 
            )
          } else {
            resultMenu.push(
              <div key={`cellMenu${index}`}>
                <p>{current.nameMenu}</p>
                { current.custom && <p>{`(${current.custom})`}</p> }
              </div>
            )
            resultTotal.push(
              <div key={`cellTotal${index}`}>
                 <p>{`${current.total} กล่อง`}</p>
              </div>
            )
            resultAction.push(
              <div style={{ display: 'flex', justifyContent: 'center' }} key={`action${index}`}>
                <IconButton
                  key={"MoreIcon" + index}
                  aria-owns={anchorEl ? "simple-menu" : undefined}
                  aria-haspopup="true"
                  onClick={event =>
                    this.handleClickMenus(event, e._id, i, index + 1)
                  }
                >
                  <MoreIcon />
                </IconButton>
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
                </div>
            )
          }
        })
        tempRowMenu.push(
          <TableCell key={`haveItemMenu${i}`}>
            {resultMenu}
          </TableCell>
        )
        tempRowTotal.push(
          <TableCell key={`haveItemTotal${i}`}>
            {resultTotal}
          </TableCell>
        )
        tempRowAction.push(
          <TableCell align="center" key={`action${i}`}>
            {resultAction}
          </TableCell>
        )
      } else {
         if(e.isEdit) {
          tempRowMenu.push(
          <TableCell key={`noItemInput${i}`}>
            <TextField placeholder="เมนูอาหาร" margin="dense" onChange={this.handleChangeText}/>
          </TableCell>
          )
          tempRowTotal.push(
            <TableCell key={`noItemInput${i}`}>
              <TextField placeholder="จำนวน" type="number" margin="dense" onChange={this.handleChangeTotal}/>
            </TableCell>
          )
          tempRowAction.push(
            <TableCell align="center" key={`noItemActionForm${i}`}>
              <IconButton key={"editIcon" + i} type="submit">
                <ActionButton src="../static/image/confirm.png" />
              </IconButton>
              <IconButton key={"deleteIcon" + i} onClick={() => this.closeEdit(i)}>
                <ActionButton src="../static/image/cancel.png" />
              </IconButton>
            </TableCell> 
          )
         } else {
          tempRowMenu.push(<TableCell key={`noItem${i}`}>{`-`}</TableCell>)
          tempRowTotal.push(<TableCell key={`noItem${i}`}>{`-`}</TableCell>)
          tempRowAction.push(
            <TableCell align="center" key={`noItemAction${i}`}>
              <IconButton
                key={"MoreIcon" + i}
                aria-owns={anchorEl ? "simple-menu" : "defaults"}
                aria-haspopup="true"
                onClick={event =>
                  this.handleClickMenus(event, e._id, i)
                }
              >
                <MoreIcon />
              </IconButton>
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
           )
         }
      }
      rowUser.push(
          <TableRow key={`row${i}`}>
            <TableCell >{e.fullname}</TableCell>
            {tempRowMenu}
            {tempRowTotal}
            {tempRowAction}
          </TableRow>
      )
    })
    return rowUser
  };
  exportPDFWithComponents = () => {
    this.pdfExportComponent.save();
  }
  renderExport = () => {
    const { orderList, winnerTitle } = this.state;
    return (
      <PDFExport
        ref={component => (this.pdfExportComponent = component)}
        fileName={`orderlist.pdf`}
        landscape={false}
        scale={0.6}
        margin="10pt"
        paperSize="A4"
      >
        <div className="export">
          <div className="headerExport">สรุปรายการอาหารทั้งหมด</div>
          <div className="restaurant">{winnerTitle}</div>
          {Object.keys(orderList).map((data, index) => (
            <div className="content">
              <p>{data}</p>
              <p>จำนวน <span>{orderList[data].length}</span> กล่อง</p>
            </div>
          ))}
        </div> 
      </PDFExport>
    )
  }

  componentWillUnmount() {
    this.unset = true;
  }
  render() {
    const { orderList,winnerTitle } = this.state;
    console.log("this.state", orderList);
    return (
      <Container>
        <HeaderChannel display={orderList.length === 0 ? "none" : "flex"}>
          <div className="header">
            <h1>อาหารกลางวัน</h1>
            <div className="content">
              <div className="leftContent">
              <div className="topic">
                  <p className="restaurantName">ชื่อร้านอาหาร : <span>{winnerTitle ? winnerTitle : ''}</span></p>
                </div>
                <div className="date">
                  <p>วันที่ : <span>{moment().format('L')}</span></p>
                </div>
              </div>
              <div className="rightContent">
                <img src="../static/image/pdf-file.png"onClick={this.exportPDFWithComponents} />
              </div>
            </div>
          </div>
        </HeaderChannel>
        {
          orderList && orderList.length === 0? 
          <div>
            <h1>ไม่พบการสั่งสิ้นค้า</h1>
          </div>
          :
          <Content className="orderMenu">
            <form onSubmit={this.submitForm}>
              <Table style={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">ชื่อผู้ใช้</TableCell>
                    <TableCell align="left">เมนูอาหาร</TableCell>
                    <TableCell align="left">จำนวน</TableCell>
                    <TableCell align="center"></TableCell>
                  </TableRow>
                </TableHead> 
                <TableBody>{this.renderItem()}</TableBody>
              </Table>
            </form>
            {this.renderExport()}
          </Content>
        }
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

const Export = styled.div`
  display:flex;
  justify-content: flex-end;
  align-items: center;
  > img {
    width: 1.7vw;
    height: auto;
    margin-right: 4vw;
    &:hover {
      cursor: pointer;
    }
  }
`

const HeaderChannel = styled.div`
  display: flex;
  width:100%;
  > div.header {
    width: 100%;
  }
  > div.header > div.content {
    display: flex;
    flex: 1;
  }
  > div.header > div.content > div.leftContent {
    flex: 1;
    display: flex;
    flex-direction: row;
  }
  > div.header > div.content > div.leftContent > div.topic {
    display: flex;
    align-items:center;
    margin-right: 5vw;
  }
  > div.header > div.content > div.leftContent > div.topic > p {
    margin: 0;
    font-size: 1.3vw;
  }
  > div.header > div.content > div.leftContent > div.date > p {
    margin: 0;
    font-size: 1.3vw;
  } 
  > div.header > div.content > div.rightContent {
    flex: 1;
    display: flex;
    align-items:center;
    justify-content: flex-end;
  }
  > div.header > div.content > div.rightContent > img {
    width: 2vw;
    height: auto;
    margin-right: 3vw;
    display: ${props => props.display || 'flex'};
    &:hover {
      cursor: pointer;
    }
  }
`;

const Content = styled.div`
  > div > div.export > div.headerExport {
    font-size: 24px;
    font-weight: bold;
    margin: 2vw 0;
  }
  > div > div.export > div.restaurant {
    font-size: 18px;
    font-weight: bold;
    margin: 1vw 0;
  }
  > div > div.export > div.content {
    display: -webkit-box;
    width: 50%;
  }
  > div > div.export > div.content > p {
    width: 50%;
  }
`

const FormInput = styled.div``;

const InputVote = styled.input`
  font-size: 1.2vw;
  padding: 1vw;
  margin: 1vw;
  height: 3vw;
  width: 3vw;
`;
