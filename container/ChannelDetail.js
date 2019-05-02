import React, { Component } from "react";
import database from "../firebase/database";
import * as moment from "moment";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import IconButton from '@material-ui/core/IconButton';
import styled from "styled-components";

export class ChannelDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailChannel: []
    };
  }
  async componentDidMount() {
    this.getDetailChannel();
  }

  getDetailChannel = () => {
    const { query } = this.props;
    const result = database.ref(`channel/${query._id}`);
    result.on("value", snapshot => {
      const data = snapshot.val();
      if (moment().day() === 5) {
        this.setState({ detailChannel: data.friDayDetail });
      } else {
        this.setState({ detailChannel: data.detail });
      }
    });
  };
  renderDetail = () => {
    const { detailChannel } = this.state;
    return detailChannel.map((e, i) => {
      return (
        <TableRow>
          <TableCell>{e.nameTitle}</TableCell>
          <TableCell align="left">{e.type}</TableCell>
          <TableCell align="left">{`${e.vote} โหวต`}</TableCell>
          <TableCell align="center"><MoreIcon /></TableCell>
        </TableRow>
      );
    });
  };
  render() {
    return (
      <Container>
        <Table style={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell align="left">ชื่อร้าน</TableCell>
              <TableCell align="left">ประเภทร้าน</TableCell>
              <TableCell align="left">คะแนนโหวต</TableCell>
              <TableCell align="center">action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{this.renderDetail()}</TableBody>
        </Table>
      </Container>
    );
  }
}

export default ChannelDetail;

/////////////////////////////////////

const Container = styled.div``;

const ActionButton = styled.img`
    width: 2vw;
    height: 2vw;
`
