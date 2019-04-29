import React, { Component } from "react";
import withRouter from "next/router";
import database from "../firebase/database";
import styled from "styled-components";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

export class VoteList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataChannel: [],
      channelName: "",
      page: 0,
      rowsPerPage: 5,
      open: false,
      channelId: ""
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
      this.setState({ dataChannel: data , ...setProps});
    });
  };

  handleText = event => {
    this.setState({ channelName: event.target.value });
  };
  handleChangePage = (event, page) => {
    this.setState({ page });
  };
  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };
  openDialogEdit = (channelId, channelName) => {
    console.log("open");
    this.setState({ open: true, channelId, channelName });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  submitForm = async e => {
    e.preventDefault();
    const { channelId, channelName } = this.state;
    await database.ref(`channel/${channelId}`).update({
      name: channelName
    });
    this.getChannel({open: false})
  };

  dialogShow = () => {
    const { open, channelName } = this.state;
    return (
      <Dialog
        open={open}
        onClose={this.handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">แก้ไขข้อมูล</DialogTitle>
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

  renderItem = () => {
    const { dataChannel } = this.state;

    return dataChannel.map((e, i) => {
      return (
        <TableRow key={"rows" + i}>
          <TableCell
            align="left"
            onClick={() => console.log("goto ")}
            style={{ cursor: "pointer" }}
          >
            {e.name}
          </TableCell>
          <TableCell>{e.isVote ? "เปิดโหวตแล้ว" : "ยังไม่เปิดโหวต"}</TableCell>
          <TableCell align="center">
            <ActionButton
              onClick={() => this.openDialogEdit(e._id, e.name)}
              src="../static/image/pencil-edit-button.png"
            />
            <ActionButton
              onClick={() => console.log("delete to")}
              src="../static/image/delete.png"
            />
          </TableCell>
        </TableRow>
      );
    });
  };

  render() {
    const { dataChannel, page, rowsPerPage } = this.state;
    return (
      <Container>
        <HeaderChannel>
          asdasd
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
        {this.dialogShow()}
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
  padding: 0.5vw;
  font-size: 1vw;
`;

const HeaderChannel = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0.5vw 5vw 0 0;
`
