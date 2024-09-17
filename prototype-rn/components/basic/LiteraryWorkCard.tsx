import { useThemeColor } from '@/hooks/useThemeColor';
import { ReactElement } from 'react';
import { DimensionValue, View, ViewProps } from 'react-native';

export type TLiteraryWorkCard = ViewProps & {
    lightColor?: string;
    darkColor?: string;
    rigth?: ReactElement;
    left?: ReactElement;
    cardMaxHeigh?: DimensionValue;
}

export default function LiteraryWorkCard({
    rigth,
    left,
    lightColor, 
    darkColor, 
    style, 
    cardMaxHeigh,
    ...otherProps
}: TLiteraryWorkCard) {
    const backgroundColor = useThemeColor({ 
        light: lightColor, dark: darkColor }, 
        'inputBackground'
    );
    const imageBackground = useThemeColor({ 
        light: lightColor, dark: darkColor }, 
        'imageBackground'
    );  
    return <View 
        style={[
            style, 
            {
                flexDirection: 'row',
                gap: 8,
                backgroundColor,
                padding: 8,
                maxHeight: cardMaxHeigh
            }
        ]}
        {...otherProps}
    >
        <View 
            style={{
                width: '50%', 
                maxHeight: '100%',
                backgroundColor: imageBackground
            }}
        >
            {left}
        </View>
        <View style={{height: '100%', maxWidth: '45%'}}>
            {rigth}
        </View>
    </View>;
}