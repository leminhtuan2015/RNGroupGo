import * as ActionTypes from "../constants/ActionTypes"
import {NavigationActions} from 'react-navigation';

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
import FirebaseHelper from "../helpers/FirebaseHelper";

class MessageService {

    constructor(component) {
        this.component = component
    }

    subscribeToChannel = (path) => {
        console.log("Subscribe ContactView: " + path)

        callback = (data) => {
            console.log("callback data : " + JSON.stringify(data))

            let channelId = data.channelId
            let hostId = data.hostId
            let myId = Utils.uniqueId()
            let myStatus = data.users[myId]

            let friendId = null
            let friendStatus = null

            if(hostId == myId){
                friendId = data.friendId
                friendStatus = data.users[friendId]
            } else {
                friendId = data.hostId
                friendStatus = data.users[friendId]
            }

            if (myStatus == -2) {
                Alert.alert("You Leaved Map")
                this.goToHome()
            } else if (friendStatus == -2) {
                Alert.alert("Friend Leaved")
                this.goToHome()
            } else if (friendStatus == -1) {
                Alert.alert("Friend Rejected")
                this.unSubscribeChannel(data)
            } else if (friendStatus == 1) {
                Alert.alert("Friend Accepted")
                this.gotoMapWithFriend(friendId, channelId)
            }
        }

        this.component.props.dispatch({
            type: ActionTypes.SUBSCRIBE,
            data: {path: path, callback: callback}
        })

        // FirebaseHelper.subscribe(path, callback)
    }

    unSubscribeChannel = (data) => {
        console.log("unSubscribeChannel : " + JSON.stringify(data))
        this.component.props.dispatch({type: ActionTypes.UN_SUBSCRIBE_CHANNEL, data: data})
    }

    leaveChannel = (channelId) => {
        // this.component.props.dispatch({
        //     type: ActionTypes.LEAVE_CHANNEL,
        //     data: {channelId: channelId, userId: Utils.uniqueId(), status: -2}
        // })

        FirebaseHelper.write("channels/" + channelId + "/users/" + Utils.uniqueId(), -2)

    }

    acceptJoinChannel = (data) => {
        const channelId = data.data.channelId
        const fromUserId = data.data.fromUserId
        const toUserId = data.data.toUserId

        this.component.props.dispatch({
            type: ActionTypes.ACCEPT_JOIN_CHANNEL,
            data: {channelId: channelId, userId: Utils.uniqueId()}
        })

        console.log("acceptJoinChannel : " + JSON.stringify(data))
        this.subscribeToChannel("channels/" + channelId)
        this.gotoMapWithFriend(fromUserId, channelId)
    }

    rejectJoinChannel = (data) => {
        const channelId = data.data.channelId

        this.component.props.dispatch({
            type: ActionTypes.REJECT_JOIN_CHANNEL,
            data: {channelId: channelId, userId: Utils.uniqueId()}
        })
    }

    subscribeInbox = (path) => {
        console.log("Subscribe MapView: " + path)

        callback = (data) => {
            console.log("In Comming Call : " + JSON.stringify(data))

            Alert.alert(
                "In Comming Call",
                "",
                [
                    {
                        text: 'OK', onPress: () => {
                            this.acceptJoinChannel(data)
                        }
                    },
                    {
                        text: 'Cancel', onPress: () => {
                            this.rejectJoinChannel(data)
                        }, style: 'cancel'
                    },
                ],
                {cancelable: false}
            )
        }

        this.component.props.dispatch({
            type: ActionTypes.SUBSCRIBE,
            data: {path: path, callback: callback}
        })
    }

    createChannel = (friendId) => {
        const channelId = Utils.guid()

        let jsonData = {}
        jsonData[friendId] = 0
        jsonData[Utils.uniqueId()] = 1

        this.component.props.dispatch({
            type: ActionTypes.CREATE_CHANNEL,
            data: {jsonData: jsonData, channelId: channelId,
                hostId: Utils.uniqueId(), friendId: friendId}
        })

        return channelId
    }

    requestFriendLocation = (userId) => {
        const channelId = this.createChannel(userId)
        this.subscribeToChannel("channels/" + channelId)

        this.component.props.dispatch({
            type: ActionTypes.REQUEST_LOCATION,
            data: {fromUserId: Utils.uniqueId(), toUserId: userId, channelId: channelId}
        })
    }

    goToHome = () => {
        this.gotoMapWithFriend(null, null)
    }

    gotoMapWithFriend = (userId, channelId) => {
        this.component.props.dispatch({
            type: ActionTypes.SET_USER_IN_MAP,
            data: {userId: userId, channelId: channelId}
        })

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

export default MessageService