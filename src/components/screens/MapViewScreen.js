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

import Icon from 'react-native-vector-icons/FontAwesome';

import MarkerAnimatedView from "../views/MarkerAnimatedView"
import NavBarItem from "../views/NavBarItem"

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

  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state;

		const headerRight = 
      <NavBarItem 
        iconName="users"
        color={Constant.appColor}
        onPress={params.rightButtonOnPress ? params.rightButtonOnPress : () => null} />
    
    return {
      tabBarLabel: params.label,
      drawerLabel: params.label,
      headerTitle: params.title,
			headerRight: headerRight,
		}
	}

  static defaultCoordinate = {
    latitude: 21.009792, 
    longitude: 105.823421
  }
  
  constructor(props){
    super(props)

    this.state = {
		  currentCoordinate: MapViewScreen.defaultCoordinate,
      reloadView: true,
    }
    
    this.timerId = null
    this.reloadComponent = true
    this.bind()
  }

  componentWillReceiveProps = (newProps) => {
    console.log("MapView will receive props")

    this.setState({currentCoordinate: newProps.store.mapState.currentCoordinate})
  }

  componentDidMount(){
    this.props.navigation
      .setParams({rightButtonOnPress: this.rightButtonOnPress}); 
  }

  rightButtonOnPress = () => {
    console.log("Right button Pressed : " + 
      JSON.stringify(this.props.store.mapState.users)) 

    this.props.navigation.navigate("ChattingView")
  }

  getCurrentPosition = () => {
    //this.props.dispatch({type: ActionTypes.GET_CURRENT_PLACE})
    // NEED REFACTOR
    Utils.getCurrentPosition((region, error) => {
      console.log("Get Current Position done : " + JSON.stringify(region))
      console.log("Get Current Position error : " + JSON.stringify(error))
     
      if(region) {
        const text = "lat:" + region.latitude + "\n" + "lon:" + region.longitude
        //Toast.show(text, Toast.SHORT, Toast.TOP, Constant.styleToast);
        this.setState({currentCoordinate: region})
        this.reloadComponent = false 

        this.props.dispatch({
          type: ActionTypes.UPDATE_CURRENT_PLACE_TO_FIREBASE, 
          data: region
        })
      }
    }) 
  }

  bind = () => {
    this.getCurrentPosition()
    this.autoUpdateMyPosition()
  }

  autoUpdateMyPosition = () => {
    this.timerId = setInterval(this.getCurrentPosition, 10 * 1000)
  }

  stopUpdateMyPosition = () => {
    if(this.timerId){
      clearInterval(this.timerId)
    }
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

  componentWillUnmount(){
    console.log("will un-mount")
    this.stopUpdateMyPosition()
  }

  renderFriendsMarker = () => {
    let users = this.props.store.mapState.users 
    console.log("xxx Users : "  + JSON.stringify(users))
    let view = users.map((user) => {
      return this.renderMarker(user, "location1") 
    })

    let meMarker = this.renderMarker(Utils.uniqueId(), "location")
    
    return (
      <View>
        {view}
        {meMarker}
      </View>
    )
  }

  renderMarker = (userId, imageName) => {
    return (
      <View>
        <MarkerAnimatedView
          userId={userId}
          title="Me"
          description="Me"
          imageName={imageName}
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
          {this.renderFriendsMarker()}
        </MapView>

        <TouchableOpacity onPress={() => {
          console.log("Users : " + this.props.store.mapState.users.length)
        }}>
            <Text>Location</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default MapViewScreen

