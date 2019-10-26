import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import Konva from 'konva';
import Portal from './portal'
import {Stage, Layer, Rect, Text,Line, Circle} from 'react-konva';
import css from "../css/game-table.css";
import ChatBox from "./chat-box";

class GameTable extends React.Component {
  constructor(props) {
    super(props);
    this.props = props
    this.initX = 200;
    this.initY = 50;
    this.scale = 100;

    console.log(props.userName)
    console.log(props.tableName)
    this.channel = props.channel;
    console.log(this.channel);
    this.state = {
      ownerId:"User1",
      tableName:"",
      gameStarted: false,
      gameOver: false,
      dimensions: {
        length: 5,
        breadth: 5
      },
      linesDrawn: [],
      validLinesRemaining: [],
      turn: 0,
      players: [{
        name:"User1",
        color:"blue",
        score: 0,
        boxesAcquired: [
        ]
      }
    ],
    messages:[]
    };

    this.channel
        .join()
        .receive("ok", this.got_view.bind(this))
        .receive("error", resp => { console.log("Unable to join", resp); });

        this.channel.on("gamechanged",payload=>
        {let game = payload.game;
          console.log("broadcast!!!!!!!!!!");
          console.log(game);
          if(game.gameOver) {
            let maxScore = -1;
            let winner = [];
            for (var i = 0; i < this.state.players.length; i++) {
              if(this.state.players[i].score > maxScore) {
                maxScore = this.state.players[i].score;
              }
            }
            for (var i = 0; i < this.state.players.length; i++) {
              if(this.state.players[i].score == maxScore) {
                winner.push(this.state.players[i].name);
              }
            }
            game.winner = winner
            console.log("afte cal", game.winner);
          }
          this.setState(game);
        });

        this.channel.on("sendmessage",payload=>
        {let game = payload.game;
          console.log("msg received");
          console.log(game.messages);
          this.setState(game);
          console.log(game)
        });


        this.channel.on("gamereset",payload=>
        {let game = payload.game;
          console.log("broadcast game reset!!!!!!!!!!");
          console.log(game);
          this.setState(game);
        });

  }

  got_view(view) {
    console.log("new view", view);
    this.setState(view.game);
  }

  handleMouseDown() {
    if(this.props.userName == this.state.players[this.state.turn].name
    && this.state.gameStarted && !this.state.gameOver) {
      const stage = this.stage.getStage();
      let isDotCheck = new RegExp('^circle');
      if(isDotCheck.test(stage.clickStartShape.attrs.name)) {

        this.drawing = true;
      }
    }
  }

  handleMouseUp() {
    if(this.props.userName == this.state.players[this.state.turn].name
      && this.state.gameStarted && !this.state.gameOver) {
    const stage = this.stage.getStage();
    const point = stage.getPointerPosition();
    let isDotCheck = new RegExp('^circle');
    let start = stage.clickStartShape.attrs
    let end = stage.clickEndShape.attrs
    if(isDotCheck.test(start.name) &&
    isDotCheck.test(end.name)) {
      let now = {
        x1: (start.x - this.initX)/ this.scale ,
        y1: (start.y - this.initY)/ this.scale,
        x2: (end.x - this.initX) / this.scale,
        y2: (end.y - this.initY) / this.scale
      }


        console.log("Seeeeeeeee tisss add meee");
        let stateCpy = _.cloneDeep(this.state);
        this.channel.push("draw", {input: now,
          name:this.state.tableName, user:this.props.userName})
          .receive("ok", this.got_view.bind(this));
        this.setState(stateCpy);


    }
    this.drawing = false;
    let currentUserLine = {
      x: 0,
      y : 0,
      key: "currentUserLine",

      points : [],
      stroke : "red"
    }
    let startCpy = _.cloneDeep(this.state);
    startCpy.currentUserLine = currentUserLine;
    this.setState(startCpy);
  }
  }

  containsObject(object, list) {
      var i;
      console.log("hereee");
      console.log(object);
      console.log(list);
      console.log("hereee");
      for (i = 0; i < list.length; i++) {
          if (list[i].x1 == object.x1 && list[i].x2 == object.x2
            && list[i].y1 == object.y1 && list[i].y2 == object.y2) {
              return true;
          }
      }

      return false;
  }

  handleMouseMove() {
    if(this.props.userName == this.state.players[this.state.turn].name
      && this.drawing && this.state.gameStarted && !this.state.gameOver) {

      const stage = this.stage.getStage();
      const point = stage.getPointerPosition();
      let start = stage.clickStartShape.attrs;

      let currentUserLine = {
        x: start.x,
        y : start.y,
        key: "currentUserLine" + Math.random(),

        points : [0, 0, point.x - start.x, point.y - start.y],
        stroke : this.state.players[this.state.turn].color
      }
      let startCpy = _.cloneDeep(this.state);
      startCpy.currentUserLine = currentUserLine;
      this.setState(startCpy);
    }

  }

  sendMessage() {
    console.log("inside send")
    var input = document.getElementById("snd-msg").value;
    console.log(this.channel);
    console.log(input);
    console.log("look here");
    this.channel.push("send-msg", {input: input,
      name: this.state.tableName, user:this.props.userName})
      .receive("ok", console.log("received"));
  }


startGame() {
  console.log("game started");
  this.channel.push("start-game", {name:this.state.tableName,
    user:this.props.userName})
    .receive("ok", this.got_view.bind(this));
}

resetGame() {
  console.log("reset game table");
  this.channel.push("reset-game", {name:this.state.tableName,
    user:this.props.userName})
    .receive("ok", this.got_view.bind(this));
}

  render() {
    let gridLength = this.state.dimensions.length;
    let gridBreadth = this.state.dimensions.breadth;
    let x = 0;
    let y = 0;
    let grid = [];
    let drawnLines = [];
    let boxes = [];
    let winners = [];
    let messages = [];
    for(var i = 0; i < this.state.messages.length; i++) {
      messages.push(<h5>{this.state.messages[i].name}
         says: {this.state.messages[i].text}</h5>);
    }
    console.log("messages" , messages);

        if(this.state.hasOwnProperty("winner")) {
          winners.push(<h2 key="gmOver">Game Over!</h2>)
            winners.push(<h2 key="winners">Winners are:</h2>)
          for (var i = 0; i < this.state.winner.length; i++) {
            winners.push(<h3>{this.state.winner[i]}</h3>)
          }
          console.log(this.state.winner.length);
          console.log("heyyyyy winners",winners);
        }



    for(var i = 0; i < this.state.linesDrawn.length ; i++) {
      drawnLines.push(<Line
        x = {(this.scale * this.state.linesDrawn[i].x1) + this.initX}
        y = {(this.scale * this.state.linesDrawn[i].y1) + this.initY}
        key = {this.state.linesDrawn[i].x1 + "" +
          this.state.linesDrawn[i].y1 + "" +
          this.state.linesDrawn[i].x2 + "" +
          this.state.linesDrawn[i].y2}
        points = {[0, 0, this.scale * (this.state.linesDrawn[i].x2
          - this.state.linesDrawn[i].x1), this.scale * (this.state.linesDrawn[i].y2
          - this.state.linesDrawn[i].y1)]}
        stroke = "black"
        >
      </Line>
    );
    }

    for(var i = 0; i < this.state.players.length; i++) {
      for(var j = 0; j < this.state.players[i].boxesAcquired.length; j++) {
          let box =  this.state.players[i].boxesAcquired[j];
          boxes.push(<Line
            x={(this.scale * box.x1) + this.initX}
            y={(this.scale * box.y1) + this.initY}
            key= {"box" + box.x1 + "" + box.x2 + "" + box.y1 + "" + box.y2}
            points={[0, 0, this.scale * (box.x2 - box.x1), 0,
              this.scale * (box.x2 - box.x1),
              this.scale * (box.y2 - box.y1), 0,
              this.scale * (box.y2 - box.y1)]}
            closed
            stroke="black"
            fill = {this.state.players[i].color}
          />);
      }
    }

    console.log(boxes);
    console.log(drawnLines);

    for(var i = 0; i < gridLength; i++) {
      for (var j = 0; j < gridBreadth; j++) {
        grid.push(
          <Circle
            x = {this.initX + (i)*100}
            y = {this.initY + (j)*100}
            name = {"circle"+ i + "" + j}
            key={(i)+ ""+ (j)}
            radius = {10}
            fill="#ddd">
          </Circle>
        );
        x += 1;
      }
      y += 1;
    }
    let currentLine = null;
    if('currentUserLine' in this.state) {
      currentLine = <Line
        x = {this.state.currentUserLine.x}
        y = {this.state.currentUserLine.y}
        key = {this.state.currentUserLine.key}
        points = {this.state.currentUserLine.points}
        stroke = {this.state.currentUserLine.stroke}
        >
      </Line>
    }

    return (

      <Stage
        width={window.innerWidth - 300}
        height={300}
        onContentMouseDown={this.handleMouseDown.bind(this)}
        onContentMouseUp={this.handleMouseUp.bind(this)}
        onContentMouseMove = {this.handleMouseMove.bind(this)}
        ref = {node =>
          {
              this.stage = node;
          }
        }>
        <Layer>
          <Portal>
            <div className="turn">
              <div className="row">
                <div className="column">Name:</div>
                <div className="column">Color:</div>
                <div className="column">Score:</div>
                </div>

                {this.state.players.map(item => (
                  <div key={item.name + item.color} className="info">
                    <div key={"row" + item.name + item.color} className="row">
                      <div key={item.name} className="column">{item.name}</div>
                      <div key={item.color} className="column">{item.color}</div>
                      <div key={item.score} className="column">{item.score}</div>
                    </div>
                  </div>

            ))}

              <div>Turn: {this.state.players[this.state.turn].name}</div>
              {this.state.gameStarted || this.state.ownerId
                != this.props.userName ? null:
                <button onClick={this.startGame.bind(this)}>Start game</button>}
                {this.state.gameOver && this.state.ownerId
                  == this.props.userName ?  <button
                  onClick={this.resetGame.bind(this)}>Reset Game</button>:null}

            </div>
            {this.state.gameOver? <div>{winners}</div> : null}
            <div className= "chat-box">
              <div className= "chat-header">Chat Now</div>
              <div className="chat-body">
                <div className="chat-messages"> {messages}
                </div>
                <div className="history">
                  <input type="text" placeholder="Type your message..."
                     className="mr-sm-2" id="snd-msg"/>
                     </div>
                    <div className="send">
                  <button onClick={this.sendMessage.bind(this)}>Send</button>
                  </div>
              </div>
              </div>
          </Portal>
          {currentLine}
          {drawnLines}
          {boxes}
          {grid}


        </Layer>
      </Stage>
    );
  }
}

export default GameTable;
