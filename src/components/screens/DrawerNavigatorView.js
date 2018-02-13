import { DrawerNavigator, StackNavigator } from 'react-navigation';
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

import { 
  Icon,
} from 'react-native-elements'

import NavBarItem from '../views/NavBarItem';
import MapViewContainer from '../../containers/MapViewContainer';
import ContactViewContainer from '../../containers/ContactViewContainer';

import GroupViewScreen from './GroupViewScreen';
import ProfileViewScreen from './ProfileViewScreen';
import SettingViewScreen from './SettingViewScreen';

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
  MapViewContainer: {screen: MapViewContainer},
  ContactViewContainer: {screen: ContactViewContainer},
  GroupViewScreen: {screen: GroupViewScreen},
  ProfileViewScreen: {screen: ProfileViewScreen},
  SettingViewScreen: {screen: SettingViewScreen},
},
{
 // drawerWidth: 200,
  drawerPosition: "left",
  initialRouteName: "MapViewContainer",
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

