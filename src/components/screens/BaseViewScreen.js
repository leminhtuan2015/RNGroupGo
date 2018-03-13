import React from "react";
import NavBarItem from "../views/NavBarItem"

class BaseViewScreen extends React.Component {

    static navigationOptions = ({navigation}) => {
        const {params = {}} = navigation.state;

        const headerLeft =
            <NavBarItem
                iconName="times"
                color="gray"
                onPress={() => {
                    navigation.goBack()
                }}/>

        return {
            drawerLabel: '',
            tabBarLabel: '',
            headerLeft: headerLeft,
        }
    }

    constructor(props) {
        super(props)
    }

}

export default BaseViewScreen