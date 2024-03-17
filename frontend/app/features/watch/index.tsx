import React from "react"
import { View, Text, StyleSheet } from "react-native"
import Timer from "./components/timer"

const BasicComponent = () => {
  return (
    <View style={styles.container}>
      <Timer />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
})

export default BasicComponent
