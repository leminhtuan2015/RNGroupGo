import * as ActionTypes from "../constants/ActionTypes"
import { NavigationActions } from 'react-navigation';

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

import * as Utils from "../utils/Utils"

class MapService {

  constructor(component){
    this.component = component
    this.channelId = ""
  }

  leaveChannel = (channelId) => {
    this.component.props.dispatch({type: ActionTypes.LEAVE_CHANNEL,
      data: {channelId: channelId, userId: Utils.uniqueId(), status: -2}})
  }

  acceptJoinChannel = (data) => {
    const channelId = data.data.channelId
    const fromUserId = data.data.fromUserId
    const toUserId = data.data.toUserId

    this.channelId = channelId

    this.component.props.dispatch({type: ActionTypes.ACCEPT_JOIN_CHANNEL,
      data: {channelId: channelId, userId: Utils.uniqueId()}})
    console.log("acceptJoinChannel : " + JSON.stringify(data))
    this.gotoMapWithFriend(fromUserId)
  }

  rejectJoinChannel = (data) => {
    const channelId = data.data.channelId

    this.component.props.dispatch({type: ActionTypes.REJECT_JOIN_CHANNEL,
      data: {channelId: channelId, userId: Utils.uniqueId()}})
  }

    subscribeInbox = (path) => {
    console.log("Subscribe MapView: " + path)

    callback = (data) => {
      console.log("In Comming Call : " + JSON.stringify(data))

      Alert.alert(
        "In Comming Call",
        "",
        [
          {text: 'Ask me later', onPress: () => {this.rejectJoinChannel(data)}},
          {text: 'Cancel', onPress: () => {this.rejectJoinChannel(data)}, style: 'cancel'},
          {text: 'OK', onPress: () => {this.acceptJoinChannel(data)}},
        ],
        { cancelable: false }
      )
    }

    this.component.props.dispatch({type: ActionTypes.SUBSCRIBE,
      data: {path: path, callback: callback}})
    }

    gotoMapWithFriend = (userId) => {
        this.component.props.dispatch({type: ActionTypes.SET_USERS_IN_MAP,
        data: {users: [userId], channelId: this.channelId}})
        this.resetTo("RootStack")
    }

    resetTo = (route) => {
        const actionToDispatch = NavigationActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({routeName: route,})],
        });
        this.component.props.navigation.dispatch(actionToDispatch);
    }

}

export default MapService