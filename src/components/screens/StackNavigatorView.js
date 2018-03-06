import React from 'react';
import {
    StackNavigator
} from 'react-navigation';


import MapViewContainer from '../../containers/MapViewContainer';
import ContactViewContainer from '../../containers/ContactViewContainer';
import FriendViewScreen from './FriendViewScreen';
import ProfileViewScreen from './ProfileViewScreen';
import SettingViewScreen from './SettingViewScreen';

import RequestingLocationContainer from '../../containers/RequestingLocationContainer';
import InCommingRequestLocationScreen from "./InCommingRequestLocationScreen";

const StackNavigatorView = StackNavigator(
    {
        MapView: {screen: MapViewContainer},
        ContactView: {screen: ContactViewContainer},
        FriendView: {screen: FriendViewScreen},
        ProfileView: {screen: ProfileViewScreen},
        SettingView: {screen: SettingViewScreen,},

        RequestingLocationView: {screen: RequestingLocationContainer},
        InCommingRequestLocationView: {screen: InCommingRequestLocationScreen},
    },
    {
        mode: "modal",
    }
);

export default StackNavigatorView
