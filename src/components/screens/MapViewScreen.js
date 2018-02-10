import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import { Marker, AnimatedRegion } from 'react-native-maps';
import React from 'react';
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

import * as Utils from "../../utils/Utils"

let { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.001;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

class MapViewScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Map',
  };

  constructor(props){
    super(props)

    this.state = {
			coordinate: new AnimatedRegion({
         latitude: 21.016911, 
         longitude:105.925298, }),
		  currentCoordinate: {
				 latitude: 21.016911, 
         longitude:105.925298, 
			}
    }

    this.getData()
  }

  getData(){
   Utils.getCurrentPosition((region, error) => {
     console.log("Get Current Position done" + JSON.stringify(region))

     this.setState({currentCoordinate: region})
   }) 
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
			distance = distance/2
			const circumference = 40075
			const oneDegreeOfLatitudeInMeters = 111.32 * 1000
			const angularDistance = distance/circumference

			const latitudeDelta = distance / oneDegreeOfLatitudeInMeters
			const longitudeDelta = Math.abs(Math.atan2(
							Math.sin(angularDistance)*Math.cos(lat),
							Math.cos(angularDistance) - Math.sin(lat) * Math.sin(lat)))

			return result = {
					latitude: lat,
					longitude: lon,
					latitudeDelta,
					longitudeDelta,
			}
	}

  change = () => {
    const { coordinate } = this.state;
    const newCoordinate = {
      latitude: 21.0150778 + ((Math.random() - 0.5) * (LATITUDE_DELTA / 2)),
      longitude: 105.9258556 + ((Math.random() - 0.5) * (LONGITUDE_DELTA / 2)),
    };

    if (Platform.OS === 'android') {
      if (this.marker) {
        this.marker._component.animateMarkerToCoordinate(newCoordinate, 500);
      }
    } else {
      coordinate.timing(newCoordinate).start();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          showsCompass={true}
          style={styles.map}
          region={this.regionFrom(
              this.state.currentCoordinate.latitude,
              this.state.currentCoordinate.longitude,
              300)}
          onRegionChangeComplete = {(region) => {
            console.log(" region", region)
          }}
        >
          <MapView.Marker.Animated
            coordinate={this.state.currentCoordinate}
            title="2"
            description="marker.description"
            image={require('../../resources/images/location2.png')}
          />

          <MapView.Marker.Animated
            coordinate={this.state.coordinate}
            ref={marker => { this.marker = marker }}
            title="1"
            description="marker.description"
            image={require('../../resources/images/location1.png')}
          />
        </MapView>

        <TouchableOpacity onPress={() => this.change()}>
            <Text>Move</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default MapViewScreen





