import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

class ChatBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages : [{name: "system", text: "Welcome to the game"}]
    }
}
    render() {
      let messages = [];
      for(var i = 0; i < this.state.messages.length; i++) {
        messages.push(<span>{this.state.messages[i].name}
           says: {this.state.messages[i].text}</span>);
      }

      return (<div className= "chat-box">
        <div className= "chat-header">Chat Now</div>
        <div className="chat-body">{messages}</div>
        </div>);
    }

}

export default ChatBox;
