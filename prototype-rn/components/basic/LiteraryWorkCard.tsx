import { useThemeColor } from '@/hooks/useThemeColor';
import { ReactElement } from 'react';
import { View, ViewProps } from 'react-native';

export type TLiteraryWorkCard = ViewProps & {
    lightColor?: string;
    darkColor?: string;
    rigth?: ReactElement;
    left?: ReactElement;
}

export default function LiteraryWorkCard({
    rigth,
    left,
    lightColor, 
    darkColor, 
    style, 
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
                padding: 8
            }
        ]}
        {...otherProps}
    >
        <View 
            style={{
                width: '50%', 
                height: '100%',
                borderRadius: 8,
                backgroundColor: imageBackground
            }}
        >
            {left}
        </View>
        <View style={{height: '100%'}}>
            {rigth}
        </View>
    </View>;
}