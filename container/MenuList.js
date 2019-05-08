import React, { Component } from "react";
import Router, {withRouter} from 'next/router';
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
import IconButton from '@material-ui/core/IconButton'

export class MenuList extends Component {
    constructor(props){
        super(props);
        this.state ={
            detailMenu:[],
            anchorEl:null,
            menuName:'',
            price:0,
            openAddnew:false,
            channelId:'',
            detailId:'',
            openEdit:false,
            openDelete:false,
            uid:'',
            detailMenuId:''
        };
    }
    async componentDidMount() {
        this.getDetail();
      }
      getDetail = (open = {}) => {
        const { router } = this.props;
        const dataId = JSON.parse(router.query.value);
        const channelId = dataId.channelId;
        const detailId = dataId.detailId;
        const result = database.ref(`channel/${channelId}/detail/${detailId}`);
        result.on("value", snapshot => {
          const data = snapshot.val();
          this.setState({ detailMenu: data.menuRes, channelId, detailId , ...open });

        });
      };
      handlemanuName = event => {
        this.setState({ menuName: event.target.value });
      };
      handlePrice = event => {
        this.setState({ price: event.target.value });
      };
      handleClickMenus = (event,detailMenuId,menuName) => {
        this.setState({ anchorEl: event.currentTarget, detailMenuId, menuName});
      };
      handleCloseMenus = () => {
        this.setState({ anchorEl: null });
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
      submitAddnew = async e => {
        e.preventDefault();
        const { router } = this.props;
        const { menuName,price,channelId,detailId,detailMenu } = this.state;
        await database.ref(`channel/${channelId}/detail/${detailId}/menuRes/${detailMenu.length}`).update({
          menuName: menuName,
          price: price
        });
        this.getDetail({openAddnew: false})
      };
      submitEdit = async e => {
        e.preventDefault();
        const { router } = this.props;
        const { menuName,price ,channelId,detailId,detailMenuId} = this.state;
        await database.ref(`channel/${channelId}/detail/${detailId}/menuRes/${detailMenuId}`).update({
            menuName: menuName,
            price: price
        });
        this.getDetail({openEdit: false})
      };
      submitDelete = async e => {
        e.preventDefault();
        const { router } = this.props;
        const {detailMenuId,channelId,detailId} = this.state;
        await database.ref(`channel/${channelId}/detail/${detailId}/menuRes/${detailMenuId}`).remove()
        this.getDetail({openDelete: false})
      };
      dialogAddnew = () => {
        const { openAddnew } = this.state;
        return (
          <Dialog
            open={openAddnew}
            onClose={this.handleCloseAddNew}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">เพิ่มรายการอาหาร</DialogTitle>
            <form onSubmit={this.submitAddnew}>
              <DialogContent>
                <DialogContentText>
                  <InputForm
                    defaultValue={''}
                    onChange={this.handlemanuName}
                  />
                   <InputForm
                    defaultValue={''}
                    onChange={this.handlePrice}
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
      dialogEdit = () => {
        const { openEdit, menuName, detailMenu } = this.state;
        return (
          <Dialog
            open={openEdit}
            onClose={this.handleCloseEdit}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">แก้ไขร้านอาหาร</DialogTitle>
            <form onSubmit={this.submitEdit}>
              <DialogContent>
                <DialogContentText>
                  <InputForm
                    defaultValue={menuName}
                    onChange={this.handlemanuName}
                  />
                   <InputForm
                    defaultValue={''}
                    onChange={this.handlePrice}
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
        const { openDelete, menuName, detailMenu } = this.state;
        return (
          <Dialog
            open={openDelete}
            onClose={this.handleCloseDelete}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">ลบรายการอาหาร</DialogTitle>
            <form onSubmit={this.submitDelete}>
              <DialogContent>
                <DialogContentText>
                    ยืนยันการลบ{menuName}
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
        const { detailMenu,anchorEl,currentVote  } = this.state;
        return detailMenu && detailMenu.map((e, i) => {
          return (
            <TableRow key={"tableRow" + i}>
              <TableCell>{e.menuName}</TableCell>
              <TableCell align="left">{e.price}</TableCell>
              <TableCell align="center">
                <IconButton 
                  key={"MoreIcon" + i}
                  aria-owns={anchorEl ? 'simple-menu' : 'defaults'}
                  aria-haspopup="true"
                  onClick={(event) => this.handleClickMenus(event,i,e.menuName)}
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
                      
                    <MenuItem >
                      <ActionButton onClick={this.openDialogEdit}
                        src="../static/image/pencil-edit-button.png"
                      />
                    </MenuItem>
                    <MenuItem>
                      <ActionButton onClick={this.openDialogDelete}
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
        return (
          <Container>
               <HeaderChannel>
                 <button className ="Addnew" onClick ={this.openDialogAddnew}>เพิ่มเมนูอาหาร</button>
               </HeaderChannel>
            <Table style={{ minWidth: 700 }}>
              <TableHead>
                <TableRow>
                 <TableCell align="left">ชื่อเมนู</TableCell>
                  <TableCell align="left">ราคา</TableCell>
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
    

export default withRouter(MenuList)

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