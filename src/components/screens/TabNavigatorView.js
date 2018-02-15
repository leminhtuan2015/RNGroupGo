import React from 'react';
import { Text, View, Button } from 'react-native';
import { 
  TabNavigator, 
  TabBarBottom,
  StackNavigator 
} from 'react-navigation';

import { 
  List,
  Icon,
} from 'react-native-elements'

import IconManager from "../../utils/IconManager"

import HomeViewContainer from '../../containers/HomeViewContainer';
import PlaceViewContainer from '../../containers/PlaceViewContainer';
import AddPlaceViewContainer from '../../containers/AddPlaceViewContainer';

import MapViewContainer from '../../containers/MapViewContainer';
import ContactViewContainer from '../../containers/ContactViewContainer';
import GroupViewScreen from './GroupViewScreen';
import SettingViewScreen from './SettingViewScreen';

const TabStackWeather = StackNavigator({
  TabStackHomeScreen: { screen: HomeViewContainer},
  TabStackPlaceScreen: { screen:  PlaceViewContainer},
  TabStackAddPlaceScreen: { screen:  AddPlaceViewContainer},
},
{
});

const TabNavigatorView =  TabNavigator(
  {
    TabStackWeather: {
      screen: TabStackWeather, 
      navigationOptions: ({navigation}) => ({
				showLabel: false,
				tabBarIcon: IconManager.icon("apple", "black", () => {
					navigation.navigate("TabStackWeather")
				}),
				showIcon: true
		  }) 
    },

    MapView: {
      screen: MapViewContainer, 
      navigationOptions: ({navigation}) => ({
				showLabel: false,
				tabBarIcon: IconManager.icon("map-marker", "black", () => {
					navigation.navigate("MapView")
				}),
				showIcon: true
		  }) 
    },

    ContactView: {
      screen: ContactViewContainer, 
      navigationOptions: ({navigation}) => ({
				showLabel: false,
				tabBarIcon: IconManager.icon("user", "black", () => {
					navigation.navigate("ContactView")
				}),
				showIcon: true
		  }) 
    },

    GroupView: {
      screen: GroupViewScreen, 
      navigationOptions: ({navigation}) => ({
				showLabel: false,
				tabBarIcon: IconManager.icon("users", "black", () => {
					navigation.navigate("GroupView")
				}),
				showIcon: true
		  }) 
    },
    
    SettingView: {
      screen: SettingViewScreen, 
      navigationOptions: ({navigation}) => ({
				showLabel: false,
				tabBarIcon: IconManager.icon("bars", "black", () => {
					navigation.navigate("SettingView")
				}),
				showIcon: true
		  }) 
    },


  },

  {
  }
);

export default TabNavigatorView
