import React from 'react';
import { View, Button, Text } from 'react-native';

import { useAuth } from '../../contexts/AuthContext';

const PageHomescreen = ({ navigation }) => {
    const { onLogout } = useAuth(); // Chama o hook aqui

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Home ;D</Text>
            <Button
                title="Deslogar"
                onPress={onLogout} // Usa a função aqui
            />
        </View>
    );
};


PageHomescreen.navigationOptions = {
    title: 'Home',
}

export default PageHomescreen;