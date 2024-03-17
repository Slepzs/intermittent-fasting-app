import { AppStackScreenProps } from "app/navigators"
import { observer } from "mobx-react-lite"
import React from "react"
import { View, Text, ViewStyle } from "react-native"

interface SettingsSceenProps extends AppStackScreenProps<"Settings"> {}

export const SettingsScreen: React.FC<SettingsSceenProps> = observer(function FastingScreen() {
  return (
    <View style={$container}>
      <Text>Welcome to the Settings Screen!</Text>
    </View>
  )
})

const $container: ViewStyle = {
  padding: 50,
}
