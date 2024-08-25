import { useThemeColor } from "@/hooks/useThemeColor";
import { Button, ButtonProps, StyleSheet, View } from "react-native";

export type TThemedBtnProps = ButtonProps & {
    type?: 'default'
}

const styles = StyleSheet.create({
    'default': {

    }
})

export default function ThemedBtn({
    type,
    ...rest
}: TThemedBtnProps) {
    const color = useThemeColor({ }, 'btnBackground');
    return (
        <Button
            color={color}
            {...rest} 
        />
    )
}

