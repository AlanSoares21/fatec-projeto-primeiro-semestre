import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Image } from 'react-native';

export default function WorkDiscussionScreen(): React.JSX.Element {
    const imageBackgroundColor = useThemeColor({ }, 'inputBackground')
    const { workid } = useLocalSearchParams();

    return <ParallaxScrollView
            headerImage={<Image 
                style={{width: '100%', height: '100%'}}
                source={require('@/assets/images/react-logo.png')} 
            />}
            headerBackgroundColor={{
                dark: imageBackgroundColor, 
                light: imageBackgroundColor
            }}
        >
        <ThemedText>
            work discussion for work {workid}
        </ThemedText>
        
    </ParallaxScrollView>
}