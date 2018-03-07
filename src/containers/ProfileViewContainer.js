import React, {Component} from 'react';
import {connect} from 'react-redux';

import ProfileView from '../components/screens/ProfileViewScreen.js';

const mapStateToProps = (store) => ({
    store: store,
})

const ProfileViewContainer = connect(mapStateToProps)(ProfileView)

export default ProfileViewContainer
