import React, {Component} from 'react';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';

import SettingView from '../components/screens/SettingViewScreen.js';

const mapStateToProps = (store) => ({
    store: store,
})

const SettingViewContainer = connect(mapStateToProps)(SettingView)

export default SettingViewContainer
