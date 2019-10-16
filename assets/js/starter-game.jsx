import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import css from "../css/starter-game.css";

export default function game_init(root, channel) {
  ReactDOM.render(<Starter channel={channel}/>, root);
}

class Starter extends React.Component {
  constructor(props) {
    super(props);
    this.channel = props.channel;
    this.state = {
      
    };
    this.channel
        .join()
        .receive("ok", this.server_response.bind(this))
        .receive("error", resp => { console.log("Unable to join", resp); });

  }


  server_response(view) {
	
  }


  render() {

    return "<h1>Demo</h1>"
  }
}
