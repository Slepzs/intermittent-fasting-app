import { AppStackScreenProps } from "app/navigators"
import { observer } from "mobx-react-lite"
import React from "react"
import { View, Text, ViewStyle } from "react-native"

interface FastingScreenProps extends AppStackScreenProps<"Fasting"> {}

export const FastingScreen: React.FC<FastingScreenProps> = observer(function FastingScreen() {
  return (
    <View style={$container}>
      <Text>Welcome to the Fasting Screen!</Text>
    </View>
  )
})

const $container: ViewStyle = {
  padding: 50,
}
