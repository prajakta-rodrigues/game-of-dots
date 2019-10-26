import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import logo from "../images/boxes.jpg";
import plus from "../images/plus.png";
import GameTable from "./game-table";
import SearchField from "react-search-field";
import { Modal} from 'react-bootstrap';
import {Form, FormControl, Button} from 'react-bootstrap';
import socket from './socket';

class Tables extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tables : [],
            showPopup: false,
            // show: false,
            //modalShow: false,
            userName: props.userName,
            tableName: '',
            length: 3,
            breadth: 3,
            joinGame: false,
            createTable: false,
            capacity: 2,
            tableTaken: false,
            watchGame: false,
            filtered: []
        };

        let channel = socket.channel('login:Admin', {});
        this.channel = channel;
        this.channel
        .join()
        .receive("ok", this.got_view.bind(this))
        .receive("error", resp => { console.log("Unable to join", resp); });
    }

    got_view(view) {
        console.log("new view connected to login", view);
        this.setState(view.game);
      }

    setModalShow(value) {
        this.setState({
            modalShow: value
        });
    }

    togglePopup() {
        this.setState({
          showPopup: !this.state.showPopup
        });
    }

    handleChange(e) {
        let newList = [];
        let nameList = this.state.tables.map(item => item.name);
        if(e.target.value != "") {
            newList = nameList.filter(item => 
                item.includes(e.target.value)
            );
        } else {
            newList = nameList;
        }
        this.setState({
            filtered : newList
        });
    }

    addtable() {
        if(this.state.tableName != "") {
            let stateCpy = _.cloneDeep(this.state);
            stateCpy.createTable = true
            this.setState(stateCpy);
        let table = {name: this.state.tableName,
                    owner: this.state.userName,
                    length: this.state.length,
                    breadth: this.state.breadth,
                    players: [this.state.userName],
                    capacity: this.state.capacity - 1};
        this.channel.push("add_table", {table: table}).receive("ok", this.got_view.bind(this));
        this.togglePopup();
        this.joinTable(this.state.tableName, true);
        }else {
            this.togglePopup();
        }
    }

    watchGame() {
        this.setState({watchGame: true})
    }

    joinTable(tableName, createTable) {
        this.setState({joinGame: true,
                        tableName: tableName});
        

        if(createTable == false) {
            this.channel.push("join_table", {table_name: tableName, player_name: this.state.userName}).
            receive("ok", this.got_view.bind(this));
        }
        
    }

    getTableName(e) {
        let tabName = e.target.value;
        let tables = this.state.tables;
        this.setState({tableTaken: false})
        if(tables.includes(tabName)) {
            this.setState({tableTaken: true})
        }
        this.setState({tableName: tabName})
    }

    getDimensions(e) {
        let dimensions = e.target.value;
        let length = 3;
        let breadth = 3;
        let capacity = 2;
        if(dimensions == "4*4") {
            length = 4;
            breadth = 4;
            capacity = 6;
        } else if(dimensions == "5*5") {
            length = 5;
            breadth = 5;
            capacity = 8;
        } else if(dimensions == "6*6") {
            length = 6;
            breadth = 6;
            capacity = 10;
        } else if(dimensions == "7*7") {
            length = 7;
            breadth = 7;
            capacity = 12;
        } else if(dimensions == "8*8") {
            length = 8;
            breadth = 8;
            capacity = 14;
        } else if(dimensions == "9*9") {
            length = 9;
            breadth = 9;
            capactiy = 16;
        } else if(dimensions == "10*10") {
            length = 10;
            breadth = 10;
            capacity = 18;
        }
        this.setState({
            length: length,
            breadth: breadth,
            capacity: capacity
        });
    }

    render() {
    if(!this.state.joinGame && !this.state.watchGame) {
        let rows = [];
    let tables = this.state.tables;
    let filtered = this.state.filtered;
    if(this.state.filtered.length == 0) {
        filtered = tables;
    }
    let index = 0;
    for(let i = 0; i < filtered.length; i++) {
        let cols = []
        for(let j = 0; j < 3; j++) {
            if(index < filtered.length) {
                let tableName = this.state.tables[index].name;
                let capacity = this.state.tables[index].capacity;
            let col = <div className="column" key={tableName}>
            <div className="product-grid3" key={tableName + "grid3"}>
                <div className="product-image3" key={tableName + "img3"}>
                    <a href="#" key={tableName + "k1"}>
                        <img className="pic-1" src={logo} alt={"grid-image1"} key={tableName + "pc1"}/>
                        <img className="pic-2" src={logo} alt={"grid-image2"} key={tableName + "pc2"}/>
                    </a>
                    
                </div>
                <div className="product-content" key={tableName + "prod"}>
                    <h3 className="title" key={tableName + "til"}><a href="#" key={tableName + "anc1"}>{tableName}</a> 
                    <a href="#" key={tableName + "anc2"}>Capacity: {capacity}</a></h3>
                    <div className="price" key={tableName + "price"}>
                        {capacity == 0? <button onClick={() => this.joinTable(tableName, false)} key={tableName + "dis"} disabled>Join</button>
                        : <button onClick={() => this.joinTable(tableName, false)} key={tableName + "but"}>Join</button>}
                        <button onClick={() => this.watchGame()} key={tableName + "watch"}>Watch</button>
                    </div>
                </div>
            </div>
        </div>
        cols.push(col);
            } else {
                let col = <div className="column" key={index++}></div>
                cols.push(col);
            }
            index++;
        }
        rows.push(<div className="row" key={i}>{cols}</div>);
    }

    let addSign = <a onClick={() => this.togglePopup()}><img src={plus}
          alt={'add sign'}/></a>
            return (
                <div>
                <div className='container'>
                {this.state.showPopup ?
                <CreateTable
                show={this.state.showPopup}
                tables={this.state.tables}
                tableTaken={this.state.tableTaken}
                onHide={() => this.togglePopup()}
                addtable={() => this.addtable()}
                getTableName={(e) => this.getTableName(e)}
                getDimensions={(e) => this.getDimensions(e)}
       />
              : null
              }
                    
                    <input type="text" placeholder="Search..." onChange={(e) => this.handleChange(e)} className="mr-sm-2" />
                    
                    {addSign}
                    <div>{rows}</div>

                </div>
        </div>
        
            )
        }else {
            let attributes = {tablename: this.state.tableName, username: this.state.userName, length: this.state.length,
            breadth: this.state.breadth, createTable: this.state.createTable, capacity: this.state.capacity, watchGame: this.state.watchGame};
            let channel = socket.channel("games:" + this.state.tableName, attributes);
            return <GameTable userName = {this.state.userName} 
            tableName = {this.state.tableName}
            channel = {channel}></GameTable>
        }
    }
}

class CreateTable extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {
        return (
            <Modal {...this.props}>
              <Modal.Header>
                <Modal.Title>
                  Create a Table
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form>
                    <label>
                        Table Name: 
                    </label>
                    {this.props.tableTaken? <input type="text" onChange={this.props.getTableName} id="tablename"value =""></input> :
                    <input type="text" onChange={this.props.getTableName} id="tablename"></input>}
                    {this.props.tableTaken? <span>Table name already exists</span> : null}
                    <label>
                        Table Size:
                    </label>
                    <select onChange={this.props.getDimensions}>
                        <option value="3*3">3*3</option>
                        <option value="4*4">4*4</option>
                        <option value="5*5">5*5</option>
                        <option value="6*6">6*6</option>
                        <option value="7*7">7*7</option>
                        <option value="8*8">8*8</option>
                        <option value="9*9">9*9</option>
                        <option value="10*10">10*10</option>
                    </select>
                    <input type="submit" value="submit" onClick = {this.props.addtable}></input>
                </form>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.props.onHide}>Close</Button>
              </Modal.Footer>
            </Modal>
          );
    }
    }

export default Tables;