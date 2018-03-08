import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
} from "react-native"

import {
    Button
} from "react-native-elements"

import * as ActionTypes from "../../constants/ActionTypes"

class ProfileViewScreen extends React.Component {

    constructor(props) {
        super(props)
    }

    renderLoginButtons = () => {
        return (
            <View>
                <Button
                    onPress={() => {this.props.dispatch({type: ActionTypes.SAGA_FACEBOOK_LOGIN})}}
                    raised
                    backgroundColor="#385691"
                    icon={{name: "facebook", type: "font-awesome"}}
                    title="Login With Facebook" />

                <Text />

                <Button
                    onPress={() => {this.props.dispatch({type: ActionTypes.SAGA_GOOGLE_LOGIN})}}
                    raised
                    backgroundColor="#DB4D40"
                    icon={{name: "google", type: "font-awesome"}}
                    title="Login With Google" />

                <Button
                    onPress={() => {
                        this.props.dispatch(
                            {type: ActionTypes.SAGA_PHONE_NUMBER_LOGIN,
                                phoneNumber: "+841629715498",
                            })
                        }
                    }
                    raised
                    backgroundColor="#DB4D40"
                    icon={{name: "google", type: "font-awesome"}}
                    title="Login With Phone" />
            </View>
        )
    }

    renderUser = () => {
        return(
            <View>
                <Text>{this.props.store.profileState.currentUser.displayName}</Text>
                <Text />

                <Image
                    style={{width: 66, height: 58}}
                    source={{uri: this.props.store.profileState.currentUser.photoURL}}
                />

                <Button
                    onPress={() => {this.props.dispatch({type: ActionTypes.SAGA_USER_LOGOUT})}}
                    raised
                    backgroundColor="#DB4D40"
                    title="Logout" />
            </View>
        )

    }

    render = () => {
        console.log("render_x ProfileViewScreen")

        return (
            <View style={styles.container}>
                {(this.props.store.profileState.currentUser != null) ?
                    this.renderUser() : this.renderLoginButtons()
                }
            </View>
        )
    }

    componentDidMount = () => {
        this.props.dispatch({type: ActionTypes.PROFILE_GET_CURRENT_USER})
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




