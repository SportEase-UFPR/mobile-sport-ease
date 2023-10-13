import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import COLORS from '../../colors/colors';

const Input = ({
    label,
    placeholder,
    iconName,
    error,
    password,
    onFocus = () => { },
    disabled = false,
    numeric = false, 
    ...props
}) => {
    const [hidePassword, setHidePassword] = React.useState(password);
    const [isFocused, setIsFocused] = React.useState(false);

    return (
        <View>
            <Text style={style.label}>{label}</Text>
            <View
                style={[
                    style.inputContainer,
                    {
                        borderColor: error
                            ? COLORS.red
                            : isFocused
                                ? COLORS.darkBlue
                                : COLORS.light,
                        alignItems: 'center',
                        opacity: disabled ? 0.5 : 1,
                    },
                    style.shadowProp
                ]}
            >
                <TextInput
                    placeholder={placeholder}
                    autoCorrect={false}
                    onFocus={() => {
                        onFocus();
                        setIsFocused(true);
                    }}
                    onBlur={() => setIsFocused(false)}
                    secureTextEntry={hidePassword}
                    style={{ flex: 1 }}
                    editable={!disabled}
                    keyboardType={numeric ? 'numeric' : 'default'}
                    {...props}
                />
                {password && (
                    <Icon
                        onPress={() => setHidePassword(!hidePassword)}
                        name={hidePassword ? 'eye-outline' : 'eye-off-outline'}
                        style={{ color: COLORS.grey, fontSize: 22 }}
                    />
                )}
            </View>
            {error && (
                <Text style={{ marginTop: 7, color: COLORS.red, fontSize: 12, textAlign: 'left' }}>
                    {error}
                </Text>
            )}
        </View>
    );
};

const style = StyleSheet.create({
    label: {
        marginBottom: 0,
        fontSize: 14,
        color: '#aaa',
    },
    inputContainer: {
        borderRadius: 12,
        height: 55,
        backgroundColor: '#fff',
        flexDirection: 'row',
        paddingHorizontal: 15,
        borderWidth: 0.5,
    },
    shadowProp: {
        shadowColor: '#000000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
});

export default Input;
