import MapView, {PROVIDER_GOOGLE, Marker, AnimatedRegion} from 'react-native-maps';
import React from 'react';
import Toast from 'react-native-toast-native';
import {
    Dimensions,
    StyleSheet,
    Text,
    View,
    Alert,
} from "react-native"

import IconManager from "../../utils/IconManager"
import MarkerAnimatedView from "../views/MarkerAnimatedView"
import NavBarItem from "../views/NavBarItem"

import * as Constant from "../../utils/Constant"
import * as Utils from "../../utils/Utils"
import * as ActionTypes from "../../constants/ActionTypes"
import MessageService from "../../services/MessageService"

let {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.001;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

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

        this.state = {
            currentCoordinate: MapViewScreen.defaultCoordinate,
            userId1: null,
        }

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
        //this.props.dispatch({type: ActionTypes.MAP_GET_CURRENT_PLACE})
        // NEED REFACTOR
        Utils.getCurrentPosition((region, error) => {

            if (region) {
                const text =
                    "UID:" + Utils.uniqueId() +
                    "lat:" + region.latitude + "\n" +
                    "lon:" + region.longitude

                Toast.show(text, Toast.SHORT, Toast.TOP, Constant.styleToast);
                this.setState({currentCoordinate: region})

                this.props.dispatch({
                    type: ActionTypes.MAP_UPDATE_CURRENT_PLACE_TO_FIREBASE,
                    data: region
                })
            }
        })
    }

    subscribeInbox = () => {
        this.messageService.subscribeInbox("users/" + Utils.uniqueId() + "/inbox")
    }

    autoUpdateMyPosition = () => {
        setInterval(this.getCurrentPosition, 10 * 1000)
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

    renderFriendsMarker = () => {
        let userId = this.props.store.mapState.userId
        let userId1 = this.state.userId1
        console.log(" renderFriendsMarker : " + JSON.stringify(userId))

        let userIds = [Utils.uniqueId()]

        if (userId) {userIds.push(userId)}
        if (userId1) {userIds.push(userId1)}

        let view = userIds.map((userId) => {
            console.log(" renderFriendsMarker userId: " + userId)
            let imageName = userId == Utils.uniqueId() ? "location" : "location1"

            return this.renderMarker(userId, imageName)
        })

        return view
    }

    renderMarker = (userId, imageName) => {

        console.log("renderFriendsMarker : 222" + userId)

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
                    this.setState({userId1: "2F30A26F-AC5D-4644-80FE-EB7A3D4E7E3E"})
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
        const regionOk = this.regionFrom(
            this.state.currentCoordinate.latitude,
            this.state.currentCoordinate.longitude,
            300)

        return (
            <MapView
                provider={PROVIDER_GOOGLE}
                showsCompass={true}
                style={styles.map}
                region={regionOk}
                onRegionChangeComplete={(region) => {
                    console.log(" region", region)
                }}>

                {this.renderFriendsMarker()}
            </MapView>
        )
    }

    render() {
        console.log("render_x MapViewScreen : " + this.props.store.userState.currentUser)

        return (
            <View style={styles.container}>
                {this.renderMapView()}
                {this.renderTools()}
                {!this.props.store.mapState.channelId && this.renderBottomBar()}

            </View>
        );
    }

    componentWillReceiveProps = (newProps) => {
        console.log("MapView componentWillReceiveProps: " + JSON.stringify(newProps))

        // this.setState({currentCoordinate: newProps.store.mapState.currentCoordinate})
    }

    componentDidMount = () => {
        this.subscribeInbox()
        this.getCurrentPosition()
        this.autoUpdateMyPosition()

        this.props.navigation
            .setParams({
                rightButtonOnPress: this.rightButtonOnPress,
                channelId: this.props.store.mapState.channelId
            });

        console.log("MapView componentDidMount")

        // this.props.dispatch({type: ActionTypes.SAGA_GET_CURRENT_USER})
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

