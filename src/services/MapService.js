import * as ActionTypes from "../constants/ActionTypes"
import { NavigationActions } from 'react-navigation';

class MapService {

  constructor(component){
    this.component = component
  }

  acceptJoinChannel = (data) => {
    const channelId = data.data.channelId
    const fromUserId = data.data.fromUserId
    const toUserId = data.data.toUserId

    this.component.props.dispatch({type: ActionTypes.ACCEPT_JOIN_CHANNEL,
      data: {channelId: channelId, userId: Utils.uniqueId()}})
    console.log("acceptJoinChannel : " + JSON.stringify(data))
    this.gotoMapWithFriend(fromUserId)
  }

  gotoMapWithFriend = (userId) => {
      this.component.props.dispatch({type: ActionTypes.SET_USERS_IN_MAP, data: [userId]})
      this.resetTo("RootStack")
  }

  resetTo = (route) => {
      const actionToDispatch = NavigationActions.reset({
          index: 0,
          key: null,
          actions: [NavigationActions.navigate({routeName: route, params: {selectedUser: this.selectedUser}})],
      });
      this.component.props.navigation.dispatch(actionToDispatch);
  }

  rejectJoinChannel = (data) => {
    const channelId = data.data.channelId

    this.component.props.dispatch({type: ActionTypes.REJECT_JOIN_CHANNEL,
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

    this.component.props.dispatch({type: ActionTypes.SUBSCRIBE,
      data: {path: path, callback: callback}})
  }

}

export default MapService