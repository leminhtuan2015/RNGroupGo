import React from 'react';
import { addNavigationHelpers } from 'react-navigation';
import { connect } from 'react-redux';

import {
    createReduxBoundAddListener,
    createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';

import RootNavigatorView from "./RootNavigatorView"

const middleware = createReactNavigationReduxMiddleware(
    "root",
    state => state.nav,
);

const addListener = createReduxBoundAddListener("root");

const mapStateToProps = (state) => ({
    nav: state.nav
});

const NavigatorViewHelper = ({ dispatch, nav }) => (
    <RootNavigatorView
        navigation={addNavigationHelpers({
            dispatch,
            state: nav,
            addListener
        })}
    />
);

const RootNavigatorViewContainer = connect(mapStateToProps)(NavigatorViewHelper);

export default RootNavigatorViewContainer
