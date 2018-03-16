import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity} from 'react-native';
import IconManager from "../../utils/IconManager";

class NavBarItem extends Component {
    render() {
        const {iconName, color = "#fff", onPress} = this.props;
        return (
            <TouchableOpacity
                style={{paddingHorizontal: 20}}
                onPress={() => onPress()}
            >
                {IconManager.ionIcon(iconName, 30, color, color, onPress)}
            </TouchableOpacity>

        );
    }
}

NavBarItem.propTypes = {
    iconName: PropTypes.string.isRequired,
};

export default NavBarItem;
