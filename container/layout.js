import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles } from "@material-ui/core/styles";
import Router from "next/router";
import Divider from "@material-ui/core/Divider";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { connect } from "react-redux";
import auth from '../firebase'

const drawerWidth = 200;

const styles = theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: "white"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  toolbar: theme.mixins.toolbar
});

class Layout extends Component {
  state = {
    user: {},
    anchorEl: null
  };
  componentDidMount() {
    const { onSetUsers } = this.props;
    if(auth.currentUser) {
      onSetUsers(auth.currentUser);
      this.setState({ user: auth.currentUser })
    }
  }
  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes , users} = this.props;
    const { user, anchorEl } = this.state;

     return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <LeftHeader>
              <Logo
                src="../static/image/iDAG_logo_E.png"
                onClick={() => Router.push({ pathname: "/home" })}
              />
            </LeftHeader>
            <LeftHeader flexDirection="column" justifyContent="flex-end">
              <UserMenu>
                <LogoUser src="../static/image/dish.png" />
                <TextuserName>{user.displayName}</TextuserName>
              </UserMenu>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={this.handleClose}
              >
                <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                <MenuItem onClick={this.handleClose}>Logout</MenuItem>
              </Menu>
            </LeftHeader>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          className={classes.drawer}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.toolbar} />
          <List>
            {["voteList", "userList", "orderList", "report"].map((e, i) => (
              <div key={"divKey" + i}>
                <ListItem
                  button
                  key={"listItem" + i}
                  onClick={() =>
                    Router.push({ pathname: `/${e.toLowerCase()}` })
                  }
                >
                  <ListItemText primary={e} key={"itemText" + i}>
                    {e}
                  </ListItemText>
                </ListItem>
                <Divider light />
              </div>
            ))}
          </List>
        </Drawer>
        <Content className={classes.content}>
          <div className={classes.toolbar} />
          {this.props.children}
        </Content>
      </div>
    );
  }
}

const Content = styled.div``;

const LeftHeader = styled.div`
  display: flex;
  padding: 0vw 1vw;
  flex: 1;
  justify-content: ${props => props.justifyContent || "flex-start"};
  align-items: ${props => props.justifyContent || "center"};
  flex-direction: ${props => props.flexDirection || "row"};
`;
const Logo = styled.img`
  width: 3.5vw;
  height: 3.5vw;
  cursor: pointer;
`;
const LogoUser = styled.img`
  width: 2vw;
  height: 2vw;
  cursor: pointer;
`
const UserMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
const TextuserName = styled.div`
  font-size: 1.1vw;
  margin: 0;
  color: black;
`;

Layout.propTypes = {
  classes: PropTypes.object.isRequired
};


const mapStateToProps = state => ({
  users: state.userState.users
});

const mapDispatchToProps = dispatch => ({
  onSetUsers: users => dispatch({ type: "USERS_SET", users })
});



export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(Layout));
