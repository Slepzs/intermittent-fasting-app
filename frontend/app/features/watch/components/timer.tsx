import { Button } from "app/components"
import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { insertFastedStartRow, useUserFastedRecords } from "../lib/time"
import { formatRelative } from "date-fns"

const Timer = () => {
  const { data, refetch } = useUserFastedRecords()

  const startedAt = () => {
    return data?.[0]?.started_at
      ? formatRelative(new Date(data?.[0]?.started_at), new Date())
      : "Not started"
  }

  const chosenHours = () => {
    return data?.[0]?.hours ? data?.[0]?.hours : 0
  }

  // calculate end of fast based on chosen hours and start time
  const endOfFast = () => {
    if (!data?.[0]?.started_at || !data?.[0]?.hours) return "Not started"
    const startDate = new Date(data[0].started_at)
    const endDate = new Date(startDate.getTime() + data[0].hours * 60 * 60 * 1000)
    return formatRelative(endDate, new Date())
  }

  const calculateTimeLeft = () => {
    if (!data?.[0]?.started_at || !data?.[0]?.hours) return "Not started"
    const startDate = new Date(data[0].started_at)
    const endDate = new Date(startDate.getTime() + data[0].hours * 60 * 60 * 1000)
    const now = new Date()
    const timeLeft = endDate.getTime() - now.getTime()

    if (timeLeft < 0) {
      return "Fast ended"
    } else {
      const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((timeLeft / 1000 / 60) % 60)
      const seconds = Math.floor((timeLeft / 1000) % 60)
      return `${hours}h ${minutes}m ${seconds}s`
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.fastAttributes}>
          <Text style={styles.fastAttribute}>{startedAt()}</Text>
          <Text style={styles.fastAttribute}>{chosenHours()} Hours</Text>
        </View>
        <View>
          <Text style={styles.timer}>20:00</Text>
        </View>
        <View>
          <Text style={styles.fastAttribute}>end of fast</Text>
        </View>
        <View style={styles.fastAttributes}>
          <Text style={styles.fastAttribute}>{endOfFast()}</Text>
          <Text style={styles.fastAttribute}>{calculateTimeLeft()} </Text>
        </View>
      </View>
      <View style={{ marginTop: 20 }}>
        <Button
          text="Start"
          onPress={() => insertFastedStartRow(16, new Date().toISOString(), refetch)}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 5,
  },
  card: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  fastAttributes: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  fastAttribute: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  timer: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 80,
    fontWeight: "bold",
    textAlign: "center",
  },
})

export default Timer
