import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';

import GroupView from '../components/screens/GroupViewScreen.js';

const mapStateToProps = (store) => ({
  store: store,
})

const GroupViewContainer = connect(mapStateToProps)(GroupView)

export default GroupViewContainer 
