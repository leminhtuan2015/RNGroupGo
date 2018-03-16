import React from 'react';
import {
    StackNavigator
} from 'react-navigation';


import MapViewContainer from '../../containers/MapViewContainer'
import ContactViewContainer from '../../containers/ContactViewContainer'
import ProfileViewContainer from '../../containers/ProfileViewContainer'

import FriendViewScreen from './FriendViewScreen'
import SettingViewScreen from './SettingViewScreen'
import UpdateProfileViewScreen from './UpdateProfileViewScreen'

import RequestingLocationContainer from '../../containers/RequestingLocationContainer'
import InCommingRequestLocationContainer from "../../containers/InCommingRequestLocationContainer"

const StackNavigatorView = StackNavigator(
    {
        ProfileView: {screen: ProfileViewContainer},
        MapView: {screen: MapViewContainer},
        ContactView: {screen: ContactViewContainer},
        FriendView: {screen: FriendViewScreen},
        UpdateProfileView: {screen: UpdateProfileViewScreen},
        SettingView: {screen: SettingViewScreen,},
        RequestingLocationView: {screen: RequestingLocationContainer},
        InCommingRequestLocationView: {screen: InCommingRequestLocationContainer},
    },
    {
        mode: "modal",
    }
);

export default StackNavigatorView
