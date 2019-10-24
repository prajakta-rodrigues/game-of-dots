import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import Konva from 'konva';
import Portal from './portal'
import {Stage, Layer, Rect, Text,Line, Circle} from 'react-konva';
import css from "../css/game-table.css";

class GameTable extends React.Component {
  constructor(props) {
    super(props);
    this.initX = 200;
    this.initY = 50;
    this.scale = 100
    this.state = {
      type:"square",
      dimensions: {
        length: 5,
        breadth: 5
      },
      linesDrawn: [{x1:0, y1:0, x2:0, y2:1},{x1:0, y1:0, x2:1, y2:0},
        {x1:1, y1:0, x2:1, y2:1},{x1:1, y1:1, x2:0, y2:1},
        {x1:2, y1:2, x2:2, y2:3},{x1:2, y1:3, x2:3, y2:3},
          {x1:3, y1:3, x2:3, y2:2},{x1:3, y1:2, x2:2, y2:2}],
      validLinesRemaining: [],
      loggedInUser: props.userName,
      turn: 0,
      players: [{
        name:"User1",
        color:"blue",
        score: 0,
        boxesAcquired: [
          {x1: 0, y1: 0, x2: 1, y2: 1}
        ]
      },
      {
        name:"User2",
        color:"yellow",
        score: 0,
        boxesAcquired: [
          {x1: 2, y1: 2, x2: 3, y2: 3},
          {x1: 0, y1: 1, x2: 1, y2 : 2}
        ]
      }
    ],
      currentUserLine: {
        x: 0,
        y : 0,
        key:"currentUserLine",

        points : [],
        stroke : "red"
      }
    };

  }

  handleMouseDown() {
    if(this.state.loggedInUser == this.state.players[this.state.turn].name) {
      const stage = this.stage.getStage();
      let isDotCheck = new RegExp('^circle');
      if(isDotCheck.test(stage.clickStartShape.attrs.name)) {

        this.drawing = true;
      }
    }
  }

  handleMouseUp() {
    if(this.state.loggedInUser == this.state.players[this.state.turn].name) {
    const stage = this.stage.getStage();
    const point = stage.getPointerPosition();
    let isDotCheck = new RegExp('^circle');
    let start = stage.clickStartShape.attrs
    let end = stage.clickEndShape.attrs
    console.log(start.x, start.y, end.x, end.y);
    console.log((start.x - this.initX)/ this.scale);
    console.log((start.y - this.initY)/ this.scale);
    if(isDotCheck.test(start.name) &&
    isDotCheck.test(end.name)) {
      if((start.x == end.x && Math.abs(start.y - end.y) == this.scale)
      || (start.y == end.y && Math.abs(start.x - end.x) == this.scale)) {
        let stateCpy = _.cloneDeep(this.state);
        stateCpy.linesDrawn.push({
          x1: (start.x - this.initX)/ this.scale ,
          y1: (start.y - this.initY)/ this.scale,
          x2: (end.x - this.initX) / this.scale,
          y2: (end.y - this.initY) / this.scale
        }
        );
        console.log(stateCpy.linesDrawn[1]);
        console.log(stateCpy.linesDrawn[0]);
        stateCpy.turn = (stateCpy.turn + 1) % stateCpy.players.length;
        this.setState(stateCpy);
      }

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

  handleMouseMove() {
    if(this.state.loggedInUser == this.state.players[this.state.turn].name
      && this.drawing) {

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


  render() {
    let gridLength = this.state.dimensions.length;
    let gridBreadth = this.state.dimensions.breadth;
    let x = 0;
    let y = 0;
    let grid = [];
    let drawnLines = [];
    let boxes = [];
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

    // grid.push(
    //   <Rect
    //     x = {200}
    //     key = "rect123"
    //     y = {50}
    //     width = {500}
    //     height = {500}
    //     fill="pink">
    //   </Rect>
    // );
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

    return (

      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
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
                {this.state.players.map(item => (
                  <div key={item.name + item.color} className="info">
                    <h3 key={item.name}>Name: {item.name}</h3>
                      <h3 key={item.color}>Color: {item.color}</h3>
                      <h3 key={item.score}>Score: {item.score}</h3>
                  </div>

            ))}
              <h2>Turn: {this.state.players[this.state.turn].name}</h2>
            </div>
          </Portal>
          <Line
            x = {this.state.currentUserLine.x}
            y = {this.state.currentUserLine.y}
            key = {this.state.currentUserLine.key}
            points = {this.state.currentUserLine.points}
            stroke = {this.state.currentUserLine.stroke}

            >
          </Line>
          {drawnLines}
          {boxes}
          {grid}


        </Layer>
      </Stage>
    );
  }
}

export default GameTable;
