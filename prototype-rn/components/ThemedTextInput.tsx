import { useThemeColor } from "@/hooks/useThemeColor";
import { TextInput, TextInputProps, StyleSheet } from "react-native";

export type ThemedTextInputProps = TextInputProps & {
    lightColor?: string;
    darkColor?: string;
    type?: 'default';
  };
  

export default function ThemedTextInput({
    lightColor, 
    darkColor,
    type = 'default', 
    style,
    ...rest
}: ThemedTextInputProps): React.JSX.Element {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'inputBackground');

    return (<TextInput
        style={[
            { backgroundColor: color },
            type === 'default' ? styles.default : undefined,
            style,
          ]}
          {...rest}
    />);
}

const styles = StyleSheet.create({
    default: {
      fontSize: 18,
      lineHeight: 28,
      padding: 10
    }
});