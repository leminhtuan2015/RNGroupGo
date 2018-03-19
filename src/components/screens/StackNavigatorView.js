import React from 'react';
import {
    StackNavigator
} from 'react-navigation';


import MapViewContainer from '../../containers/MapViewContainer'
import ContactViewContainer from '../../containers/ContactViewContainer'
import ProfileViewContainer from '../../containers/ProfileViewContainer'
import UpdateProfileViewContainer from '../../containers/UpdateProfileViewContainer'
import UpdatePhoneNumberViewContainer from '../../containers/UpdatePhoneNumberContainer'
import RequestingLocationContainer from '../../containers/RequestingLocationContainer'
import InCommingRequestLocationContainer from "../../containers/InCommingRequestLocationContainer"
import FriendViewContainer from "../../containers/FriendViewContainer"
import SettingViewContainer from "../../containers/SettingViewContainer"

const StackNavigatorView = StackNavigator(
    {
        SettingView: {screen: SettingViewContainer},
        MapView: {screen: MapViewContainer},
        ProfileView: {screen: ProfileViewContainer},
        ContactView: {screen: ContactViewContainer},
        UpdateProfileView: {screen: UpdateProfileViewContainer},
        UpdatePhoneNumberView: {screen: UpdatePhoneNumberViewContainer},
        RequestingLocationView: {screen: RequestingLocationContainer},
        InCommingRequestLocationView: {screen: InCommingRequestLocationContainer},
        FriendView: {screen: FriendViewContainer},
    },
    {
        mode: "modal",
    }
);

export default StackNavigatorView
