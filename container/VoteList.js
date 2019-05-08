import React, { Component } from "react";
import withRouter from "next/router";
import axios from 'axios';
import moment from 'moment';
import database from "../firebase/database";
import styled from "styled-components";
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



export class VoteList extends Component {
  getInitialProps = async () => {
    await fetch(`${window.location.host}/api/votelist`);
  }
  constructor(props) {
    super(props);
    this.state = {
      dataChannel: [],
      channelName: "",
      page: 0,
      rowsPerPage: 5,
      open: false,
      channelId: "",
      anchorEl: null,
      openVote: false,
      openAddnewVote: false,
      openDelete:false,
      timeCount: ''
    };
  }
  async componentDidMount() {
    this.getChannel();
  }

  getChannel = (setProps = {}) => {
    const dataChannel = database.ref("channel");
    dataChannel.on("value", snapshot => {
      const keys = Object.keys(snapshot.val());
      const data = keys.map(key => ({ _id: key, ...snapshot.val()[key] }));
      !this.unset && this.setState({ dataChannel: data , ...setProps});
    });
  };

  handleText = event => {
    this.setState({ channelName: event.target.value });
  };
  handleAddnew = event => {
    this.setState({ channelName: event.target.value });
  };
  handleTimeCount = event => {
    this.setState({ timeCount: event.target.value });
  }
  handleChangePage = (event, page) => {
    this.setState({ page });
  };
  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };
  openDialogEdit = () => {
    this.setState({ open: true , anchorEl: null});
  };
  openDialogAddnew =() => {
    this.setState({ openAddnewVote: true , anchorEl: null});
  };
  openDialogDelete =() =>{
    this.setState({openDelete:true , anchorEl:null})
  }
  handleCloseDelete = () =>{
    this.setState({ openDelete:false })
  }
  handleClose = () => {
    this.setState({ open: false });
  };
  handleCloseVote = () => {
    this.setState({ openVote: false });
  }
  handleCloseAddNew = () => {
    this.setState({ openAddnewVote:false })
  }
  handleClickMenus = (event,channelId,channelName) => {
    this.setState({ anchorEl: event.currentTarget, channelId, channelName});
    console.log("Statset",channelId,channelName)
  };
  handleCloseMenus = () => {
    this.setState({ anchorEl: null });
  };
  openVote = () => {
    this.setState({ openVote: true, anchorEl: null });
  }
  submitFormVote = async e => {
    e.preventDefault();
    const { timeCount,channelId } = this.state
    const setTime = moment().add(timeCount, 'minute');
    await database.ref(`channel/${channelId}`).update({
      timeCount: setTime.toString(),
      isVote: true
    })
    axios.post(`http://${window.location.host}/api/votelist`, {
      timeCount: setTime.toString(),
      channelId: channelId
    });
    this.getChannel({openVote: false})
  }
  submitForm = async e => {
    e.preventDefault();
    const { channelId, channelName } = this.state;
    await database.ref(`channel/${channelId}`).update({
      name: channelName
    });
    this.getChannel({open: false})
  };
  submitAddnew = async e => {
    e.preventDefault();
    const { channelId, channelName } = this.state;
    await database.ref(`channel/${channelId}`).push({
      name: channelName,
      isVote:false,
      timeCount:""
    });
    this.getChannel({openAddnewVote: false})
  };
  submitDelete = async e => {
    e.preventDefault();
    const { channelId, channelName } = this.state;
    await database.ref(`channel/${channelId}`).remove();
    this.getChannel({openDelete: false})
  };

  nextPage = (id,value) => {
    Router.push({
      pathname: '/channelDetail',
      query: {
        _id: id
      }
    })
  }

  dialogShow = () => {
    const { open, channelName } = this.state;
    return (
      <Dialog
        open={open}
        onClose={this.handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{channelName ? "แก้ไขข้อมูล" : "เพิ่มข้อมู,"}</DialogTitle>
        <form onSubmit={this.submitForm}>
          <DialogContent>
            <DialogContentText>
              <InputForm
                defaultValue={channelName ? channelName : ''}
                onChange={this.handleText}
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary">
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
  dialogAddnew = () => {
    const { openAddnewVote, channelName } = this.state;
    return (
      <Dialog
        open={openAddnewVote}
        onClose={this.handleCloseAddNew}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title" >เพิ่มข้อมูลโหวต</DialogTitle>
        <form onSubmit={this.submitAddnew}>
          <DialogContent>
            <DialogContentText>
              ชื่อการโหวต : 
              <InputForm
                defaultValue={''}
                onChange={this.handleAddnew}
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
  dialogDelete = () => {
    const { openDelete, channelName } = this.state;
    return (
      <Dialog
        open={openDelete}
        onClose={this.handleCloseDelete}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title" >ลบข้อมูล {channelName}</DialogTitle>
        <form onSubmit={this.submitDelete}>
          <DialogContent>
            <DialogContentText>
              ยืนยันการลบ {channelName}
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
  componentWillUnmount() {
    this.unset = true;
  }
  dialogVoteShow = () => {
    const { openVote, timeCount } = this.state;
    return (
      <Dialog
        open={openVote}
        onClose={this.handleCloseVote}
        aria-labelledby="form-dialog-title"
      >
      <DialogTitle id="form-dialog-title">เปิดโหวต</DialogTitle>
      <form onSubmit={this.submitFormVote}>
        <DialogContent>
          <DialogContentText>
              <FormVote>
                <p>เวลาในการโหวต</p>
                <InputVote
                  defaultValue={timeCount ? timeCount : ''}
                  onChange={this.handleTimeCount}
                  required
                />
                <p>นาที</p>
              </FormVote>
            <DialogActions>
              <Button onClick={this.handleCloseVote} color="secondary">
                ยกเลิก
              </Button>
              <Button type="submit" color="inherit">
                บันทึก
              </Button>
          </DialogActions>
          </DialogContentText>
        </DialogContent>
      </form>
      </Dialog>
    )
  }

  renderItem = () => {
    const { dataChannel, anchorEl } = this.state;
    return dataChannel.map((e, i) => {
      return (
<<<<<<< HEAD
        <TableRow key={"rows" + i} >
          <TableCell 
          align="left"
          onClick={() => this.nextPage(e._id,e.detail)} style={{ cursor: "pointer" }}
          >{e.name}</TableCell>
=======
        <TableRow key={"rows" + i}>
          <TableCell
            align="left"
            onClick={() => this.nextPage(e._id,e.detail)}
            style={{ cursor: "pointer" }}
          >
            {e.name}
          </TableCell>
>>>>>>> pick
          <TableCell>{e.isVote ? "เปิดโหวตแล้ว" : "ยังไม่เปิดโหวต"}</TableCell>
          <TableCell align="center">
            <IconButton 
              key={"MoreIcon" + i}
              aria-owns={anchorEl ? 'simple-menu' : 'defaults'}
              aria-haspopup="true"
              onClick={(event) => this.handleClickMenus(event,e._id,e.name)}
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
                <MenuItem onClick={this.openVote}>
                  <ActionButton
                    src="../static/image/positive-vote.png"
                  />
                </MenuItem>
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
        </TableRow>
      );
    });
  };

  render() {
    const { dataChannel, page, rowsPerPage, open } = this.state;
    return (
      <Container>
        <HeaderChannel>
          <button className ="Addnew" onClick={this.openDialogAddnew}>เพิ่มข้อมูลการโหวต</button>
        </HeaderChannel>
        <Table style={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell align="left">ChannelName</TableCell>
              <TableCell align="left">StatusVote</TableCell>
              <TableCell align="center">action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{this.renderItem()}</TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={dataChannel.length}
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

        { open ?
          this.dialogShow() :
          this.dialogVoteShow()
        }
         {this.dialogAddnew()}
         {this.dialogDelete()}
      </Container>
    );
  }
}

export default VoteList;

////////////////////////////
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
  padding: 1vw;
  margin: 1vw;
  height: 3vw;
  width: 3vw;
`
