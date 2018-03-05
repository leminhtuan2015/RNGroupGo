import React, {Component} from 'react';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';

import RequestingLocationScreen from '../components/screens/RequestingLocationScreen.js';

const mapStateToProps = (store) => ({
    store: store,
})

const RequestingLocationContainer = connect(mapStateToProps)(RequestingLocationScreen)

export default RequestingLocationContainer
