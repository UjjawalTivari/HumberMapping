import React from 'react'
import ReactDOM from 'react-dom'
import { If, Then, Else } from 'react-if'

import AppbarDrawer from 'components/appbar-drawer'
import Loader from 'components/loader'

import withMap from 'hoc/with-map'


class App extends React.Component {

  constructor(props) {
    super(props);

    // variables for UI Fucntionality & Data shown in the App
    this.state = {
      search: '',
      searched: false,
      destinations: [],
      directionList: [],
      loading: true,
    };


    // bind the App Instance `this` into the methods, so the object in context is always App Component
    [
      'search',
      'clearSearch',
      'updateSearch',
      'showPath',
    ].forEach(fn => this[fn] = this[fn].bind(this));
  }

  render() {

    // The props for to be passed down to the App Drawer Component
    const drawerProps = {
      search: this.state.search,
      searched: this.state.searched,
      destinations: this.state.destinations,
      directionList: this.state.directionList,
      searchForDestinations: this.search,
      updateSearchTerm: this.updateSearch,
      clearSearch: this.clearSearch,
      openDestination: this.props.map.showDestination,
      openTag: this.props.map.showByTag,
      setPath: this.showPath,
      showClosestWashroom: this.props.map.showClosestWashroom,
      currentLocation: this.props.map.currentLocation,
      getFloors: this.props.map.getFloors,
      showFloor: this.props.map.showFloor,
      // The clearAll first resets the state tracked by the App component. Then calls, map.clearAll to reset whats tracked by The Map
      clearAll: () => {
        this.setState({
          search: '', searched: false, destinations: [], directionList: []
        })
        this.props.map.clearAll()
      },
    }

    return(
      <div className="container">
        <If condition={!this.state.loading} >
          <Then>
            <div>
              <AppbarDrawer {...drawerProps} />
            </div>
          </Then>
          <Else>
            <Loader />
          </Else>
        </If>
      </div>
    );
  }

  // Load Map, After the initial render
  componentDidMount() {
    this.props.map.load(() => {
      this.setState({
        loading: false
      })
    });
  }

  // Update the search term state
  updateSearch(search) {
    this.setState({
      search,
    });
  }


  // Retrieve Destination Items
  search(searchTerm) {
    // use the term set in state if nothing passed
    const keyword = searchTerm || this.state.search;

    // search against jibestream api
    const destNameArr = this.props.map.search(keyword)


    // update state to relay information to appbar-drawer
    this.setState({
      destinations: destNameArr,
      searched: true,
      search: keyword,
    });
  }

  // clear search bar
  clearSearch() {
    this.setState({
      destinations: [],
      searched: false,
      search: '',
    });
  }

  // show path and get directions
  showPath(path) {
    this.props.map.showPath(path.start, path.end)

    // get directions and update state
    const directionList = this.props.map.getDirections(path.start, path.end)
    this.setState({ directionList })
  }
};

// get Wrapped Component for App
const AppWithMap = withMap(App);


ReactDOM.render(<AppWithMap />,document.getElementById('app'));
