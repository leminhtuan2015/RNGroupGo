import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';

import AddPlaceView from '../components/screens/AddPlaceView.js';

// 'stateObject' is the object from <Provider store={Store}>
// Provider is given the store as a prop
const mapStateToProps = (store) => ({
  store: store
})


const AddPlaceViewContainer = connect(mapStateToProps)(AddPlaceView)

export default AddPlaceViewContainer 

