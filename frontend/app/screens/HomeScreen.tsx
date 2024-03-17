import { Button } from "app/components/Button"
import { supabase } from "app/features/auth/lib/supabase"
import Watch from "app/features/watch"
import { useStores } from "app/models/helpers/useStores"
import { AppStackScreenProps } from "app/navigators"
import { observer } from "mobx-react-lite"
import React from "react"
import { View, Text, ViewStyle, Alert } from "react-native"

interface HomeScreenProps extends AppStackScreenProps<"Home"> {}

export const HomeScreen: React.FC<HomeScreenProps> = observer(function HomeScreen() {
  const { isAuthenticated } = useStores()

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      Alert.alert("Logout failed", error.message)
    } else {
      // Optionally, navigate to a different screen or update the UI accordingly
    }
  }

  return (
    <View style={$container}>
      <Watch />

      <Text>
        Welcome to the Home Screen! You are {isAuthenticated ? "Logged in" : "Not logged in"}
        <Button text="Logout" onPress={signOut}></Button>
      </Text>
    </View>
  )
})

const $container: ViewStyle = {
  paddingTop: 50,
}
