import { DrawerNavigator, StackNavigator } from 'react-navigation';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Button,
  Image,
  Text,
  View,
} from "react-native"

import { 
  Icon,
} from 'react-native-elements'

import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import { Marker } from 'react-native-maps';
import NavBarItem from '../views/NavBarItem';

let { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.01;
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

class DrawerHomeScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Drawer Home Screen',
  };

  render() {
    return (
      <View>
       <Button
        onPress={() => this.props.navigation.navigate('DrawerDetailScreen')}
        title="Go to Detail"
      />
      <Button
        onPress={() => this.props.navigation.navigate('HomeView')}
        title="Go to Weather"
      />

      </View>
    );
  }
}

class DrawerDetailScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Drawer Detail Screen',
  };

  render() {
    return (
      <Button
        onPress={() => this.props.navigation.goBack()}
        title="Go back"
      />
    );
  }
}

class DrawerSettingScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Drawer Setting Screen',
  };

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

  render() {
    return (
<View style={styles.container}>
		<MapView
			provider={PROVIDER_GOOGLE}
      showsCompass={true}
      style={styles.map}
			region={this.regionFrom(21.0150778, 105.9258556, 1000)}
			onRegionChangeComplete = {(region) => {
				console.log(" region", region)
			}}
		>
    <Marker
      coordinate={{
         latitude: 21.0150778, 
         longitude:105.9258556, 
      }}
      title="2"
      description="marker.description"
      image={require('../../resources/images/location2.png')}
    />
		<Marker
      coordinate={{
				latitude: 21.016871, 
				longitude: 105.925319}}
      title="1"
      description="marker.description"
      image={require('../../resources/images/location1.png')}
    />

  </MapView>
</View>
    );
  }
}

const drawerOnPress = (navigation) => {
  console.log("Drawer Button Pressed: " + JSON.stringify(navigation.state))

  if (navigation.state.index === 0) {
    navigation.navigate('DrawerOpen')
  } else {
    navigation.navigate('DrawerClose')
  }
}

const drawerIcon1 = navigation => (
  <NavBarItem
    iconName="bars"
    onPress={() => {
      if (navigation.state.index === 0) {
        // check if drawer is not open, then only open it
        navigation.navigate('DrawerOpen');
      } else {
        // else close the drawer
        navigation.navigate('DrawerClose');
      }
    }}
  />
);

const drawerIcon = (navigation) => (<Icon 
  name="menu"
  marginLeft={30}
  size={30}
  color='#ffffff'
  underlayColor="transparent"
  onPress={() => drawerOnPress(navigation)} 
  />)

const DrawerNavigatorView = DrawerNavigator({
  DrawerHomeScreen: {screen: DrawerHomeScreen},
  DrawerDetailScreen: {screen: DrawerDetailScreen},
  DrawerSettingScreen: {screen: DrawerSettingScreen},
},
{
 // drawerWidth: 200,
  drawerPosition: "left",
  initialRouteName: "DrawerSettingScreen",
  navigationOptions: ({navigation}) => ({
    headerStyle: {backgroundColor: 'green'},
    title: '',
    headerLeft: drawerIcon1(navigation), 
  })
});

const DrawerStackView = StackNavigator({
  drawer: { screen: DrawerNavigatorView }
}, {
  headerMode: 'none',
  navigationOptions: ({navigation}) => ({
    headerStyle: {backgroundColor: 'green'},
    title: '',
    gesturesEnabled: false,
    headerLeft: drawerIcon1(navigation), 
  })
})

export default DrawerStackView
//export default DrawerNavigatorView

