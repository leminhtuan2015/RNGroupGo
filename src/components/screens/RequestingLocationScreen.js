import React, {Component} from "react";
import {
    Alert,
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';

import {Button} from 'react-native-elements'

import Indicator from "../views/Indicator"
import * as ActionTypes from "../../constants/ActionTypes";
import * as Utils from "../../utils/Utils";
import MessageTypes from "../../constants/MessageTypes";
import MessageService from "../../services/MessageService";
import NavigationHelper from "../views/NavigationHelper";
import FirebaseHelper from "../../helpers/FirebaseHelper";

class RequestingLocationScreen extends Component<> {

    static navigationOptions = ({navigation}) => {
        const {params = {}} = navigation.state
        return {headerLeft: null}
    }

    constructor(props) {
        super(props)

        this.friendUserId = this.props.navigation.state.params.friendUserId
        this.friendData = this.props.navigation.state.params.friendData

        this.myUserId = null
        this.channelId = null
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.top}>
                    <Text style={styles.titleText}>Calling</Text>
                    <Text>{this.friendData.name}</Text>
                </View>

                <View style={styles.center}>
                    <Image
                        style={[styles.roundImage]}
                        source={{uri: this.friendData.photoURL}}
                    />

                    <Indicator style={styles.center}/>
                </View>

                <View style={styles.bottom}>
                    <Button
                        raised={true}
                        rounded={true}
                        onPress={() => {
                            this.stopCalling()
                        }}
                        title="Cancel"
                        borderRadius={5}
                        color="white"
                        backgroundColor="#C62828"
                        buttonStyle={{width: 100, height: 50, alignItems: "center"}}
                    />
                </View>
            </View>
        )
    }

    componentDidMount = () => {
        if (this.props.store.userState.currentUser) {
            this.myUserId = this.props.store.userState.currentUser.uid

            const channelId = this.createChannel(this.myUserId, this.friendUserId)
            this.channelId = channelId

            const data = {
                fromUserId: this.myUserId,
                toUserId: this.friendUserId,
                channelId: channelId,
                type: MessageTypes.IN_COMMING_CALL
            }

            this.subscribeChannel(channelId)
            this.requestFriendLocation(data)
        }
    }

    //--------------------------------- MESSAGE ---------------------

    unSubscribeChannel = (channelId) => {
        console.log("unSubscribeChannel channelId: " + channelId)
        this.props.dispatch({
            type: ActionTypes.USER_UN_SUBSCRIBE_CHANNEL,
            data: {channelId: channelId}
        })
    }

    subscribeChannel = (channelId) => {
        let callback = (message) => {
            this.onChannelReceiveMessage(message)
        }

        this.props.dispatch({
            type: ActionTypes.USER_SUBSCRIBE,
            data: {
                path: "channels/" + channelId, callback: callback
            }
        })
    }

    onChannelReceiveMessage = (message) => {
        console.log("Request onChannelReceiveMessage : " + JSON.stringify(message))

        if (!message) {return}

        let channelId = message.channelId
        let currentUserId = this.myUserId
        let hostId = message.hostId
        let myStatus = message.users[currentUserId]
        let friendId = null
        let friendStatus = null

        if (hostId == currentUserId) {
            friendId = message.friendId
            friendStatus = message.users[friendId]
        } else {
            friendId = message.hostId
            friendStatus = message.users[friendId]
        }

        if (myStatus == -2) {
            Alert.alert("You Leaved Map")
            this.goToHome()
        } else if (friendStatus == -2) {
            Alert.alert("Friend Leaved Map")
            this.goToHome()
        } else if (friendStatus == -1) {
            Alert.alert("Friend Rejected")
            this.props.navigation.goBack()
            this.unSubscribeChannel(channelId)
        } else if (friendStatus == 1) {
            Alert.alert("Friend Accepted")
            this.props.navigation.goBack()
            this.gotoMapWithFriend(channelId, friendId)
        }
    }

    gotoMapWithFriend = (channelId, friendId) => {
        this.props.dispatch({
            type: ActionTypes.MAP_SET_USER_IN_MAP,
            data: {userId: friendId, channelId: channelId}
        })

        NavigationHelper.resetTo(this, "RootStack")
    }

    goToHome = () => {
        this.props.dispatch({
            type: ActionTypes.MAP_SET_USER_IN_MAP,
            data: {userId: null, channelId: null}
        })

        NavigationHelper.resetTo(this, "RootStack")
    }

    stopCalling = () => {
        this.unSubscribeChannel(this.channelId)
        this.props.navigation.goBack()
    }

    requestFriendLocation = (data) => {
        this.props.dispatch({
            type: ActionTypes.USER_REQUEST_LOCATION,
            data: data
        })
    }

    createChannel = (myUserId, friendId) => {
        const channelId = Utils.guid()

        let jsonData = {}
        jsonData[friendId] = 0
        jsonData[myUserId] = 1

        this.props.dispatch({
            type: ActionTypes.USER_CREATE_CHANNEL,
            data: {
                hostId: myUserId,
                friendId: friendId,
                jsonData: jsonData,
                channelId: channelId,
            }
        })

        return channelId
    }
}

export default RequestingLocationScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },

    top: {
        flex: 0.2,
        alignItems: 'center',
        justifyContent: 'center'
    },

    center: {
        flex: 0.8,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },

    bottom: {
        flex: 0.2,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },

    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    roundImage: {
        height: 60,
        width: 60,
        borderRadius: 30,
    },
})