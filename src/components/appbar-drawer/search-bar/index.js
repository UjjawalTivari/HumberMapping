import React from 'react';

import IconButton from 'material-ui/IconButton';
import ActionSearch from 'material-ui/svg-icons/action/search';
import ContentClear from 'material-ui/svg-icons/content/clear';

import {List, ListItem} from 'material-ui/List';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';

import { If, Then, Else } from 'react-if';

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    // bind methods to SearchBar
    this.updateSearch = this.updateSearch.bind(this);
    this.onEnter = this.onEnter.bind(this);

    // Component State
    this.state = {
      showDestinations: false,
    }
  }

  render() {
    const {
      search,
      searched,
      destinations,
      searchForDestinations,
      openDestination,
      clearSearch,
    } = this.props;

    return (
      <div>
        <TextField
          hintText="Search by keywords..."
          value={search}
          onChange={this.updateSearch}
          onKeyPress={this.onEnter}
        />
      <IconButton onClick={() => {
          this.props.searchForDestinations()
          this.setState({ showDestinations: true });
      }}>
          <ActionSearch  color="grey" />
        </IconButton>
        <If condition={searched}>
          <Then>
            <span>
              |
              <IconButton onClick= {clearSearch}>
                <ContentClear  color="grey" />
              </IconButton>
            </span>
          </Then>
        </If>
        <If condition={this.state.showDestinations}>
          <Then>
            <Paper style={{position: 'absolute'}} rounded={false}>
              <div>
                <List>
                  <If condition={searched && destinations.length === 0} >
                    <Then><ListItem primaryText="Nothing was found..." /></Then>
                  </If>
                  {destinations.map(destination => (
                    <ListItem
                      key={destination}
                      onClick={() => {
                        openDestination(destination)
                        this.setState({ showDestinations: false });
                      }}
                      primaryText={destination}
                    />
                  ))}
                </List>
              </div>
            </Paper>
          </Then>
        </If>
      </div>
    );
  }

  // Input on Key Press Event Handler - on enter search for destinations
  onEnter(e) {
    if (e.charCode === 13) {
      this.props.searchForDestinations();
      // update bool check to show results
      this.setState({ showDestinations: true });
    }
  }

  // Input on Change Event Handler - update search term and search for destinations (auto-complete)
  updateSearch(e) {
    const value = e.target.value
    this.props.updateSearchTerm(value);

    // only search if more than 2 characters
    if (value.length > 2) {
      this.props.searchForDestinations(value);
      // update bool check to show results
      this.setState({ showDestinations: true });
    }
  }
}
