import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import css from "../css/starter-game.css";
import logo from "../images/boxes.jpg";
import question from "../images/question.png";
import GameTable from "./game-table";

export default function home_init(root, channel) {
    ReactDOM.render(<Home channel={channel}/>, root);
  }

class Popup extends React.Component {
    render() {
      return (
        <div className='popup'>
          <div className='popup_inner'>
            <p>1. Every player gets to play a single line joining any 2 dots alternately.
                2. If the player completes a box he gets to play an additional turn.
                3. For every box that the user completes, he gets 5 points.
                4. If the one user marks a territory border using lines around a set of boxes and no other user has marked any line in the entire territory border, the entire area is captured by the user and no other user can now mark a line in that territory.
                Also if the territory contains boxes already marked by any other user, the boxes also will be captured and its owner will change to the owner of the territory.
                A territory is any enclosed area with connected edges. You will get bonus points for creating a territory.
                5. The game ends if all boxes are completed and the player with maximum number of completed boxes/territories wins(maximum number of points).</p>
          <button onClick={this.props.closePopup}>close me</button>
          </div>
        </div>
      );
    }
}

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showPopup: false,
            loggedIn: false
        };
    }

    togglePopup() {
        this.setState({
          showPopup: !this.state.showPopup
        });
    }

    submit() {
      this.setState({
        showPopup: false,
        loggedIn: true
      })
    }

    render() {
        let header = <div className="header">
            <h1>Game of Dots</h1>
        </div>

        let box = <img src={logo} alt={'box'}/>
        let labelname = <label htmlFor="username">User name:</label>
        let textbox = <input type="text" id="username"></input>
        let labelpass = <label htmlFor="password">Password:</label>
        let password = <input type="password" id="password" name="password"></input>
        let button = <div className="column">
          <p><button onClick = {this.submit.bind(this)}>Submit</button></p>
        </div>

        let questionMark = <a onClick={this.togglePopup.bind(this)}><img src={question} alt={'question mark'}/></a>

        if(!this.state.loggedIn) {
          return <div>
              {header}
              {box}
              {labelname}
              {textbox}
              {labelpass}
              {password}
              {button}
              {questionMark}
              {this.state.showPopup ?
                  <Popup
                  text='1. Every player gets to play a single line joining any 2 dots alternately.
                  2. If the player completes a box he gets to play an additional turn.
                  3. For every box that the user completes, he gets 5 points.
                  4. If the one user marks a territory border using lines around a set of boxes and no other user has marked any line in the entire territory border, the entire area is captured by the user and no other user can now mark a line in that territory.
                  Also if the territory contains boxes already marked by any other user, the boxes also will be captured and its owner will change to the owner of the territory.
                  A territory is any enclosed area with connected edges. You will get bonus points for creating a territory.
                  5. The game ends if all boxes are completed and the player with maximum number of completed boxes/territories wins(maximum number of points).'
                  closePopup={this.togglePopup.bind(this)}
              />
              : null
              }
          </div>
        }
        else {
          return <GameTable></GameTable>
        }

    }
}
