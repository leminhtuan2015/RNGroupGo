import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {Marker, AnimatedRegion} from 'react-native-maps';
import React from 'react';
import Toast from 'react-native-toast-native';
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

import {NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconManager from "../../utils/IconManager"
import MarkerAnimatedView from "../views/MarkerAnimatedView"
import NavBarItem from "../views/NavBarItem"

import * as Constant from "../../utils/Constant"
import * as Utils from "../../utils/Utils"
import * as ActionTypes from "../../constants/ActionTypes"
import ImageManager from "../../utils/ImageManager"
import MessageService from "../../services/MessageService"

let {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.001;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

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
        latitude: 0,
        longitude: 0,
    }

    constructor(props) {
        super(props)

        this.state = {
            currentCoordinate: MapViewScreen.defaultCoordinate,
        }

        this.messageService = new MessageService(this)
        this.timerId = null
        this.reloadComponent = true
        this.bind()
    }

    componentWillReceiveProps = (newProps) => {
        console.log("MapView will receive props")

        this.setState({currentCoordinate: newProps.store.mapState.currentCoordinate})
    }

    componentDidMount = () => {
        this.getCurrentPosition()

        this.props.navigation
            .setParams({rightButtonOnPress: this.rightButtonOnPress,
                channelId: this.props.store.mapState.channelId});
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
        //this.props.dispatch({type: ActionTypes.GET_CURRENT_PLACE})
        // NEED REFACTOR
        Utils.getCurrentPosition((region, error) => {
            console.log("Get Current Position done : " + JSON.stringify(region))
            console.log("Get Current Position error : " + JSON.stringify(error))

            if (region) {
                const text = "lat:" + region.latitude + "\n" + "lon:" + region.longitude
                //Toast.show(text, Toast.SHORT, Toast.TOP, Constant.styleToast);
                this.setState({currentCoordinate: region})
                this.reloadComponent = false

                this.props.dispatch({
                    type: ActionTypes.UPDATE_CURRENT_PLACE_TO_FIREBASE,
                    data: region
                })
            }
        })
    }

    bind = () => {
        this.autoUpdateMyPosition()
        this.messageService.subscribeInbox("users/" + Utils.uniqueId() + "/inbox")
    }

    autoUpdateMyPosition = () => {
        this.timerId = setInterval(this.getCurrentPosition, 10 * 1000)
    }

    stopUpdateMyPosition = () => {
        if (this.timerId) {
            clearInterval(this.timerId)
        }
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

    shouldComponentUpdate() {
        return this.reloadComponent
        //return true
    }

    componentWillUnmount() {
        console.log("will un-mount")
        this.stopUpdateMyPosition()
    }

    renderFriendsMarker = () => {
        let userId = this.props.store.mapState.userId
        console.log(" renderFriendsMarker : " + JSON.stringify(userId))

        let userIds = []

        if(userId){
            userIds.push(userId)
        }

        let view = userIds.map((userId) => {
            console.log(" renderFriendsMarker_ : " + userId)
            return this.renderMarker(userId, "location1")
        })

        let meMarker = this.renderMarker(Utils.uniqueId(), "location")

        if (userIds.length) {
            return (
                <View>
                    {meMarker}
                    {view}
                </View>
            )
        } else {
            return meMarker
        }
    }

    renderMarker = (userId, imageName) => {
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

                    {IconManager.icon("user", "gray", () => {
                        this.props.navigation.navigate("FriendView")
                    }, 30, "gray")}

                    {IconManager.icon("users", "gray", () => {
                        this.props.navigation.navigate("GroupView")
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
                {IconManager.icon("plus-circle", "gray", null)}
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

    render() {
        const regionOk = this.regionFrom(
            this.state.currentCoordinate.latitude,
            this.state.currentCoordinate.longitude,
            300)

        return (
            <View style={styles.container}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    showsCompass={true}
                    style={styles.map}
                    region={regionOk}
                    onRegionChangeComplete={(region) => {
                        console.log(" region", region)
                    }} >

                    {this.renderFriendsMarker()}
                </MapView>

                {this.renderTools()}
                {!this.props.store.mapState.channelId && this.renderBottomBar()}

            </View>
        );
    }
}

export default MapViewScreen

