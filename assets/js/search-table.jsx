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
            tables : ["table 1", "current table", "pacman", "drug lord", "king of the world", "get a table already","one more table", "table no 21"],
            showPopup: false,
            show: false,
            modalShow: false,
            userName: props.userName,
            tableName: '',
            joinGame: false
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

    addTable() {
        let table = {name: this.state.tableName,
                    owner: this.state.userName};
        this.channel.push("add_table", {table: table}).receive("ok", this.got_view.bind(this));
        this.togglePopup();
        this.joinTable(this.state.tableName);
    }

    joinTable(tableName) {
        this.setState({joinGame: true,
                        tableName: tableName});
    }

    getTableName(e) {
        let tabName = e.target.value;
        this.setState({tableName: tabName})
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
            let col = <div className="column">
            <div className="product-grid3">
                <div className="product-image3">
                    <a href="#">
                        <img className="pic-1" src={logo} alt={"grid-image1"}/>
                        <img className="pic-2" src={logo} alt={"grid-image2"}/>
                    </a>
                    
                </div>
                <div className="product-content">
                    <h3 className="title"><a href="#">{tableName}</a></h3>
                    <div className="price">
                        <button onClick={() => this.joinTable(tableName)}>Join</button>
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

    //const [modalShow, setModalShow] = React.useState(false);

    let addSign = <a onClick={() => this.togglePopup()}><img src={plus}
          alt={'add sign'}/></a>
            return (
                <div>
                <div className='container'>
                {this.state.showPopup ?
                <MyVerticallyCenteredModal
                addTable={(e) => this.addTable(e)}
                show={this.state.showPopup}
                onHide={() => this.togglePopup()}
                getTableName={(e) => this.getTableName(e)}
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
            let attributes = {tableName: this.state.tableName, userName: this.state.userName};
            let channel = socket.channel("games:" + this.state.tableName, attributes);
            return <GameTable userName = {this.state.userName} tableName = {this.state.tableName} channel = {channel}></GameTable>
        }
    }
}

function MyVerticallyCenteredModal(props) {
    
      return (
        <Modal
          {...props}
        >
          <Modal.Header>
            <Modal.Title>
              Create a Table
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={props.addTable}>
                <label>
                    Table Name:
                    <input type="text" onChange={props.getTableName}></input> 
                </label>
                <label>
                    Capacity:
                    <input type="text" name="capacity"></input>
                </label>
                <input type="submit" value="submit"></input>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
      );
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