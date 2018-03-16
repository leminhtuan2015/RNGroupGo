import React, {Component} from 'react';
import {connect} from 'react-redux';

import UpdateProfileView from '../components/screens/UpdateProfileViewScreen';

const mapStateToProps = (store) => ({
    store: store,
})

const UpdateProfileViewContainer = connect(mapStateToProps)(UpdateProfileView)

export default UpdateProfileViewContainer
