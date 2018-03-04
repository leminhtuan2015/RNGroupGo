import * as Utils from "../utils/Utils"
import * as ActionTypes from "../constants/ActionTypes"
import {NavigationActions} from 'react-navigation';

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

    constructor(component) {
        this.component = component
        this.channelId = ""
    }

    resetTo = (route) => {
        const actionToDispatch = NavigationActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({routeName: route,})],
        });
        this.component.props.navigation.dispatch(actionToDispatch);
    }

    subscribeToChannel = (path) => {
        console.log("Subscribe ContactView: " + path)

        callback = (data) => {
            console.log("callback data : " + JSON.stringify(data))
            this.component.setState({isShowingIndicator: false})

            const friendResponseStatus = data.users[this.component.selectedUser.key]
            const meResponseStatus = data.users[Utils.uniqueId()]

            if (meResponseStatus == -2) {
                Alert.alert("You Leaved")
            } else if (friendResponseStatus == 1) {
                Alert.alert("Friend Accepted")
                this.gotoMapWithFriend(this.component.selectedUser.key)
            } else if (friendResponseStatus == -1) {
                Alert.alert("Friend Rejected")
                this.unSubscribeChannel(data)
            } else if (friendResponseStatus == -2) {
                Alert.alert("Friend Leaved")
            }
        }

        this.component.props.dispatch({
            type: ActionTypes.SUBSCRIBE,
            data: {path: path, callback: callback}
        })
    }

    unSubscribeChannel = (data) => {
        console.log("unSubscribeChannel : " + JSON.stringify(data))
        this.component.props.dispatch({type: ActionTypes.UN_SUBSCRIBE_CHANNEL, data: data})
    }

    createChannel = (userId) => {
        const channelId = Utils.guid()

        let jsonData = {}
        jsonData[userId] = 0
        jsonData[Utils.uniqueId()] = 1

        this.component.props.dispatch({
            type: ActionTypes.CREATE_CHANNEL,
            data: {jsonData: jsonData, channelId: channelId}
        })

        return channelId
    }

    requestFriendLocation = (userId) => {

        const channelId = this.createChannel(userId)
        this.channelId = channelId
        this.subscribeToChannel("channels/" + channelId)

        this.component.props.dispatch({
            type: ActionTypes.REQUEST_LOCATION,
            data: {fromUserId: Utils.uniqueId(), toUserId: userId, channelId: channelId}
        })
    }

    gotoMapWithFriend = (userId) => {
        this.component.props.dispatch({
            type: ActionTypes.SET_USERS_IN_MAP,
            data: {users: [userId], channelId: this.channelId}
        })
        this.resetTo("RootStack")
    }
}

export default ContactService
