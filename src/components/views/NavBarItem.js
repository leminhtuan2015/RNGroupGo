import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

class NavBarItem extends Component {
    render() {
        const {iconName, color = "#fff", onPress} = this.props;
        return (
            <TouchableOpacity
                style={{paddingHorizontal: 20}}
                onPress={() => onPress()}
            >
                <Icon name={iconName} size={25} color={color}/>
            </TouchableOpacity>

        );
    }
}

NavBarItem.propTypes = {
    iconName: PropTypes.string.isRequired,
};

export default NavBarItem;
