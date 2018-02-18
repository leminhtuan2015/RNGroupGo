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

import * as Constant from "../../utils/Constant"
import IconManager from "../../utils/IconManager"

import MapViewContainer from '../../containers/MapViewContainer';
import ContactViewContainer from '../../containers/ContactViewContainer';
import GroupViewScreen from './GroupViewScreen';
import SettingViewScreen from './SettingViewScreen';
import ChattingViewScreen from './ChattingViewScreen';

const StackNavigatorView =  StackNavigator(
  {
    MapView: {
      screen: MapViewContainer, 
      navigationOptions: ({navigation}) => ({
				showLabel: false,
				tabBarIcon: IconManager.icon("map-marker", Constant.appColor, () => {
					navigation.navigate("MapView")
				}),
				showIcon: true
		  }) 
    },
 
    ContactView: {
      screen: ContactViewContainer, 
      navigationOptions: ({navigation}) => ({
				showLabel: false,
				tabBarIcon: IconManager.icon("user", Constant.appColor, () => {
					navigation.navigate("StackContactView")
				}),
				showIcon: true
		  }) 
    },

    GroupView: {
      screen: GroupViewScreen, 
      navigationOptions: ({navigation}) => ({
				showLabel: false,
				tabBarIcon: IconManager.icon("users", Constant.appColor, () => {
					navigation.navigate("GroupView")
				}),
				showIcon: true
		  }) 
    },
   
    SettingView: {
      screen: SettingViewScreen, 
      navigationOptions: ({navigation}) => ({
				showLabel: false,
				tabBarIcon: IconManager.icon("bars", Constant.appColor, () => {
					navigation.navigate("SettingView")
				}),
				showIcon: true
		  }) 
    },


  },

  {
  }
);

export default StackNavigatorView
