import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

class ChatBox extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      messages : [{name: "system", text: "Welcome to the game"}],
      currentMessage: ""
    }

    this.channel.on("sendmessage",payload=>
    {let game = payload.game;
      console.log("msg received");
      console.log(game.messages);
      let stateCpy = {
        messages : game.messages,
        currentMessage: ""
      }
      this.setState(stateCpy);
    });
}

inputChange(e) {
  let currentMessage = e.target.value;
  let stateCpy = cloneDeep(this.state);
  stateCpy.currentMessage = currentMessage;
  this.setState(stateCpy);
}

sendMessage() {
  this.props.channel.push("send-msg", {input: this.state.currentMessage,
    name:this.props.tableName, user:this.props.userName})
    .receive("ok", this.got_view.bind(this));
}

    render() {
      let messages = [];
      for(var i = 0; i < this.state.messages.length; i++) {
        messages.push(<span>{this.state.messages[i].name}
           says: {this.state.messages[i].text}</span>);
      }

      return (<div className= "chat-box">
        <div className= "chat-header">Chat Now</div>
        <div className="chat-body">
          <div className="chat-messages"> {messages}>
          </div>
            <input type="text" placeholder="Type your message..."
              onChange={(e) => this.inputChange(e)} className="mr-sm-2" />
            <button onClick={this.sendMessage.bind(this)}></button>
        </div>
        </div>);
    }

}

export default ChatBox;
