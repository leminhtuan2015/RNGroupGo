import MapView, {PROVIDER_GOOGLE, Marker, AnimatedRegion} from 'react-native-maps';
import React from 'react';
import Toast from 'react-native-toast-native';
import {
    StyleSheet,
    Text,
    View,
    Alert,
} from "react-native"

import IconManager from "../../utils/IconManager"
import MarkerAnimatedView from "../views/MarkerAnimatedView"
import NavBarItem from "../views/NavBarItem"

import * as Constant from "../../utils/Constant"
import * as ActionTypes from "../../constants/ActionTypes"
import MessageService from "../../services/MessageService"

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
        this.messageService = new MessageService(this)
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
        Alert.alert(
            "Confirm Leave This Map",
            "",
            [
                {
                    text: "Leave", onPress: () => {
                        this.leaveMap()
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

    leaveMap = () => {
        const channelId = this.props.store.mapState.channelId
        console.log("leaveMap : " + channelId)
        this.messageService.leaveChannel(channelId)
    }

    getCurrentPosition = () => {
        this.props.dispatch({type: ActionTypes.SAGA_GET_CURRENT_PLACE})
    }

    updateCurrentPosition = () => {
        if(this.props.store.userState.currentUser){
            this.props.dispatch({
                type: ActionTypes.MAP_UPDATE_CURRENT_PLACE_TO_FIREBASE,
                data: {
                    currentCoordinate: this.props.store.mapState.currentCoordinate,
                    uid: this.props.store.userState.currentUser.uid
                }
            })

            Toast.show(JSON.stringify(this.props.store.mapState.currentCoordinate) + "",
                Toast.SHORT, Toast.TOP, Constant.styleToast);
        }
    }

    subscribeInbox = () => {
        if(this.props.store.userState.currentUser){
            this.messageService.subscribeInbox("users/" +
                this.props.store.userState.currentUser.uid + "/inbox")
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

    renderUsersMarker = () => {
        let userIds = []
        if (this.props.store.mapState.userId) {userIds.push(this.props.store.mapState.userId)}
        if (this.props.store.userState.currentUser) {userIds.push(this.props.store.userState.currentUser.uid)}

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
                        this.props.navigation.navigate("ContactView")
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

        if(this.currentDraggedRegion){
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

        this.props.navigation
            .setParams({
                rightButtonOnPress: this.rightButtonOnPress,
                channelId: this.props.store.mapState.channelId
            });
    }

    componentWillUnmount() {
        console.log("MapView componentWillUnmount: ")
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

