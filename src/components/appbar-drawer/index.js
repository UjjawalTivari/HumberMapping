import React from 'react';
import Drawer from 'material-ui/Drawer';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Divider from 'material-ui/Divider';
import AppBar from 'material-ui/AppBar';

import IconButton from 'material-ui/IconButton';
import ActionHome from 'material-ui/svg-icons/action/home';

import {List, ListItem} from 'material-ui/List';

import injectTapEventPlugin from 'react-tap-event-plugin';

import SearchBar from './search-bar';
import WayFindBar from './wayfind-bar';
import s from './style.css';

injectTapEventPlugin();

const muiTheme = getMuiTheme({
  appBar: {
  },
});

export default class AppbarDrawer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      wayFindBarOpen: false,
      searchBarOpen: true,
    };

    this.handleToggle = this.handleToggle.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleWayFindClick = this.handleWayFindClick.bind(this);
    this.handleSearchClick = this.handleSearchClick.bind(this);
  }



  render() {

    return (
      <div style={{left:10, top:10, position: 'absolute'}}>
        <AppBar
          titleStyle={{ height: 'initial' }}
          title={this.state.searchBarOpen ? (
            <SearchBar { ...this.props } />
          ) : (
            <WayFindBar { ...this.props } />
          )}
          onLeftIconButtonTouchTap={this.handleToggle}
        />

        <Drawer
          docked={false}
          width={250}
          open={this.state.open}
          onRequestChange={(open) => this.setState({open})}
        >
          <div>
            <h4>
            <IconButton
              style={s.small}
              onTouchTap={this.handleClose}
            >
              <img src="../../images/favicon.png" height="30" width="30"/>
            </IconButton>
                <span onTouchTap={this.handleClose}> Humber Map</span>
            </h4>
          </div>
          <Divider/>

          <List>
          <ListItem primaryText="Search" onTouchTap={this.handleSearchClick}/>
          <ListItem primaryText="Way Find" onTouchTap={this.handleWayFindClick}/>
          <ListItem
            primaryText="Categories"
            primaryTogglesNestedList
            nestedItems={[
              <ListItem key={"exercise"} primaryText="Exercise" onTouchTap={() => {
                this.handleClose();
                this.props.openTag('exercise');
              }}/>,
              <ListItem key={"food"} primaryText="Food" onTouchTap={() => {
                this.handleClose();
                this.props.openTag('food');
              }}/>,
            ]}
          />
          <ListItem
            primaryText="Floors"
            primaryTogglesNestedList
            nestedItems={this.props.getFloors().map(floor => (
              <ListItem key={floor} primaryText={floor} onTouchTap={() => {
                this.handleClose();
                this.props.showFloor(floor);
              }}/>
            ))}/>
            <ListItem primaryText="My Location" onTouchTap={() => {
                this.handleClose();
                this.props.currentLocation();
            }}/>
            <ListItem primaryText="Closest Washroom" onTouchTap={() => {
                this.handleClose();
                this.props.showClosestWashroom();
            }}/>
            <ListItem primaryText="Clear All" onTouchTap={() => {
              this.props.clearAll();
              this.handleClose();
            }} />
          </List>

        </Drawer>
      </div>
    );
  }

  handleToggle() {
    this.setState({open: !this.state.open});
  }

  handleClose() {
    this.setState({open: false});
  }

  handleWayFindClick(){
    this.setState({wayFindBarOpen: true });
    this.setState({searchBarOpen: false });
    this.setState({open: false});

  }

  handleSearchClick(){
    this.setState({wayFindBarOpen: false });
    this.setState({searchBarOpen: true});
    this.setState({open: false});

  }
}
