import { Navigation } from 'react-native-navigation';
import { AppRegistry} from 'react-native';
import React from 'react';
import { Provider, connect } from 'react-redux';

import Store from './src/store/Store';
import RootNavigatorViewContainer from './src/navigator/RootNavigatorViewContainer';

const RootView = () => (
  <Provider store={Store}>
    <RootNavigatorViewContainer />
  </Provider>
)

AppRegistry.registerComponent('demo_react_native', () => RootView);
