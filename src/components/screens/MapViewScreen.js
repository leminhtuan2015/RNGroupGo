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

import MarkerAnimatedView from "../views/MarkerAnimatedView"

import * as Constant from "../../utils/Constant"
import * as Utils from "../../utils/Utils"
import * as ActionTypes from "../../constants/ActionTypes"
import ImageManager from "../../utils/ImageManager"
import FirebaseHelper from "../../helpers/FirebaseHelper"
import DeviceInfo from 'react-native-device-info';

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
		  currentCoordinate: MapViewScreen.defaultCoordinate,
    }

    this.reloadComponent = true

    this.getCurrentPosition()
    this.bind()
  }

  componentWillReceiveProps = (newProps) => {
    console.log("MapView will receive props")

    this.setState({currentCoordinate: newProps.store.mapState.currentCoordinate})
  }

  getCurrentPosition = () => {
    //this.props.dispatch({type: ActionTypes.GET_CURRENT_PLACE})
    // NEED REFACTOR
    Utils.getCurrentPosition((region, error) => {
      console.log("Get Current Position done : " + JSON.stringify(region))
      console.log("Get Current Position error : " + JSON.stringify(error))
     
      if(region) {
        const text = "lat:" + region.latitude + "\n" + "lon:" + region.longitude
        Toast.show(text, Toast.SHORT, Toast.TOP, Constant.styleToast);

        this.setState({currentCoordinate: region})
        this.reloadComponent = false 

        this.props.dispatch({
          type: ActionTypes.UPDATE_CURRENT_PLACE_TO_FIREBASE, 
          data: region
        })
      }
    }) 
  }

  bind(){
    setInterval(this.getCurrentPosition, 5 * 1000)
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

  shouldComponentUpdate(){
    return this.reloadComponent
  }

  renderMarkers(){

	  const uniqueId = DeviceInfo.getUniqueID();

    return (
      <View>
        <MarkerAnimatedView
          userId={uniqueId}
          title="Me"
          description="Me"
          imageName="location"
        />

        <MarkerAnimatedView
          userId="EDF7C50A-C833-4575-A2EE-E472DEFDE8B5"
          title="tuan"
          description="tuan"
          imageName="location1"
        />

        <MarkerAnimatedView
          userId="709549E2-9BCD-4C27-9A41-C8EB112B4973"
          title="tuan 1"
          description="tuan 1"
          imageName="location1"
        />

      </View>
    )   
  }

  render() {
    const regionOk = this.regionFrom(
      this.state.currentCoordinate.latitude,
      this.state.currentCoordinate.longitude,
      300)

    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          showsCompass={true}
          style={styles.map}
          region={regionOk}
          onRegionChangeComplete = {(region) => {
            console.log(" region", region)
          }}
        >
          {this.renderMarkers()}
        </MapView>

        <TouchableOpacity onPress={() => this.subscribeFriends()}>
            <Text>Move</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default MapViewScreen

