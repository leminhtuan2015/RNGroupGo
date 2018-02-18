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
import IconManager from "../../utils/IconManager"
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
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    flex: 0.8,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  tool: {
    backgroundColor: "transparent",
    position: 'absolute',
    flex: 1,
    alignItems: 'flex-end',
    right: 10,
    bottom: 80,
  },
  toolbar: {
    backgroundColor: "white",
    position: 'absolute',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: 10,
    right: 30,
    left: 30,
  },
  toolbarContainer: {
    backgroundColor: "white",
    position: 'absolute',
    height: 50,
    right: 0,
    left: 0,
    bottom: 0,
  }

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
        color="gray"
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
    //return this.reloadComponent
    return true 
  }

  componentWillUnmount(){
    console.log("will un-mount")
    this.stopUpdateMyPosition()
  }

  renderFriendsMarker = () => {

    let users = this.props.store.mapState.users 
    //let users = ["709549E2-9BCD-4C27-9A41-C8EB112B4973"]
    console.log(" renderFriendsMarker : "  + JSON.stringify(users))

    let view = users.map((user) => {
      console.log(" renderFriendsMarker_ : "  + user)
      return this.renderMarker(user, "location1") 
    })

    let meMarker = this.renderMarker(Utils.uniqueId(), "location")
    
    if(users){
      return (
        <View>
          {meMarker}
          {view}
        </View>
      )
    } else {
      return meMarker
    }
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
        
        <View style={styles.tool}>
          {IconManager.icon("plus-circle", "gray", null)}
          <Text />
          {IconManager.icon("minus-circle", "gray", null)}
          <Text />
          <Text />
          <Text />
          <Text />
          <Text />
          {IconManager.icon("map-marker", "gray", null)}
        </View>

        <View style={styles.toolbarContainer}>
          <View style={styles.toolbar}>
            {IconManager.icon("search", "gray", () => {
              this.props.navigation.navigate("SearchView")
            }, 30, "gray")}

            {IconManager.icon("user", "gray", () => {
              this.props.navigation.navigate("ContactView")
            }, 30, "gray")}

            {IconManager.icon("users", "gray", () => {
              this.props.navigation.navigate("GroupView")
            }, 30, "gray")}

            {IconManager.icon("bars", "gray", () => {
              this.props.navigation.navigate("SettingView")
            }, 30, "gray")}

          </View>
        </View>

      </View>
          );
  }
}

export default MapViewScreen

