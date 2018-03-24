import MapView, {Marker, AnimatedRegion} from 'react-native-maps';
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
} from "react-native"

import * as Constant from "../../utils/Constant"
import * as ActionTypes from "../../constants/ActionTypes"
import ImageManager from "../../utils/ImageManager"
import FirebaseHelper from "../../helpers/FirebaseHelper"
import image from "../../resources/images/location1.png"

class MarkerAnimatedView extends React.Component {

    static defaultCoordinate = {
        latitude: 0.0,
        longitude: 0.0,
    }

    constructor(props) {
        super(props)

        this.coordinateAnimated = new AnimatedRegion(MarkerAnimatedView.defaultCoordinate);
        this.marker = null
        this.currentCoordinate = null

        console.log("constructor MarkerAnimatedView subscribe : " + this.props.userId)
    }

    subscribe = (userId) => {
        if(userId == null){return}

        let path = "users/" + userId

        FirebaseHelper.observe(path, (data) => {
            if(!data){ return}
            const newCoordinate = data.coordinate
            this.currentCoordinate = newCoordinate
            console.log("subscribe newCoordinate: " + JSON.stringify(newCoordinate))
            this.moveMarker(newCoordinate)
        })
    }

    moveMarker = (newCoordinate) => {
        console.log("newCoordinate: " + JSON.stringify(newCoordinate))

        if(!newCoordinate){
            return
        }

        if (Platform.OS === 'android') {
            if (this.marker && this.marker._component) {
                try {
                    this.marker._component.animateMarkerToCoordinate(newCoordinate, 500)
                } catch (error) {
                    console.log("Cannot move animateMarkerToCoordinate")
                }
            }
          } else {
            this.coordinateAnimated.timing(newCoordinate).start();
          }
    }

    render() {
        this.coordinateAnimated =
            new AnimatedRegion(this.currentCoordinate ? this.currentCoordinate : MarkerAnimatedView.defaultCoordinate);

        return (
            <View>
                <MapView.Marker.Animated
                    key={this.props.userId}
                    coordinate={this.coordinateAnimated}
                    ref={marker => {
                        this.marker = marker
                    }}
                    title={this.props.title}
                    description={this.props.description}
                >
                    {ImageManager(this.props.imageName)}
                </MapView.Marker.Animated>
            </View>
        );
    }

    componentDidMount = () => {
        this.subscribe(this.props.userId)
    }
    
}

export default MarkerAnimatedView

