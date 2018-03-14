import React, {Component} from 'react';
import {connect} from 'react-redux';

import InCommingRequestLocationScreen from '../components/screens/InCommingRequestLocationScreen.js';

const mapStateToProps = (store) => ({
    store: store,
})

const InCommingRequestLocationContainer = connect(mapStateToProps)(InCommingRequestLocationScreen)

export default InCommingRequestLocationContainer
