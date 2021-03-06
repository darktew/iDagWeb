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
import AddIcon from '@material-ui/icons/Add';


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
    // this.sendNotification();
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
    this.setState({ openEdit: false,openDelete:false ,openVote:false,openAddnew:false});
  };
  handleCloseVote = () => {
    this.setState({ openVote: false });
  }
  handleCloseAddNew = () => {
    this.setState({ openAddnewVote:false })
  }
  handleClickMenus = (event,channelId,channelName) => {
    this.setState({ anchorEl: event.currentTarget, channelId, channelName});
  };
  handleCloseMenus = () => {
    this.setState({ anchorEl: null });
  };
  openVote = () => {
    this.setState({ openVote: true, anchorEl: null });
  }
  submitFormVote = async e => {
    e.preventDefault();
    const { timeCount,channelId } = this.state;
    const userData = await this.getAllUser();
    const setTime = moment().add(timeCount, 'minute');
    database.ref(`channel/${channelId}`).update({
      timeCount: setTime.toString(),
      isVote: true
    })
    axios.post(`http://${window.location.host}/api/votelist`, {
      timeCount: setTime.toString(),
      channelId: channelId,
    });
    axios.post(`http://${window.location.host}/api/sendNotiVote`, {
      userData: userData,
      timeLimit: timeCount
    })
    await localStorage.setItem('timeItem', setTime.toString())
    this.resetVote(channelId);
    this.getChannel({openVote: false})
  }
  getAllUser = () => {
    return new Promise((resolve, reject) => {
      database.ref('user').once('value',snapshot => {
        const data = Object.values(snapshot.val());
        resolve(data);
      })
    })
  }

  resetVote = (channelId) => {
    if(moment().days() !==5) {
      database.ref(`channel/${channelId}/detail`).once('value', snapshot => {
        snapshot.forEach(chlid => {
          chlid.ref.update({
            vote: 0
          })
        })
      })
    } else {
      database.ref(`channel/${channelId}/friDayDetail`).once('value', snapshot => {
        snapshot.forEach(chlid => {
          chlid.ref.update({
            vote: 0
          })
        })
      })
    }
  }
  submitForm = async e => {
    e.preventDefault();
    const { channelId, channelName } = this.state;
    await database.ref(`channel/${channelId}`).update({
      name: channelName
    });
    this.getChannel({openEdit: false})
  };
  submitAddnewForm = async e => {
    e.preventDefault();
    const { channelId, channelName } = this.state;
    await database.ref(`channel/${channelId}`).push({
      name: channelName,
      timeCount : "" ,
      isVote:false
    });
    this.getChannel({openAddnew: false})
  };
  submitOpenForm = async e => {
    e.preventDefault();
    const { channelId, timeCount} = this.state;
    await database.ref(`channel/${channelId}`).update({
      isVote: true ,
      timeCount: timeCount
    });
    this.getChannel({openVote: false})
  };
  submitDeleteForm = async e => {
    e.preventDefault();
    const { channelId} = this.state;
    await database.ref(`channel/${channelId}`).remove({
    });
    this.getChannel({openDelete: false})
  };
  dialogAddnew = () => {
    const { openAddnew } = this.state;
    return (
      <Dialog
        open={openAddnew}
        onClose={this.handleClose}
        aria-labelledby="form-dialog-edit"
      >
        <DialogTitle id="form-dialog-edit">เพิ่มข้อมูล</DialogTitle>
        <form onSubmit={this.submitAddnewForm}>
          <DialogContent>
            <DialogContentText>
              ชื่อ Channel
              <InputForm
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
    const { openEdit, channelName } = this.state;
    return (
      <Dialog
        open={openEdit}
        onClose={this.handleClose}
        aria-labelledby="form-dialog-edit"
      >
        <DialogTitle id="form-dialog-title">{channelName ? "แก้ไขข้อมูล" : "เพิ่มข้อมูล"}</DialogTitle>
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
                  type="number"
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
        <TableRow key={"rows" + i}>
          <TableCell
            align="left"
            onClick={() => this.nextPage(e._id,e.detail)}
            style={{ cursor: "pointer" }}
          >
            {e.name}
          </TableCell>
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
          <button className ="Addnew" onClick={this.openDialogAddnew}>
            <AddIcon />
            เพิ่มรายการโหวต
          </button>
        </HeaderChannel>
        <Table style={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell align="left">ชื่อรายการโหวต</TableCell>
              <TableCell align="left">สถานะ</TableCell>
              <TableCell align="center"></TableCell>
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
const AddNewChanelButton = styled.button`
  cursor: pointer;
  width: fit-content;
  height: 3vw;
  margin: 0 0.5vw;
  color:black;
  background-color:red;
  border-radius:10px;
  font-size:2vw;
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
  > button.Addnew {
    display: flex;
    align-items: center;
    color:white;
    background-color: red;
    width:auto;
    font-size:1.1vw;
    border-radius:5px;
    padding: 0.5vw;
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
  width: 7vw;
`
