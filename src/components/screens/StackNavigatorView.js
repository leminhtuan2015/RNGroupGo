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
import GroupViewContainer from '../../containers/GroupViewContainer';
import FriendViewScreen from './FriendViewScreen';
import SettingViewScreen from './SettingViewScreen';
import ChattingViewScreen from './ChattingViewScreen';

const StackNavigatorView =  StackNavigator(
  {
    MapView: {
      screen: MapViewContainer, 
    },
 
    FriendView: {
      screen: FriendViewScreen, 
    },

    GroupView: {
      screen: GroupViewContainer, 
    },
   
    SettingView: {
      screen: SettingViewScreen, 
    },


  },
  {
    mode: "modal",
  }
);

export default StackNavigatorView
