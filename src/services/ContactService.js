import * as Utils from "../utils/Utils"
import * as ActionTypes from "../constants/ActionTypes"
import { NavigationActions } from 'react-navigation';

import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  ListView,
} from 'react-native';

class ContactService {

  constructor(component){
    this.component = component
  }

  resetTo = (route) => {
    const actionToDispatch = NavigationActions.reset({
        index: 0,
        key: null,
        actions: [NavigationActions.navigate({routeName: route, params: {selectedUser: this.selectedUser}})],
    });
    this.component.props.navigation.dispatch(actionToDispatch);
  }

  subscribe = (path) => {
    console.log("Subscribe ContactView: " + path)

    callback = (data) => {
      console.log("callback data : " + JSON.stringify(data))

      const friendResponseStatus = data.users[this.component.selectedUser.key]

      if(friendResponseStatus == 1){
        Alert.alert("Accepted")
        this.gotoMapWithFriend(this.component.selectedUser.key)
      } else if(friendResponseStatus == -1){
        Alert.alert("Rejected")
        this.unSubscribeChannel(data)
      }

    }

    this.component.props.dispatch({type: ActionTypes.SUBSCRIBE,
      data: {path: path, callback: callback}})
  }

    unSubscribeChannel = (data) => {
      console.log("leaveChannel : " + JSON.stringify(data))
      this.component.props.dispatch({type: ActionTypes.LEAVE_CHANNEL, data: data})
    }

  createChannel = (userId) => {
    const channelId = Utils.guid()

    let jsonData = {}
    jsonData[userId] = 0
    jsonData[Utils.uniqueId()] = 1

    this.component.props.dispatch({type: ActionTypes.CREATE_CHANNEL,
                     data: {jsonData: jsonData, channelId: channelId}})

    return channelId
  }

  requestLocation = (userId) => {

    const channelId = this.createChannel(userId)
    this.subscribe("channels/" + channelId)

    this.component.props.dispatch({type: ActionTypes.REQUEST_LOCATION,
      data: {fromUserId: Utils.uniqueId(),toUserId: userId, channelId: channelId}})
  }

  gotoMapWithFriend = (userId) => {
    this.component.props.dispatch({type: ActionTypes.SET_USERS_IN_MAP, data: [userId]})
    this.resetTo("RootStack")
  }
}

export default ContactService
