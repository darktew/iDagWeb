import React, { Component } from "react";
import auth from "../firebase";
import CircularProgress from "@material-ui/core/CircularProgress";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  progress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: "-50px",
    marginLeft: "-50px",
    width: "100px",
    height: "100px"
  }
});
class Index extends Component {
  async componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        window.location.replace("/home");
      } else {
        window.location.replace("/login");
      }
    });
  }
  render() {
    const { classes } = this.props;
    return <CircularProgress className={classes.progress} style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: "-50px",
      marginLeft: "-50px",
      width: "100px",
      height: "100px"
    }} />;
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles()(Index);
