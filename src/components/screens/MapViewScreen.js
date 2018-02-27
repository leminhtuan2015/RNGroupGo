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
  Alert,
} from "react-native"

import { NavigationActions } from 'react-navigation';
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

		let headerRight = 
      <NavBarItem 
        iconName="location-arrow"
        color="gray"
        onPress={params.rightButtonOnPress ? params.rightButtonOnPress : () => null} />

		const headerTitle = (<Text>{params.selectedUser ? params.selectedUser.name: ""}</Text>) 

    if(!params.selectedUser){
      headerRight = <Text></Text>
    }

    return {
      tabBarLabel: params.label,
      drawerLabel: params.label,
      headerTitle: headerTitle,
			headerRight: headerRight,
		}
	}

  static defaultCoordinate = {
    latitude: 0,
    longitude: 0,
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

//    Toast.show("Requesting Location", Toast.SHORT, Toast.CENTER, Constant.styleToast);

    leaveMap()
  }

  leaveMap = () => {

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

  acceptJoinChannel = (data) => {
    const channelId = data.data.channelId
    const fromUserId = data.data.fromUserId
    const toUserId = data.data.toUserId

    this.props.dispatch({type: ActionTypes.ACCEPT_JOIN_CHANNEL,
      data: {channelId: channelId, userId: Utils.uniqueId()}})

    console.log("acceptJoinChannel : " + JSON.stringify(data))

    this.gotoMapWithFriend(fromUserId)

  }

  gotoMapWithFriend = (userId) => {
      this.props.dispatch({type: ActionTypes.SET_USERS_IN_MAP, data: [userId]})
      this.resetTo("RootStack")
  }

  resetTo = (route) => {
      const actionToDispatch = NavigationActions.reset({
          index: 0,
          key: null,
          actions: [NavigationActions.navigate({routeName: route, params: {selectedUser: this.selectedUser}})],
      });
      this.props.navigation.dispatch(actionToDispatch);
  }

  rejectJoinChannel = (data) => {
    const channelId = data.data.channelId

    this.props.dispatch({type: ActionTypes.REJECT_JOIN_CHANNEL,
      data: {channelId: channelId, userId: Utils.uniqueId()}})
  }

  subscribeInbox = (path) => {
    console.log("Subscribe MapView: " + path)

    callback = (data) => {
      console.log("callback data : " + JSON.stringify(data))
//      Alert.alert("" + JSON.stringify(data))

      Alert.alert(
        'In Comming Call',
        JSON.stringify(data),
        [
          {text: 'Ask me later', onPress: () => {this.rejectJoinChannel(data)}},
          {text: 'Cancel', onPress: () => {this.rejectJoinChannel(data)}, style: 'cancel'},
          {text: 'OK', onPress: () => {this.acceptJoinChannel(data)}},
        ],
        { cancelable: false }
      )
    }

    this.props.dispatch({type: ActionTypes.SUBSCRIBE,
      data: {path: path, callback: callback}}) 
  }

  bind = () => {
    this.autoUpdateMyPosition()
    this.subscribeInbox("users/" + Utils.uniqueId() + "/inbox")
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
    //return true 
  }

  componentWillUnmount(){
    console.log("will un-mount")
    this.stopUpdateMyPosition()
  }

  componentDidMount(){
    this.getCurrentPosition()
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
      <View key={userId}>
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
              this.props.navigation.navigate("ContactView")
            }, 30, "gray")}

            {IconManager.icon("user", "gray", () => {
              this.props.navigation.navigate("FriendView")
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

