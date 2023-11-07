import React from 'react';
import { extendTheme } from 'native-base';

const temaGeralFormulario = extendTheme({
    components: {
        Input: {
            baseStyle: {
                style: { fontSize: 15 },
                color: 'black',
                backgroundColor: 'white',
                placeholderTextColor: 'gray.500',
            },
            defaultProps: {
                variant: 'filled',
            }
        },
    },
});

export default (
    temaGeralFormulario
);
