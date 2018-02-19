import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
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
    latitude: 21.009792, 
    longitude: 105.823421
  }
  
  constructor(props){
    super(props)

		this.coordinateAnimated = 
      new AnimatedRegion(MarkerAnimatedView.defaultCoordinate);

    this.subscribe(this.props.userId)
  }

  subscribe = (userId) => {
    //let path = "users/709549E2-9BCD-4C27-9A41-C8EB112B4973/"
    let path = "users/" + userId

    FirebaseHelper.subscribe(path, (data) => {
      console.log("subscribe : " + JSON.stringify(data)) 
      const newCoordinate = data.coordinate
      console.log("subscribe To: " + JSON.stringify(newCoordinate)) 
      this.moveMarker(newCoordinate)
    })  
  }
  
  moveMarker = (newCoordinate) => {
    if (Platform.OS === 'android') {
      if (this.marker) {
        this.marker.
          _component.animateMarkerToCoordinate(newCoordinate, 500);
      }
    } else {
      this.coordinateAnimated.timing(newCoordinate).start();
    }
  }

  render() {
    return (
      <View>
        <MapView.Marker.Animated
          coordinate={this.coordinateAnimated}
          ref={marker => { this.marker = marker }}
          title={this.props.title}
          description={this.props.description}
        >
          {ImageManager(this.props.imageName)}
        </MapView.Marker.Animated>
      </View>
    );
  }
}

export default MarkerAnimatedView

