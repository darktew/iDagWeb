import React, { Component } from "react";
import database from "../firebase/database";
import auth from '../firebase/index';
import * as moment from "moment";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import MoreIcon from '@material-ui/icons/MoreVert';
import styled from "styled-components";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Router, {withRouter} from 'next/router'
export class ChannelDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailChannel: [],
      openAddnew:false,
      anchorEl:null,
      detailId:"",
      nameTitle:"",
      type:"",
      anchorEl:null,
      openEdit:false,
      openDelete:false,
      currentVote: null,
      uid: ''
    };
  }
 
  async componentDidMount() {
    await this.getCurrentVote(auth.currentUser.uid);
    await this.getDetailChannel();
  }
  getDetailChannel = (open = {}) => {
    const { router } = this.props;
    const { currentVote } = this.state;
    const result = database.ref(`channel/${router.query._id}`);
    result.on("value", snapshot => {
      const data = snapshot.val();
      if (moment().day() === 5) {
        if(currentVote) {
          data.detail[currentVote - 1].isVote = true;
        }
        !this.unset &&  this.setState({ detailChannel: data.friDayDetail, ...open });
      } else {
        if(currentVote) {
          data.detail[currentVote - 1].isVote = true;
        }
        !this.unset && this.setState({ detailChannel: data.detail, ...open });
      }
    });
  };
  getCurrentVote = (uid) => {
    database.ref(`user/${uid}`).on('value', (snapshot) => {
        const currentUser = snapshot.val();
        !this.unset && this.setState({ currentVote: currentUser.currentVote, uid });
    })
  };
 
  handleName = event => {
    this.setState({ nameTitle: event.target.value });
  };
  handleType = event => {
    this.setState({ type: event.target.value });
  };
  openDialogAddnew =() => {
    this.setState({ openAddnew: true , anchorEl: null});
  };
  openDialogEdit = () => {
    this.setState({ openEdit: true , anchorEl: null});
  };
  openDialogDelete = () => {
    this.setState({ openDelete: true , anchorEl: null});
  };
  handleCloseAddNew = () => {
    this.setState({ openAddnew:false })
  }
  handleCloseEdit = () => {
    this.setState({ openEdit: false });
  };
  handleCloseDelete = () => {
    this.setState({ openDelete: false });
  };
  handleClickMenus = (event,detailId,nameTitle) => {
    this.setState({ anchorEl: event.currentTarget, detailId, nameTitle});
  };
  handleCloseMenus = () => {
    this.setState({ anchorEl: null });
  };
  submitEdit = async e => {
    e.preventDefault();
    const { router } = this.props;
    const { nameTitle,type ,detailId} = this.state;
    await database.ref(`channel/${router.query._id}/detail/${detailId}`).update({
      nameTitle: nameTitle,
      type:type
    });
    this.getDetailChannel({openEdit: false})
  };
  submitDelete = async e => {
    e.preventDefault();
    const { router } = this.props;
    const {detailId} = this.state;
    await database.ref(`channel/${router.query._id}/detail/${detailId}`).remove();
    this.getDetailChannel({openDelete: false})
  };
  submitAddnew = async e => {
    e.preventDefault();
    const { router } = this.props;
    const { detailChannel,nameTitle,type } = this.state;
    await database.ref(`channel/${router.query._id}/detail/${detailChannel.length}`).update({
      nameTitle: nameTitle,
      imageRes: "",
      type:type,
      vote:0
    });
    this.getDetailChannel({openAddnew: false})
  };

  nextPage = (id) => {
    const { router } = this.props;
    Router.push({
      pathname: '/menuList',
      query: {
        value: JSON.stringify({
          channelId: router.query._id,
          detailId: id
        })
      }
    })
  }
 
setCurrentVote = (index, type) => {
    const { currentVote, detailChannel, uid } = this.state;
    const { router } = this.props;
    let newData;
    if (type === "add") {
      newData = detailChannel.map((store, idx) => {
        if (
          (!currentVote && idx === index) ||
          (currentVote && currentVote !== index + 1 && idx === index)
        ) {
          store.vote += 1;
          store.isVote = true;
        } else if (
          currentVote &&
          currentVote !== index + 1 &&
          (idx + 1 === currentVote && store.vote)
        ) {
          store.vote -= 1;
          store.isVote = false;
        }
        if(new Date().getDay() === 5) {
          database
          .ref(`channel/${router.query._id}/friDayDetail/${idx}`)
          .update({
            vote: store.vote
          });
        } else {
          database
          .ref(`channel/${router.query._id}/detail/${idx}`)
          .update({
            vote: store.vote
          });
        }
        database
        .ref(`user/${uid}`)
        .update({
          currentVote: index + 1
        });
        return store;
      });
      this.setState({ currentVote: index + 1, detailChannel: newData });
    } else {
      newData = detailChannel.map((store, idx) => {
        if (store.vote && idx === index) {
          store.vote -= 1;
        }
        store.isVote = false;
        database
          .ref(`channel/${router.query._id}/detail/${idx}`)
          .update({
            vote: store.vote
          });
        database
          .ref(`user/${uid}`)
          .update({
            currentVote: ""
          });
        return store;
      });
      this.setState({ currentVote: null, data: newData});
    }
  };
  onVote = (index) => {
    const { currentVote } = this.state;
    if(!currentVote || (currentVote && currentVote !== index + 1)) {
      this.setCurrentVote(index, "add");
    } else {
      this.setCurrentVote(index, "cancel");
    }

  }
  dialogAddnew = () => {
    const { openAddnew } = this.state;
    return (
      <Dialog
        open={openAddnew}
        onClose={this.handleCloseAddNew}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">เพิ่มร้านอาหาร</DialogTitle>
        <form onSubmit={this.submitAddnew}>
          <DialogContent>
            <DialogContentText>
              <InputForm
                defaultValue={''}
                onChange={this.handleName}
              />
               <InputForm
                defaultValue={''}
                onChange={this.handleType}
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseAddNew} color="secondary">
              ยกเลิก
            </Button>
            <Button type="submit" color="inherit">
              บันทึก
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  };


  componentWillUnmount() {
    this.unset = true;
  }

  dialogEdit = () => {
    const { openEdit, nameTitle,type, detailId } = this.state;
    return (
      <Dialog
        open={openEdit}
        onClose={this.handleCloseEdit}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">เพิ่มร้านอาหาร</DialogTitle>
        <form onSubmit={this.submitEdit}>
          <DialogContent>
            <DialogContentText>
              <InputForm
                defaultValue={nameTitle}
                onChange={this.handleName}
              />
               <InputForm
                defaultValue={type}
                onChange={this.handleType}
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseEdit} color="secondary">
              ยกเลิก
            </Button>
            <Button type="submit" color="inherit">
              บันทึก
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  };

  dialogDelete = () => {
    const { openDelete, nameTitle, detailId } = this.state;
    return (
      <Dialog
        open={openDelete}
        onClose={this.handleCloseDelete}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">เพิ่มร้านอาหาร</DialogTitle>
        <form onSubmit={this.submitDelete}>
          <DialogContent>
            <DialogContentText>
                ยืนยันการลบ{nameTitle}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseDelete} color="secondary">
              ยกเลิก
            </Button>
            <Button type="submit" color="inherit">
              บันทึก
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  };



  renderDetail = () => {
    const { detailChannel,anchorEl,currentVote  } = this.state;
    return detailChannel && detailChannel.map((e, i) => {
      return (
        <TableRow key={"tableRow" + i} onClick={() => this.nextPage(i)} style={{ cursor: "pointer" }}>
        <TableCell>
          <ActionButton src={e.isVote ? "../static/image/positive-vote-active.png" : "../static/image/positive-vote.png"} onClick={() => this.onVote(i)}/>
        </TableCell> 
          <TableCell>{e.nameTitle}</TableCell>
          <TableCell align="left">{e.type}</TableCell>
          <TableCell align="left">{`${e.vote} โหวต`}</TableCell>
          <TableCell align="center">
          <TableCell align="center">
            <IconButton 
              key={"MoreIcon" + i}
              aria-owns={anchorEl ? 'simple-menu' : 'defaults'}
              aria-haspopup="true"
              onClick={(event) => this.handleClickMenus(event,i,e.nameTitle)}
              >
              <MoreIcon />
            </IconButton>
              <Menu
                key={"Menu Items" + i}
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={this.handleCloseMenus}
              >
                  
                <MenuItem onClick={this.openDialogEdit}>
                  <ActionButton
                    src="../static/image/pencil-edit-button.png"
                  />
                </MenuItem>
                <MenuItem onClick={this.openDialogDelete}>
                  <ActionButton
                    src="../static/image/delete.png"
                  />
                </MenuItem>
              </Menu>
          </TableCell>
          
          </TableCell>
        </TableRow>
      );
    });
  };
  render() {
    return (
      <Container>
        <HeaderChannel>
        <button className ="Addnew" onClick={this.openDialogAddnew}>เพิ่มร้านอาหาร</button>
        </HeaderChannel>
        <Table style={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
             <TableCell align="left">โหวต</TableCell>
              <TableCell align="left">ชื่อร้าน</TableCell>
              <TableCell align="left">ประเภทร้าน</TableCell>
              <TableCell align="left">คะแนนโหวต</TableCell>
              <TableCell align="center">action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{this.renderDetail()}</TableBody>
        </Table>
        {this.dialogAddnew()}
        {this.dialogEdit()}
        {this.dialogDelete()}
      </Container>
    );
  }
}

export default withRouter(ChannelDetail);

/////////////////////////////////////

const Container = styled.div``;

const ActionButton = styled.img`
  cursor: pointer;
  width: 1.5vw;
  height: 1.5vw;
  margin: 0 0.5vw;
`;

const InputForm = styled.input`
  padding: 0.5vw;
  font-size: 1vw;
`;

const HeaderChannel = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0.5vw 5vw 0 0;
  > button.Addnew {
    color:white;
    background-color: #F41B00;
    width:10vw;
    font-size:1.5vw;
    border-radius:5px;
  }
`

const FormVote = styled.div`
  display: flex;
  align-items: center;
`

const InputVote = styled.input`
  font-size: 1.2vw;
  padding: 0.5vw;
  margin: 1vw;
  height: 3vw;
  width: 3vw;
`
