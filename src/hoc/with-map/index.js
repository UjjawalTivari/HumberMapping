import React from "react"
import ReactDOM from 'react-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Paper from 'material-ui/Paper';
import { If, Then, Else } from 'react-if';

import propMethods from './prop-methods'

import s from './style.css';

/*
  Structure:
    index.js - provides the HOC function
    prop-methods - has all the methods that are to be exposed to the SubComponent through the prop `map`
      The prop methods are attached to Wrapper Component as properties of the Wrapper Component
      and they are also binded to the Wrapper Component
*/



// higher order function
export default function withMap(SubComponent, options = {}) {

  // returns new Component Class Wrapping SubComponent
  return class extends React.Component {
    constructor(props) {

      super(props)

      // information need to track for map
      this.state = {
        destination: null,
        amenity: null,
      }

      // bindings
      this.showcaseDestination = this.showcaseDestination.bind(this)
      this.showDestination = this.showDestination.bind(this)


      // Prop Method Bindings
      Object.keys(propMethods).forEach(method => {
        this[method] = propMethods[method].bind(this)
      })
    }

    // Triggered on State Changes
    // It is used to show pop over for selected destinations
    componentDidUpdate() {
      const destinationDOM = this.destinationDOM;
      const activeVenue = this.activeVenue;

      // clear left over map ui
      this.shallowClearAll();

      // check if the popover for selected destination has been rendered
      if (destinationDOM) {
        const destination = this.state.destination;
        // Get waypoints from destination
        const waypoints = activeVenue.maps.getWaypointsByDestination(destination);

        // Style selected unit
        const shape = this.control
                          .getShapesInLayer('units', this.control.currentMap)
                          .find(shape => shape.meta.destinationIds[0] === destination.id);
        if (shape) {
          const highlight = new jmap.Style({ fill: '#ffff00' });
          this.control.styleShapes([shape], highlight);
        }

        // Add Image to waypoints of destination
        waypoints.forEach(wp => {
          const map = activeVenue.maps.getById(wp.mapId)

          // Get DOMNode for rendered destionation popover and clone it
          // NOTE: need to clone, as an error is thrown by react, as the DOM element is moved
          const newNode = ReactDOM.findDOMNode(destinationDOM).cloneNode(true);
          newNode.style.display = '';
          newNode.className = 'destination-location';

          // add cloned to DOMNode to map through jibestream controller
          this.control.addComponent(newNode, map, wp.coordinates);
        })
      }
    }

    render() {
      // methods to be exposed to SubComponent
      const methods = {
        load: function load(onSuccess = () => {}, onError = () => {}) {
          this.onLoad((control, activeVenue) => {
            this.control = control
            this.activeVenue = activeVenue

            // NOTE: need to reset amenity as, it needs to be rendered after map has intialized
            setTimeout(function () {
              // trigger render to load amenity
              this.setState({ amenity: null })
            }.bind(this), 100)
            onSuccess();
          }, (err) => {
            onError(err)
          })
        }.bind(this),
        clearAll: this.clearAll,
        search: this.search,
        showPath: this.showPath,
        showByTag: this.showByTag,
        showDestination: this.showDestination,
        getDirections: this.getDirections,
        showClosestWashroom: this.showClosestWashroom,
        currentLocation: this.currentLocation,
        getFloors: this.getFloors,
        showFloor: this.showFloor,
      }

      return (
        <MuiThemeProvider>
          <div>
            <SubComponent map={methods} />
            <div className="map" />
            <If condition={this.activeVenue != null}>
               <Then>
                 <div className="amenities">
                   {this.activeVenue && this.activeVenue.amenities.getAll().map(amenity => {
                     const name = amenity.name;
                     const description = amenity.description;
                     const imageSrc = amenity.uris.getAll()[0].path;

                     return (
                       <div key={amenity.name} onClick={() => this.toggleAmenity(amenity)}>
                         <img src={imageSrc} width={50} height={50} />
                       </div>
                     );
                   })}
                 </div>
               </Then>
             </If>
            {this.state.destination && this.showcaseDestination(this.state.destination)}
          </div>
        </MuiThemeProvider>
      )
    }

    // update the selected destination in state
    showDestination(name) {
      const destination = this.state.destination

      if (destination != null && destination.name === name) {
        this.setState({
          destination: null
        });
      } else {
        this.setState({
          destination: this.getDestinationByName(name)
        });
      }
    }


    // generate Pop over UI for selected destination
    showcaseDestination(destination) {
      const style = {
        position: 'absolute',
        display: 'none',
      };

      // get image for destination, if any
      let imageSrc = '';
      if (destination && destination.uris && destination.uris.getAll().length > 0) {
        imageSrc = destination.uris.getAll()[0].path;
      }

    /*
        NOTE: setting the paper component ref to destinationDOM to clone and pass to jmap controller
              post-render
     */
      return (
        <If condition={destination !== undefined && destination !== null }>
          <Then>
            <Paper ref={(dom) => { this.destinationDOM = dom; }} style={style} zDepth={1} >
              <div className="destination-popout" >
                <h3>{destination.name || ''}</h3>
                <h6>{destination.description || ''}</h6>
                <If condition={imageSrc.trim().length > 0 }>
                  <Then><img src={imageSrc} /></Then>
                </If>
              </div>
            </Paper>
          </Then>
          <Else><div /></Else>
        </If>
      );
    }


    // Toggle Selected amenity
    toggleAmenity(amenity) {
      // hide all amenities intially
      this.control.hideAllAmenities();

      if (amenity === this.state.amenity) {
        this.setState({
          amenity: null,
        });
      } else {
        this.control.showAmenity(amenity);
        this.setState({
          amenity,
        });

        // Style amenities
        this.control.styleAllAmenities(new jmap.IconStyle({
          width: 30,
          height: 30,
          background: new jmap.Style({ fill: '#f77f00' }),
          middleground: new jmap.Style({ fill: '#202020' }),
          foreground: new jmap.Style({ fill: '#ffffff' }),
        }))
      }
    }
  }

}
