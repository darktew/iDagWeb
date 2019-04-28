import React, { Component } from "react";
import styled from "styled-components";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles } from "@material-ui/core";
import Router from "next/router";
import Divider from '@material-ui/core/Divider';

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

const Layout = props => {
  const { classes } = props;
  const currentUser = JSON.parse(localStorage.getItem('@user'));
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <LeftHeader>
            <Logo src="../static/image/dish.png" className="logo" onClick={() => Router.push({ pathname: '/home' })} />
          </LeftHeader>
          <LeftHeader flexDirection="column" justifyContent="flex-end">
            <UserMenu>
              <Logo src="../static/image/dish.png" />
              <TextuserName>{currentUser.displayName}</TextuserName>
            </UserMenu>
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
          <div>
            <ListItem
              button
              key={"listItem" + i}
              onClick={() => Router.push({ pathname: `/${e.toLowerCase()}` })}
            >
              <ListItemText primary={e} key={"itemText" + i}>{e}</ListItemText>
            
            </ListItem>
            <Divider light/>
          </div>
          ))}
        </List>
      </Drawer>
      <Content className={classes.content}>
        <div className={classes.toolbar} />
        {props.children}
      </Content>
    </div>
  );
};

const Content = styled.div``;

const LeftHeader = styled.div`
  display: flex;
  padding: 0vw 1vw;
  flex: 1;
  justify-content: ${props => props.justifyContent || "flex-start"}
  align-items: ${props => props.justifyContent || "center"}
  flex-direction: ${props => props.flexDirection || "row"}
`;
const Logo = styled.img`
  width: 2vw;
  height: 2vw;
  cursor: pointer;
`;
const UserMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`
const TextuserName = styled.div`
  font-size: 1.1vw;
  margin: 0;
  color: black
`;

export default withStyles(styles)(Layout);
