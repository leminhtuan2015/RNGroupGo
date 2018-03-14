import MapView, {PROVIDER_GOOGLE, Marker, AnimatedRegion} from 'react-native-maps';
import React from 'react';
import Toast from 'react-native-toast-native';
import {
    StyleSheet,
    Text,
    View,
    Alert,
} from "react-native"

import DialogBox from "react-native-dialogbox"
import IconManager from "../../utils/IconManager"
import MarkerAnimatedView from "../views/MarkerAnimatedView"
import NavBarItem from "../views/NavBarItem"
import * as Constant from "../../utils/Constant"
import * as ActionTypes from "../../constants/ActionTypes"
import MessageTypes from "../../constants/MessageTypes";
import NavigationHelper from "../views/NavigationHelper";
import FirebaseHelper from "../../helpers/FirebaseHelper";

class MapViewScreen extends React.Component {

    static navigationOptions = ({navigation}) => {
        const {params = {}} = navigation.state;

        let headerRight =
            <NavBarItem
                iconName="bars"
                color="gray"
                onPress={params.rightButtonOnPress}/>

        const headerTitle = (<Text>{params.channelId ? params.channelId : ""}</Text>)

        return {
            tabBarLabel: params.label,
            drawerLabel: params.label,
            headerTitle: headerTitle,
            headerRight: params.channelId ? headerRight : null,
        }
    }

    static defaultCoordinate = {
        latitude: 0.0,
        longitude: 0.0,
    }

    constructor(props) {
        super(props)
        this.currentDraggedRegion = null
        this.dialogbox = null
    }

    rightButtonOnPress = () => {
        console.log("rightButtonOnPress")
        this.showOptions()
    }

    showOptions = () => {
        Alert.alert(
            "Options",
            "",
            [
                {
                    text: "Leave This Map", onPress: () => {
                        this.confirmLeaveMap()
                    }
                },
                {
                    text: "Cancel", onPress: () => {
                    }, style: 'cancel'
                },
            ],
            {cancelable: false}
        )
    }

    confirmLeaveMap = () => {
        this.dialogbox.confirm({
            title: "Would you like to leave?",
            content: [""],
            ok: {
                text: "Yes",
                style: {
                    color: "red"
                },
                callback: () => {
                    this.leaveMap()
                },
            },
            cancel: {
                text: "No",
                style: {
                    color: "green"
                },
                callback: () => {
                },
            },
        });
    }

    getCurrentPosition = () => {
        this.props.dispatch({type: ActionTypes.SAGA_GET_CURRENT_PLACE})
    }

    updateCurrentPosition = () => {
        if (this.props.store.userState.currentUser) {
            this.props.dispatch({
                type: ActionTypes.MAP_UPDATE_CURRENT_PLACE_TO_FIREBASE,
                data: {
                    currentCoordinate: this.props.store.mapState.currentCoordinate,
                    uid: this.props.store.userState.currentUser.uid
                }
            })

            // Toast.show(JSON.stringify(this.props.store.mapState.currentCoordinate) + "",
            //     Toast.SHORT, Toast.TOP, Constant.styleToast);
        }
    }

    autoUpdateMyPosition = () => {
        setInterval(this.getCurrentPosition, 10 * 1000)
        setInterval(this.updateCurrentPosition, 10 * 1000)
    }

    getCurrentUser = () => {
        this.props.dispatch({type: ActionTypes.SAGA_GET_CURRENT_USER})
    }

    regionFrom(lat, lon, distance) {
        distance = distance / 2
        const circumference = 40075
        const oneDegreeOfLatitudeInMeters = 111.32 * 1000
        const angularDistance = distance / circumference

        const latitudeDelta = distance / oneDegreeOfLatitudeInMeters
        const longitudeDelta = Math.abs(Math.atan2(
            Math.sin(angularDistance) * Math.cos(lat),
            Math.cos(angularDistance) - Math.sin(lat) * Math.sin(lat)))

        return result = {
            latitude: lat,
            longitude: lon,
            latitudeDelta,
            longitudeDelta,
        }
    }

    handleGoToContactView = () => {
        if (!this.props.store.userState.currentUser) {
            this.dialogbox.tip({
                title: "Please Login First!",
                content: "",
                btn: {
                    text: "OK",
                    callback: () => {
                        this.props.navigation.navigate("ProfileView")
                    },
                },
            });
        } else {
            this.props.navigation.navigate("ContactView")
        }
    }

    renderUsersMarker = () => {
        let userIds = []
        if (this.props.store.mapState.userId) {
            userIds.push(this.props.store.mapState.userId)
        }
        if (this.props.store.userState.currentUser) {
            userIds.push(this.props.store.userState.currentUser.uid)
        }

        console.log("renderUsersMarker userIds: " + JSON.stringify(userIds))

        let view = userIds.map((userId) => {
            console.log(" renderFriendsMarker userId: " + userId)
            let imageName = (userId == this.props.store.userState.currentUser.uid ? "location" : "location1")

            return this.renderMarkerView(userId, imageName)
        })

        return view
    }

    renderMarkerView = (userId, imageName) => {
        console.log("renderMarkerView" + userId)

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

    renderBottomBar = () => {
        return (
            <View style={styles.toolbarContainer}>
                <View style={styles.toolbar}>
                    {IconManager.icon("search", "gray", () => {
                        this.handleGoToContactView()
                    }, 30, "gray")}

                    {IconManager.icon("history", "gray", () => {
                        this.props.navigation.navigate("FriendView")
                    }, 30, "gray")}

                    {IconManager.icon("user-circle", "gray", () => {
                        this.props.navigation.navigate("ProfileView")
                    }, 30, "gray")}

                    {IconManager.icon("bars", "gray", () => {
                        this.props.navigation.navigate("SettingView")
                    }, 30, "gray")}

                </View>
            </View>
        )
    }

    renderTools = () => {
        return (
            <View style={styles.tool}>
                {IconManager.icon("plus-circle", "gray", () => {
                    console.log("+ press")
                })}
                <Text/>
                {IconManager.icon("minus-circle", "gray", null)}
                <Text/>
                <Text/>
                <Text/>
                <Text/>
                <Text/>
                {IconManager.icon("map-marker", "gray", null)}
            </View>
        )
    }

    renderMapView = () => {
        let regionOk = this.regionFrom(
            this.props.store.mapState.currentCoordinate.latitude,
            this.props.store.mapState.currentCoordinate.longitude,
            300)

        if (this.currentDraggedRegion) {
            regionOk = this.currentDraggedRegion
        }

        return (
            <MapView
                provider={PROVIDER_GOOGLE}
                showsCompass={true}
                style={styles.map}
                region={regionOk}
                onRegionChangeComplete={(region) => {
                    console.log("onRegionChangeComplete region", region)
                    this.currentDraggedRegion = region
                }}>

                {this.renderUsersMarker()}
            </MapView>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderMapView()}
                {this.renderTools()}
                {!this.props.store.mapState.channelId && this.renderBottomBar()}
                <DialogBox ref={dialogbox => { this.dialogbox = dialogbox }}/>
            </View>
        );
    }

    componentWillReceiveProps = (newProps) => {
        console.log("MapView componentWillReceiveProps newProps: " + JSON.stringify(newProps))
        console.log("MapView componentWillReceiveProps currentUser: " + this.props.store.userState.currentUser)

        this.subscribeInbox()
    }

    componentDidMount = () => {
        console.log("MapView componentDidMount")

        this.getCurrentUser()
        this.getCurrentPosition()
        this.autoUpdateMyPosition()

        this.navigationSetParams()
    }

    navigationSetParams = () => {
        this.props.navigation
            .setParams({
                rightButtonOnPress: this.rightButtonOnPress,
                channelId: this.props.store.mapState.channelId
            });
    }

    componentWillUnmount() {
        console.log("MapView componentWillUnmount: ")
    }

    //----------------------- MESSAGE LISTENING----------------------

    leaveMap = () => {
        let currentUser = this.props.store.userState.currentUser
        const channelId = this.props.store.mapState.channelId

        // WHY
        // console.log("leaveMap : " + channelId)
        // const data = {userId: currentUser.uid, channelId: channelId, status: -2}
        // this.props.dispatch({type: ActionTypes.MAP_LEAVE_CHANNEL, data: data})

        FirebaseHelper.write("channels/" + channelId + "/users/" + currentUser.uid, -2)
        this.unSubscribeChannel(channelId)
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

    acceptedJoinMap = (channelId, myUserId) => {
        this.props.dispatch({
            type: ActionTypes.USER_ACCEPT_JOIN_CHANNEL,
            data: {channelId: channelId, userId: myUserId}
        })
    }

    rejectedJoinMap = (channelId, myUserId) => {
        this.props.dispatch({
            type: ActionTypes.USER_REJECT_JOIN_CHANNEL,
            data: {channelId: channelId, userId: myUserId}
        })
    }

    openIncomingCallScreen = (message) => {
        let channelId = message.data.channelId
        let myUserId = message.data.toUserId
        let friendId = message.data.fromUserId

        this.props.navigation
            .navigate("InCommingRequestLocationView", {
                callback: (isAccepted) => {
                    if(isAccepted){
                        this.subscribeChannel(channelId)
                        this.acceptedJoinMap(channelId, myUserId)
                        this.gotoMapWithFriend(channelId,friendId)
                    } else {
                        this.unSubscribeChannel(channelId)
                        this.rejectedJoinMap(channelId, myUserId)
                    }
                }
            })
    }

    onInboxReceiveMessage = (message) => {
        console.log("RECEIVE MESSAGE : " + JSON.stringify(message))
        const messageType = message.data.type

        if (messageType == MessageTypes.IN_COMMING_CALL) {
            this.openIncomingCallScreen(message)
        } else if (messageType == null) {

        }
    }

    subscribeInbox = () => {
        let currentUser = this.props.store.userState.currentUser

        if (currentUser) {
            let path = "users/" + currentUser.uid + "/inbox"

            this.props.dispatch({
                type: ActionTypes.USER_SUBSCRIBE,
                data: {
                    path: path,
                    callback: (message) => {
                        this.onInboxReceiveMessage(message)
                    }
                }
            })
        }
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

    unSubscribeChannel = (channelId) => {
        console.log("unSubscribeChannel channelId: " + channelId)
        this.props.dispatch({
            type: ActionTypes.USER_UN_SUBSCRIBE_CHANNEL,
            data: {channelId: channelId}
        })
    }

    onChannelReceiveMessage = (message) => {
        console.log("Map onChannelReceiveMessage : " + JSON.stringify(message))

        const currentUserId = this.props.store.userState.currentUser.uid

        if (!message) {return}

        let hostId = message.hostId
        let myStatus = message.users[currentUserId]
        let friendId = null
        let friendStatus = null
        let dialogTitle = ""

        if (hostId == currentUserId) {
            friendId = message.friendId
            friendStatus = message.users[friendId]
        } else {
            friendId = message.hostId
            friendStatus = message.users[friendId]
        }

        if (myStatus == -2) {
            dialogTitle = "You Leaved Map"
            this.goToHome()
        } else if (friendStatus == -2) {
            dialogTitle = "Friend Leaved Map"
            this.goToHome()
        }

        Alert.alert(dialogTitle)
    }
}

export default MapViewScreen

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

