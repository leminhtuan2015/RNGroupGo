import React from 'react';
import {
    View,
    Button
} from "react-native"

import FacebookLoginHelper from "../../helpers/FacebookLoginHelper"
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

    render() {
        return (
            <View>
                <Button
                    onPress={() => {FirebaseAuthHelper.facebookLogin()}}
                    title="FB Login"
                    color="#841584"
                />

                {this.state.isLoggedIn &&
                (<Button
                    onPress={() => {
                        FirebaseAuthHelper.logout()}}
                    title="FB Logout"
                    color="#841584"
                />)}

                <Button
                    onPress={() => {
                        const currentUser = FirebaseAuthHelper.currentUser()
                        if(currentUser){
                            alert("User ID : " + currentUser.uid)
                        } else {
                            alert("Not Logged in")
                        }
                    }}
                    title="Current User"
                    color="#841584"
                />
            </View>
        )
    }
}

export default ProfileViewScreen




