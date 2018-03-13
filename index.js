import {AppRegistry} from 'react-native';
import React from 'react';
import {Provider, connect} from 'react-redux';

import Store from './src/store/Store';
import RootNavigatorViewContainer from './src/navigator/RootNavigatorViewContainer';

const RootView = () => {
    return (
        <Provider store={Store}>
            <RootNavigatorViewContainer/>
        </Provider>
    )
}

AppRegistry.registerComponent('demo_react_native', () => RootView);
