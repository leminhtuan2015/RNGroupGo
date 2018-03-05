import React from 'react';
import {
    TabNavigator,
    TabBarBottom,
    StackNavigator
} from 'react-navigation';


import MapViewContainer from '../../containers/MapViewContainer';
import ContactViewContainer from '../../containers/ContactViewContainer';
import RequestingLocationContainer from '../../containers/RequestingLocationContainer';

import FriendViewScreen from './FriendViewScreen';
import SettingViewScreen from './SettingViewScreen';
import InCommingRequestLocationScreen from "./InCommingRequestLocationScreen";

const StackNavigatorView = StackNavigator(
    {
        MapView: {
            screen: MapViewContainer,
        },

        ContactView: {
            screen: ContactViewContainer,
        },

        FriendView: {
            screen: FriendViewScreen,
        },

        RequestingLocationView: {
            screen: RequestingLocationContainer,
        },

        InCommingRequestLocationView: {
            screen: InCommingRequestLocationScreen,
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
