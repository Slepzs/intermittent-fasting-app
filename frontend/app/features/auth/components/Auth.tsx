import React, { useEffect, useState } from "react"
import { Alert, StyleSheet, View } from "react-native"
import { supabase } from "../lib/supabase"
import { Button, TextField } from "app/components"
import "react-native-url-polyfill/auto"
import { useStores } from "app/models/helpers/useStores"

export default function Auth() {
  const rootStore = useStores()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert("Please check your inbox for email verification!")
    setLoading(false)
  }

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const isAuthenticated = !!session
      rootStore.setIsAuthenticated(isAuthenticated)
    })

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TextField
          label="Email"
          onChangeText={(text: string) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <TextField
          label="Password"
          onChangeText={(text: any) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button text="Sign in" disabled={loading} onPress={() => signInWithEmail()} />
      </View>
      <View style={styles.verticallySpaced}>
        <Button text="Sign up" disabled={loading} onPress={() => signUpWithEmail()} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  mt20: {
    marginTop: 20,
  },
  verticallySpaced: {
    alignSelf: "stretch",
    paddingBottom: 4,
    paddingTop: 4,
  },
})
