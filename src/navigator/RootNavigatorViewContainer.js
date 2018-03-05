import React from 'react';
import {addNavigationHelpers} from 'react-navigation';
import {connect} from 'react-redux';

import RootNavigatorView from "./RootNavigatorView"

const mapStateToProps = (state) => ({
    nav: state.nav
});

const NavigatorViewHelper = ({dispatch, nav}) => (
    <RootNavigatorView
        navigation={addNavigationHelpers({
            dispatch,
            state: nav
        })}
    />
);

const RootNavigatorViewContainer = connect(mapStateToProps)(NavigatorViewHelper);

export default RootNavigatorViewContainer
