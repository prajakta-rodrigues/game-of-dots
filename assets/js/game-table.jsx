import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import Konva from 'konva';
import {Stage, Layer, Rect, Text,Line, Circle} from 'react-konva';


class GameTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      linesDrawn: [],
      validLinesRemaining: [],
      currentUserLine: {
        x: 200,
        y : 50,
        key:"currentUserLine",
        strokeWidth:20,
        points : [],
        stroke : "red"
      }
    };

  }

  handleMouseDown() {


    const stage = this.stage.getStage();
    let isDotCheck = new RegExp('^circle');
    if(isDotCheck.test(stage.clickStartShape.attrs.name)) {

      this.drawing = true;
    }

  }

  handleMouseUp() {

    const stage = this.stage.getStage();
    const point = stage.getPointerPosition();
    let isDotCheck = new RegExp('^circle');
    let start = stage.clickStartShape.attrs
    let end = stage.clickEndShape.attrs
    if(isDotCheck.test(start.name) &&
    isDotCheck.test(end.name)) {
      if((start.x == end.x && Math.abs(start.y - end.y) == 100)
      || (start.y == end.y && Math.abs(start.x - end.x) == 100)) {
        let stateCpy = _.cloneDeep(this.state);
        stateCpy.linesDrawn.push({
          x: start.x,
          y : start.y,
          key:"userLine" + start.x + "" + start.y + "" + end.x + "" + end.y,
          strokeWidth:20,
          points : [0, 0, end.x - start.x , end.y - start.y],
          stroke : "black"
        }

        );
        this.setState(stateCpy);
      }

    }
    this.drawing = false;
    let currentUserLine = {
      x: 0,
      y : 0,
      key: "currentUserLine",
      strokeWidth:20,
      points : [],
      stroke : "red"
    }
    let startCpy = _.cloneDeep(this.state);
    startCpy.currentUserLine = currentUserLine;
    this.setState(startCpy);
  }

  handleMouseMove() {
    if(this.drawing) {

      const stage = this.stage.getStage();
      const point = stage.getPointerPosition();
      let start = stage.clickStartShape.attrs;

      let currentUserLine = {
        x: start.x,
        y : start.y,
        key: "currentUserLine" + Math.random(),
        strokeWidth:20,
        points : [0, 0, point.x - start.x, point.y - start.y],
        stroke : "red"
      }
      let startCpy = _.cloneDeep(this.state);
      startCpy.currentUserLine = currentUserLine;
      this.setState(startCpy);
    }

  }


  render() {
    let gridLength = 5;
    let gridBreadth = 5;
    let x = 200;
    let y = 50;
    let grid = [];

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
    for(var i = 0; i <= gridLength; i++) {
      x = 200;
      for (var j = 0; j <= gridBreadth; j++) {
        grid.push(
          <Circle
            x = {x}
            y = {y}
            name = {"circle"+ i + "" + j}
            key={(i)+ ""+ (j)}
            radius = {20}
            fill="#ddd">
          </Circle>
        );
        x += 100;
      }
      y += 100;
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
          <Line
            x = {this.state.currentUserLine.x}
            y = {this.state.currentUserLine.y}
            key = {this.state.currentUserLine.key}
            points = {this.state.currentUserLine.points}
            stroke = {this.state.currentUserLine.stroke}
            strokeWidth = {20}
            >
          </Line>
          {this.state.linesDrawn.map(item => (
            <Line
              x= {item.x}
              y={item.y}
              key={item.key}
              points = {item.points}
              stroke = "black"
              strokeWidth={20}
              >
            </Line>
          ))}
          {grid}


        </Layer>
      </Stage>
    );
  }
}

export default GameTable;
