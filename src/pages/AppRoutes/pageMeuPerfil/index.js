import React from 'react';
import { View, Button, Text } from 'react-native';

import { useAuth } from '../../../contexts/AuthContext';

const PageMeuPerfil = ({ navigation }) => {
    const { onLogout } = useAuth(); 

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Home ;D</Text>
            <Button
                title="Deslogar"
                onPress={onLogout}
            />
        </View>
    );
};


PageMeuPerfil.navigationOptions = {
    title: 'Meu Perfil',
}

export default PageMeuPerfil;