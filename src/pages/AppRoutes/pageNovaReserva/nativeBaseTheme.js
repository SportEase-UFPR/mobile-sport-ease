import React from 'react';
import { ChevronRightIcon, NativeBaseProvider, extendTheme } from 'native-base';

const temaGeralFormulario = extendTheme({
    components: {
        Select: {
            baseStyle: {
                fontSize: '15',
            }
        },
        Input: {
            baseStyle: {
                style: { fontSize: 15 },
                color: 'green.900',
                backgroundColor: 'white',
                placeholderTextColor: 'gray.500',
            },
            defaultProps: {
                variant: 'filled',
            }
        },
        TextArea: {
            defaultProps: {
                variant: 'filled',
            }
        }
    },
});

export default (
    temaGeralFormulario
);
