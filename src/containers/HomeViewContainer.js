import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';

import User from "../models/User"
import HomeView from '../components/screens/HomeView.js';

// 'stateObject' is the object store.getState() from <Provider store={Store}>
// Provider is given the store as a prop
const mapStateToProps = (store) => ({
  store: store,
  users: User.all(),
})


//const HomeViewContainer = connect(mapStateToProps, mapDispatchToProps)(HomeView)
const HomeViewContainer = connect(mapStateToProps)(HomeView)

export default HomeViewContainer 
