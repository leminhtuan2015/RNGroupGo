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
import * as ActionTypes from "../../constants/ActionTypes"
import MessageTypes from "../../constants/MessageTypes";
import NavigationHelper from "../views/NavigationHelper";
import FirebaseHelper from "../../helpers/FirebaseHelper";

class MapViewScreen extends React.Component {

    static navigationOptions = ({navigation}) => {
        const {params = {}} = navigation.state;

        let headerRight =
            <NavBarItem
                iconName="ios-options"
                color="gray"
                onPress={params.rightButtonOnPress}/>

        const headerTitle = (<Text>{params.headerTitle}</Text>)

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

    static defaultDistance = 300

    constructor(props) {
        super(props)

        this.currentDraggedRegion = null
        this.mapView = null
        this.dialogbox = null
        this.mapDistance = MapViewScreen.defaultDistance
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
                    text: "Over View", onPress: () => {
                        this.overViewAllUsers()
                    }
                },
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
        console.log("--------------- getCurrentPosition ---------------")
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
        setInterval(this.getCurrentPosition, 30 * 1000)
        setInterval(this.updateCurrentPosition, 30 * 1000)
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

    animateToCurrentRegion = (mapDistance) => {
        let currentRegion = this.regionFrom(
            this.props.store.mapState.currentCoordinate.latitude,
            this.props.store.mapState.currentCoordinate.longitude,
            mapDistance)

        this.mapView.animateToRegion(currentRegion)
    }

    animateToFriendRegion = (friendData) => {
        const friendLatitude = friendData.coordinate.latitude
        const friendLongitude = friendData.coordinate.longitude

        let friendRegion = this.regionFrom(
            friendLatitude,
            friendLongitude,
            MapViewScreen.defaultDistance)

        this.mapView.animateToRegion(friendRegion)
    }

    overViewAllUsers = () => {
        this.mapView.fitToElements(true);
    }

    zoom = (level) => {
        let currentRegion = this.regionFrom(
            this.props.store.mapState.currentCoordinate.latitude,
            this.props.store.mapState.currentCoordinate.longitude,
            MapViewScreen.defaultDistance)

        try {
            let region = this.currentDraggedRegion ? this.currentDraggedRegion : currentRegion
            region.latitudeDelta = region.latitudeDelta * level
            region.longitudeDelta = region.longitudeDelta * level

            this.mapView.animateToRegion(region)
        } catch (error) {
            console.log("zoom catch: " + error)
        }
    }

    renderUsersMarker = () => {
        let userIds = []
        let currentUser = this.props.store.userState.currentUser
        let friendData = this.props.store.mapState.friendData
        let friendId = this.props.store.mapState.friendId

        if (friendId) {
            userIds.push(friendId)
        }

        if (currentUser) {
            userIds.push(currentUser.uid)
        }

        let friendName = friendData ? friendData.name : "Friend"

        // console.log("renderUsersMarker userIds: " + JSON.stringify(userIds))
        // console.log("renderUsersMarker friendData: " + JSON.stringify(friendData))

        let view = userIds.map((userId) => {
            console.log(" renderFriendsMarker userId: " + userId)
            let imageName = (currentUser && userId == currentUser.uid ? "location" : "location1")
            let title = (currentUser && userId == currentUser.uid ? currentUser.displayName : friendName)
            let description = (currentUser && userId == currentUser.uid ? "Me" : "Friend")

            return this.renderMarkerView(userId, imageName, title, description)
        })

        return view
    }

    renderMarkerView = (userId, imageName, title = "Me", description = "Me") => {
        console.log("renderMarkerView" + userId)

        return (
            <View key={userId}>
                <MarkerAnimatedView
                    userId={userId}
                    title={title}
                    description={description}
                    imageName={imageName}
                />
            </View>
        )
    }

    renderBottomBar = () => {
        return (
            <View style={styles.toolbarContainer}>
                <View style={styles.toolbar}>
                    {IconManager.icon("search", 30, "gray", "gray", () => {
                        this.handleGoToContactView()
                    })}

                    {IconManager.icon("history", 30, "gray", "gray", () => {
                        this.props.navigation.navigate("FriendView")
                    })}

                    {IconManager.icon("user-circle", 30, "gray", "gray", () => {
                        this.props.navigation.navigate("ProfileView")
                    })}

                    {IconManager.icon("bars", 30, "gray", "gray", () => {
                        this.props.navigation.navigate("SettingView")
                    })}

                </View>
            </View>
        )
    }

    renderUserIconOnTool = () => {
        return (
            <View style={{marginTop: 0}}>
                {IconManager.ionIcon("md-contact", 45, "#9E9E9E", "red", () => {
                    let friendData = this.props.store.mapState.friendData
                    // const friendName = friendData.name
                    // console.log("friendName xxx ", friendName)
                    // this.props.navigation.setParams({headerTitle: friendName})

                    this.animateToFriendRegion(friendData)
                })}
            </View>
        )

    }

    renderTools = () => {
        return (
            <View style={styles.tool}>
                {this.props.store.mapState.friendData && this.renderUserIconOnTool()}

                <View/>
                <View/>
                <View/>
                <View/>

                <View>
                    {IconManager.ionIcon("ios-add-circle", 45, "#9E9E9E", "gray", () => {
                        this.zoom(0.5)
                    })}

                    <Text/>

                    {IconManager.ionIcon("ios-remove-circle", 45, "#9E9E9E", "red", () => {
                        this.zoom(2.0)
                    })}

                </View>

                <View>
                    {IconManager.ionIcon("ios-navigate", 45, "#9E9E9E", "gray", () => {
                        this.animateToCurrentRegion(MapViewScreen.defaultDistance)
                    })}
                </View>
            </View>
        )
    }

    renderMapView = () => {
        let currentRegion = this.regionFrom(
            this.props.store.mapState.currentCoordinate.latitude,
            this.props.store.mapState.currentCoordinate.longitude,
            MapViewScreen.defaultDistance)

        if (this.currentDraggedRegion) {
            currentRegion = this.currentDraggedRegion
        }

        return (
            <MapView
                ref={mapView => {
                    this.mapView = mapView
                }}
                provider={PROVIDER_GOOGLE}
                showsCompass={true}
                loadingEnabled={true}
                style={styles.map}
                region={currentRegion}

                onRegionChange={(region) => {
                    console.log("onRegionChangeComplete region", region)
                    this.currentDraggedRegion = region
                }}

                onRegionChangeComplete={(region) => {
                    console.log("onRegionChangeComplete region", region)
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
                <DialogBox ref={dialogbox => {
                    this.dialogbox = dialogbox
                }}/>
            </View>
        );
    }

    componentWillReceiveProps = (newProps) => {
        // console.log("MapView componentWillReceiveProps newProps: " + JSON.stringify(newProps))
        // console.log("MapView componentWillReceiveProps currentUser: " + this.props.store.userState.currentUser)

        this.subscribeInbox()
    }

    componentDidMount = () => {
        console.log("MapView componentDidMount")

        this.getCurrentUser()
        this.getCurrentPosition()
        this.autoUpdateMyPosition()

        this.navigationSetParams()
    }

    navigationSetParams = (headerTitle = "") => {
        this.props.navigation
            .setParams({
                rightButtonOnPress: this.rightButtonOnPress,
                channelId: this.props.store.mapState.channelId,
                headerTitle: headerTitle
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
        NavigationHelper.gotoMapWithFriend(this, channelId, friendId)
    }

    goToHome = () => {
        NavigationHelper.goToHome(this)
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

        this.props.dispatch({
            type: ActionTypes.MAP_SET_FRIEND_DATA_IN_MAP,
            data: {friendData: null}
        })
    }

    openIncomingCallScreen = (message) => {
        let channelId = message.data.channelId
        let myUserId = message.data.toUserId
        let friendId = message.data.fromUserId

        this.props.navigation
            .navigate("InCommingRequestLocationView", {
                friendId: friendId,
                callback: (isAccepted) => {
                    if (isAccepted) {
                        this.unSubscribeChannel(this.props.store.mapState.channelId)
                        this.subscribeChannel(channelId)
                        this.acceptedJoinMap(channelId, myUserId)
                        this.gotoMapWithFriend(channelId, friendId)
                    } else {
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

        if (!message) {
            return
        }

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
        // backgroundColor: "red",
        position: 'absolute',
        flex: 1,
        alignItems: 'flex-end',
        flexDirection: 'column',
        justifyContent: 'space-between',
        top: 10,
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

