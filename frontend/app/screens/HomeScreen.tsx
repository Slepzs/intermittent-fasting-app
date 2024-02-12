import { AppStackScreenProps } from "app/navigators"
import { observer } from "mobx-react-lite"
import React from "react"
import { View, Text, ViewStyle } from "react-native"

interface HomeScreenProps extends AppStackScreenProps<"Home"> {}

export const HomeScreen: React.FC<HomeScreenProps> = observer(function HomeScreen() {
  return (
    <View style={$container}>
      <Text>Welcome to the Home Screen!</Text>
    </View>
  )
})

const $container: ViewStyle = {
  padding: 50,
}
