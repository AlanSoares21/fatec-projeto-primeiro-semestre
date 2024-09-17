import { literaryWorksToShow, username } from "@/components/CommomDataContext";
import ThemedBtn from "@/components/ThemedBtn";
import { ThemedText } from "@/components/ThemedText";
import ThemedTextInput from "@/components/ThemedTextInput";
import { ThemedView } from "@/components/ThemedView";
import { TLastLiteraryWork } from "@/constants/types";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    'view': {
        width: '60%'
    }
})

export default function LoginScreen(): React.JSX.Element {
    const [txtUsername, setTxtUsername] = useState<string>();

    const handleLogin = async () => {
        if (txtUsername) {
            username.set(txtUsername)
                .then(() => router.navigate("/(tabs)"));
        }
    }

    return (<ThemedView 
        style={{
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8,
            paddingTop: 8
        }}
    >
        <ThemedText type='title'>
            Bem vindo ao Leia!
        </ThemedText>
        <ThemedText type='default'>
            Realize login para prosseguir
        </ThemedText>
        <ThemedView style={styles.view}>
            <ThemedTextInput 
                value={txtUsername}
                onChangeText={setTxtUsername}
                placeholder="Username ou email" 
            />
        </ThemedView>
        <ThemedView style={styles.view}>
            <ThemedBtn 
                title="login" 
                onPress={handleLogin}           
            />
        </ThemedView>
    </ThemedView>)
}