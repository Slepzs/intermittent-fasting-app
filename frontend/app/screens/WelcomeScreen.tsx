import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { View, ViewStyle, Text, Image, ImageStyle } from "react-native"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import Auth from "app/features/auth/components/Auth"
import { Session } from "@supabase/supabase-js"
import { supabase } from "app/features/auth/lib/supabase"
import { useNavigation } from "@react-navigation/native"
import { AutoImage } from "app/components"

const logo = require("../../assets/images/logo.png")

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen() {
  const [session, setSession] = useState<Session | null>(null)
  const navigation = useNavigation()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <View style={$container}>
      <View style={$topContainer}>
        <View style={$LogoContainer}>
          <AutoImage style={$welcomeLogo} source={logo} maxWidth={200} resizeMode="contain" />
        </View>
        <Auth />
        {session && session.user && <Text>{session.user.id}</Text>}
      </View>
    </View>
  )
})

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

const $topContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: "57%",
  justifyContent: "center",
  paddingHorizontal: spacing.lg,
}

const $LogoContainer: ViewStyle = {
  alignItems: "center",
  marginBottom: spacing.xl,
}

const $welcomeLogo: ImageStyle = {
  height: 88,
  width: "100%",
}
