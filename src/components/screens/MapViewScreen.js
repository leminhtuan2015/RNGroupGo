import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import { Marker, AnimatedRegion } from 'react-native-maps';
import React from 'react';
import Toast from 'react-native-toast-native';
import {
  Dimensions,
  StyleSheet,
  Button,
  Image,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native"

import * as Constant from "../../utils/Constant"
import * as Utils from "../../utils/Utils"
import * as ActionTypes from "../../constants/ActionTypes"
import ImageManager from "../../utils/ImageManager"
import FirebaseHelper from "../../helpers/FirebaseHelper"

let { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.001;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

class MapViewScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Map',
  };

  static defaultCoordinate = {
    latitude: 21.009792, 
    longitude: 105.823421
  }
  
  constructor(props){
    super(props)

    this.state = {
      friend1CoordinateAnimated: 
        new AnimatedRegion(MapViewScreen.defaultCoordinate),
			currentCoordinateAnimated: 
        new AnimatedRegion(MapViewScreen.defaultCoordinate),
		  currentCoordinate: MapViewScreen.defaultCoordinate,
    }

    this.reloadComponent = true

    this.getCurrentPosition()
    this.bind()
    this.subscribeFriends()
  }

  componentWillReceiveProps = (newProps) => {
    console.log("MapView will receive props")

    this.setState({currentCoordinate: newProps.store.mapState.currentCoordinate})
  }

  subscribeFriends = () => {
    let path = "users/709549E2-9BCD-4C27-9A41-C8EB112B4973/"

    FirebaseHelper.subscribe(path, (data) => {
      console.log("subscribe : " + JSON.stringify(data)) 

      const newCoordinate = data
      const {friend1CoordinateAnimated} = this.state

      if (Platform.OS === 'android') {
        if (this.markerFriend1) {
          this.markerFriend1._component.animateMarkerToCoordinate(newCoordinate, 500);
        }
      } else {
        friend1CoordinateAnimated.timing(newCoordinate).start();
      }
    })  
  }

  getCurrentPosition = () => {
    //this.props.dispatch({type: ActionTypes.GET_CURRENT_PLACE})
    // NEED REFACTOR
    Utils.getCurrentPosition((region, error) => {
      console.log("Get Current Position done : " + JSON.stringify(region))
      console.log("Get Current Position error : " + JSON.stringify(error))
     
      if(region) {
        this.setState({currentCoordinate: region})
        this.setState({currentCoordinateAnimated: 
          new AnimatedRegion(region)})

        //this.reloadComponent = false 
      }

      this.props.dispatch({
        type: ActionTypes.UPDATE_CURRENT_PLACE_TO_FIREBASE, 
        data: region
      })
    }) 
  }

  bind(){
    setInterval(this.getCurrentPosition, 5 * 1000)
    setInterval(this.moveMarker, 5 * 1000)
  }

	regionFrom1(lat, lon) {
		return result = {
			latitude: lat,
			longitude: lon,
			latitudeDelta: LATITUDE_DELTA,
			longitudeDelta: LONGITUDE_DELTA,
		}
	}

	regionFrom(lat, lon, distance) {
		distance = distance/2
		const circumference = 40075
		const oneDegreeOfLatitudeInMeters = 111.32 * 1000
		const angularDistance = distance/circumference

		const latitudeDelta = distance / oneDegreeOfLatitudeInMeters
		const longitudeDelta = Math.abs(Math.atan2(
						Math.sin(angularDistance)*Math.cos(lat),
						Math.cos(angularDistance) - Math.sin(lat) * Math.sin(lat)))

		return result = {
			latitude: lat,
			longitude: lon,
			latitudeDelta,
			longitudeDelta,
		}
	}

  moveMarker = () => {
    let lat = this.state.currentCoordinate.latitude 
    let lon = this.state.currentCoordinate.longitude 

    Toast.show("lat: " + lat + "\n" + "lon: " + lon, 
			Toast.SHORT, Toast.TOP, Constant.styleToast); 

    const { currentCoordinateAnimated } = this.state;
    const newCoordinate = {
      latitude: lat, 
      longitude: lon,
    };

    if (Platform.OS === 'android') {
      if (this.marker) {
        this.marker._component.animateMarkerToCoordinate(newCoordinate, 500);
      }
    } else {
      currentCoordinateAnimated.timing(newCoordinate).start();
    }
  }

  shouldComponentUpdate(){
    return this.reloadComponent
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          showsCompass={true}
          style={styles.map}
          region={this.regionFrom(
              this.state.currentCoordinate.latitude,
              this.state.currentCoordinate.longitude,
              300)}
          onRegionChangeComplete = {(region) => {
            console.log(" region", region)
          }}
        >
          <MapView.Marker.Animated
            coordinate={this.state.currentCoordinateAnimated}
            ref={marker => { this.marker = marker }}
            title="Me"
            description="description"
          >
            {ImageManager("location")}
          </MapView.Marker.Animated>

          <MapView.Marker.Animated
            coordinate={this.state.friend1CoordinateAnimated}
            ref={marker => { this.markerFriend1 = marker }}
            title="Friend1"
            description="description"
          >
            {ImageManager("location1")}
          </MapView.Marker.Animated>
        </MapView>

        <TouchableOpacity onPress={() => this.moveMarker()}>
            <Text>Move</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default MapViewScreen

