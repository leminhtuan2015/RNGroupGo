import React from 'react';
import {
    View,
    Text, StyleSheet,
} from "react-native"

import {
    Button
} from "react-native-elements"

import * as ActionTypes from "../../constants/ActionTypes"
import FirebaseAuthHelper from "../../helpers/FirebaseAuthHelper";

class ProfileViewScreen extends React.Component {
    static navigationOptions = {
        drawerLabel: 'Profile',
    };

    constructor(props) {
        super(props)

        this.state = {
            isLoggedIn: FirebaseAuthHelper.isLoggedIn()
        }
    }

    renderLoginButtons = () => {
        return (
            <View>
                <Button
                    onPress={() => {FirebaseAuthHelper.facebookLogin()}}
                    raised
                    backgroundColor="#385691"
                    icon={{name: "facebook", type: "font-awesome"}}
                    title="Login With Facebook" />

                <Text />

                <Button
                    raised
                    backgroundColor="#DB4D40"
                    icon={{name: "google", type: "font-awesome"}}
                    title="Login With Google" />
            </View>
        )
    }

    renderUser = () => {
        return(
            <View>
                <Text>{FirebaseAuthHelper.currentUser().displayName}</Text>
                <Button
                    onPress={() => {FirebaseAuthHelper.logout()}}
                    raised
                    backgroundColor="#DB4D40"
                    title="Logout" />
            </View>
        )

    }

    render() {
        return (
            <View style={styles.container}>
                {!this.state.isLoggedIn && this.renderLoginButtons()}
                {this.state.isLoggedIn && this.renderUser()}

                <Button
                    onPress={() => {this.props.dispatch({type: ActionTypes.SAGA_FACEBOOK_GET_ACCESS_TOKEN})}}
                    raised
                    backgroundColor="#DB4D40"
                    title="TOKEN" />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        alignItems: 'center',
    },

});

export default ProfileViewScreen




