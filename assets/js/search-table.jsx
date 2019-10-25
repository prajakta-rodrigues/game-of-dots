import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import logo from "../images/boxes.jpg";
import plus from "../images/plus.png";
import GameTable from "./game-table";
import SearchField from "react-search-field";
import { Link } from 'react-router-dom';
import { Modal, ButtonToolbar } from 'react-bootstrap';
import {Navbar,NavDropdown, Nav, Form, FormControl, Button} from 'react-bootstrap';
import socket from './socket';
import $ from 'jquery';

class Tables extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tables : [],
            showPopup: false,
            show: false,
            modalShow: false,
            userName: props.userName,
            tableName: '',
            length: 3,
            breadth: 3,
            joinGame: false,
            createTable: false,
            capacity: 2,
            tableTaken: false,
        };

        let channel = socket.channel('login:Admin', {});
        this.channel = channel;
        console.log("login:Admin");
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

    // addTable() {
    //     let stateCpy = _.cloneDeep(this.state);
    //     let tables = this.state.tables;
    //     let new_tables = tables.concat(this.state.tableName);
    //     stateCpy.tables = new_tables
    //     this.setState(stateCpy);
    //     this.togglePopup();
    //     this.joinTable(this.state.tableName);
    // }

    addtable() {
        console.log("inside add table")
        console.log(this.state.tableName);
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

    joinTable(tableName, createTable) {
        this.setState({joinGame: true,
                        tableName: tableName});
        
        console.log("check create table val");
        console.log(createTable);

        if(createTable == false) {
            this.channel.push("join_table", {table_name: tableName, player_name: this.state.userName}).
            receive("ok", this.got_view.bind(this));
        }
        
    }

    getTableName(e) {
        let tabName = e.target.value;
        console.log("table name.........");
        console.log(tabName);
        let tables = this.state.tables;
        this.setState({tableTaken: false})
        // for(let i = 0; i < tables.length; i++) {
        //     if(tables[i].name == tabName) {
        //         //tabletaken = true;
        //         this.setState({tableTaken: true})
        //         break;
        //     }
        // }
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
        console.log("get dimensions");
        console.log(dimensions)
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
    if(!this.state.joinGame) {
        let rows = [];
    let tables = this.state.tables;
    let index = 0;
    console.log("table length");
    console.log(tables.length);
    console.log(tables);
    for(let i = 0; i < tables.length; i++) {
        let cols = []
        for(let j = 0; j < 3; j++) {
            if(index < tables.length) {
                let tableName = this.state.tables[index].name;
                let capacity = this.state.tables[index].capacity;
                //let players = this.state.tables[index].players;
                //let includesPlayer = players.includes(this.state.userName);
            let col = <div className="column">
            <div className="product-grid3">
                <div className="product-image3">
                    <a href="#">
                        <img className="pic-1" src={logo} alt={"grid-image1"}/>
                        <img className="pic-2" src={logo} alt={"grid-image2"}/>
                    </a>
                    
                </div>
                <div className="product-content">
                    <h3 className="title"><a href="#">{tableName}</a> <a href="#">Capacity: {capacity}</a></h3>
                    <div className="price">
                        {capacity == 0? <button onClick={() => this.joinTable(tableName, false)} disabled>Join</button>
                        : <button onClick={() => this.joinTable(tableName, false)}>Join</button>}
                    </div>
                </div>
            </div>
        </div>
        cols.push(col);
            } else {
                let col = <div className="column"></div>
                cols.push(col);
            }
            index++;
        }
        rows.push(<div className="row">{cols}</div>);
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
                    <div className='navbar'>
                    <ul>
                        <li><a className="active" href="#home">Home</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                    </div>
                    <Form inline>
                    <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                    <Button variant="outline-success">Search</Button>
                    </Form>
                    {addSign}
                    <div>{rows}</div>

                </div>
        </div>
        
            )
        }else {
            let attributes = {tablename: this.state.tableName, username: this.state.userName, length: this.state.length,
            breadth: this.state.breadth, createTable: this.state.createTable, capacity: this.state.capacity};
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
        console.log("table taken???????");
        console.log(this.props.tableTaken);
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

    class Search extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                filtered : []
            }
    
            this.handleChange = this.handleChange.bind(this);
        }
    
        componentDidMount() {
            this.setState({
                filtered: this.props.items
            });
        }
    
        componentWillReceiveProps(nextProps) {
            this.setState({
              filtered: nextProps.items
            });
          }
          
    
        handleChange(e) {
            let currentList = [];
            let newList = [];
            console.log("inside this")
            if(e.target.value != "") {
                currentList = this.props.items;
                newList = currentList.filter(item => {
                    const lc = item.toLowerCase();
                    const filter = e.target.value.toLowerCase();
                    return lc.includes(filter);
                });
            } else {
                newList = this.props.items;
            }
    
            this.setState({
                filtered : newList
            });
            console.log(this.state.filtered)
        }
    
        render() {
            let searchBar = <div>
                <SearchField placeholder="Search..." onChange={this.handleChange} className="input" />
            </div>
            return <div>
                {searchBar}
            </div>
        }
    }

export default Tables;