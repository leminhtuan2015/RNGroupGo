import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';

import ContactView from '../components/screens/ContactViewScreen.js';

const mapStateToProps = (store) => ({
  store: store,
})

const ContactViewContainer = connect(mapStateToProps)(ContactView)

export default ContactViewContainer 
