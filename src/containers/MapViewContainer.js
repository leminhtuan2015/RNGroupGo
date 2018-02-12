import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';

import MapView from '../components/screens/MapViewScreen.js';

const mapStateToProps = (store) => ({
  store: store,
})

const MapViewContainer = connect(mapStateToProps)(MapView)

export default MapViewContainer 
