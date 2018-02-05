import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';

import PlaceView from '../components/screens/PlaceView.js';

// 'store' is the object from <Provider store={Store}>
// Provider is given the store as a prop
const mapStateToProps = (store) => ({
  store: store,
})

const mapDispatchToProps = (dispatch) => ({
  getWeather: () => {
    dispatch({type: ActionTypes.GET_WEATHER_DATA, 
      data: {city: "French", countyCode: "fr"}})
  },
})

//const DetailViewContainer = connect(mapStateToProps, mapDispatchToProps)(DetailView)
const PlaceViewContainer = connect(mapStateToProps)(PlaceView)

export default PlaceViewContainer 
