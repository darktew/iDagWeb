import React, { Component } from "react";
import Router, {withRouter} from 'next/router';
import database from "../firebase/database";

export class MenuList extends Component {
    constructor(props){
        super(props);
        this.state ={
            detailMenu:[]
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
          this.setState({ detailMenu: data.menuRes, ...open });
        });
      };

  render() {
    return (
      <div>
        
      </div>
    )
  }
}

export default withRouter(MenuList)