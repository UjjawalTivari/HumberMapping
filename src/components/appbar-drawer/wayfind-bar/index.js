import React from 'react';

import IconButton from 'material-ui/IconButton';
import ActionSearch from 'material-ui/svg-icons/action/search';
import ContentClear from 'material-ui/svg-icons/content/clear';
import FlatButton from 'material-ui/FlatButton';

import {List, ListItem} from 'material-ui/List';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';

import { If, Then, Else } from 'react-if';

export default class WayFindBar extends React.Component {
  constructor(props) {
    super(props);

    this.wayFind = this.wayFind.bind(this);
    this.updateValue = this.updateValue.bind(this);
    this.onEnter = this.onEnter.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.toggleVoice = this.toggleVoice.bind(this);
    this.updateWaypointValue = this.updateWaypointValue.bind(this);


    this.state = {
      start: '',
      end: '',
      fieldInFocus: null,
      showDestinations: false,
      currentDirectionIndex: 0,
      readMessage: false,
    }
  }

  // Generic Text Field Component Generator
  textFields() {
    // key maps to property define in state
    // for each key -> create component that ties that key to state
    return ['start', null, 'end'].map(field => {

      // if invalid key, return <br>
      if (!field) {
        return (<br key="br" />);
      }

      return (
        <TextField
          key={field}
          hintText={`Enter ${field}....`}
          value={this.state[field]}
          onChange={(e) => this.updateValue(field, e.target.value)}
          onKeyPress={this.onEnter}
          onFocus={() => this.onFocus(field)}
        />
      );
    });
  }

  render() {
    const {
      search,
      searched,
      searchForDestinations,
      destinations,
      directionList,
    } = this.props;

    return (
      <div>
        <div style={{display: 'inline-block'}}>{this.textFields()}</div>
        <IconButton onClick={() => this.wayFind()}>
          <ActionSearch  color="grey" />
        </IconButton>
        <If condition={this.state.showDestinations}>
          <Then>
            <Paper style={{position: 'absolute', minWidth: '256px'}} rounded={false}>
              <div>
                <List>
                  {(searched && destinations.length === 0) && (
                    <ListItem primaryText="Nothing was found..." />
                  )}
                  {destinations.map(destination => (
                    <ListItem
                      key={destination}
                      onClick={() => this.updateWaypointValue(destination)}
                      primaryText={destination}
                    />
                  ))}
                </List>
              </div>
            </Paper>
          </Then>
        </If>
        <If condition={ Array.isArray(directionList) && directionList.length > 0 }>
          <Then>
            <Paper style={{
                right: '10px',
                bottom: '20px',
                position: 'fixed',
                minWidth: '256px',
                maxHeight: '300px',
                overflowY: 'auto',
                zIndex: 9999,
            }} rounded={false}>
              <div>
                {directionList && (
                  <h5 style={{margin: 0, textAlign: 'center'}}>
                    {directionList[this.state.currentDirectionIndex]}
                  </h5>
                )}
                <FlatButton
                  label={this.state.readMessage ? 'Voice Off' : 'Voice On' }
                  primary={true}
                  style={{margin: '12px'}}
                  onClick={this.toggleVoice}
                />
                <FlatButton
                  label={directionList && this.state.currentDirectionIndex < directionList.length - 1 ? 'Next Step' : 'Restart' }
                  primary={true}
                  style={{margin: '12px'}}
                  onClick={this.nextStep}
                />
              </div>
            </Paper>
          </Then>
        </If>
      </div>
    );
  }

  // Input on Key Press Event Handler - on enter, search for path
  onEnter(e) {
    if (e.charCode === 13) {
      this.wayFind();
    }
  }

  // update the field currently in focus, track which field to show results for
  onFocus(field) {
    this.setState({ fieldInFocus: field });
  }


  // Input on Change Event Handler - update the input field and perform search (auto-complete)
  // @param key - the field in focus (prop to update in state)
  // @param val - the value to update to
  updateValue(key, val) {
    const newState = {};
    newState[key] = val;
    this.setState(newState);

    // search for destinations if more than 2 characters
    if (val.length > 2) {
      this.props.searchForDestinations(val.trim().toLowerCase());
      // update bools check to show destination results and hide directions
      this.setState({
        showDestinations: true,
        readMessage: false,
      });
    }
  }

  // Update the value for the field that is in focus
  updateWaypointValue(destination) {
      // update bools check to hide results and directions
    const newState = {
      showDestinations: false,
      readMessage: false,
    };


    // update value
    newState[this.state.fieldInFocus] = destination;
    this.setState(newState);

    // show destination
    this.props.openDestination(destination)
  }

  // Peform path search for get start and destination locations
  wayFind(){
    const { start, end } = this.state;

    if (start.trim().length > 0 && end.trim().length > 0) {
      this.props.setPath({ start, end });

      // reset index for direction step to show
      this.setState({ currentDirectionIndex: 0 })
    }
  }

  // Show the next direction step
  nextStep(){
    var index = this.state.currentDirectionIndex

    // reset index if it is about to out of bounds (restart)
    if (index >= this.props.directionList.length - 1) {
      index = 0
    } else {
      index = index + 1
    }

    // update index value
    this.setState({currentDirectionIndex: index })

    // read message if voice toggle on
    if (this.state.readMessage) {
      this.readMessage(index)
    }
  }

  // toggle Speech Option for Directions
  toggleVoice(current_index) {
    // toggle speech state
    const readMessage = this.state.readMessage;
    this.setState({
      readMessage: !readMessage
    })

    // read current direction step, if toggled on
    if (!readMessage) {
      this.readMessage()
    }
  }


  // NOTE: Need to allow index to passed for cases where state will not be updated in time
  //  https://medium.com/@wereHamster/beware-react-setstate-is-asynchronous-ce87ef1a9cf3
  // read direction step
  readMessage(index) {
      const msg = new SpeechSynthesisUtterance();
      // if no index passed, used index defined in state
      const step = index == null ? this.state.currentDirectionIndex : index
      msg.text = this.props.directionList[step];

      // read step
      window.speechSynthesis.speak(msg)
  }

}
