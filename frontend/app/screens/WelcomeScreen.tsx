import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { ImageStyle, TextStyle, View, ViewStyle, Text } from "react-native"
import { isRTL } from "../i18n"
import { AppStackParamList, AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import Auth from "app/features/auth/components/Auth"
import { Session } from "@supabase/supabase-js"
import { supabase } from "app/features/auth/lib/supabase"
import { Button } from "app/components/Button"
import { useNavigation } from "@react-navigation/native"

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
        <Auth />
        {session && session.user && <Text>{session.user.id}</Text>}
        <Button text="Go to Details" onPress={() => navigation.navigate("Home")} />
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

const $bottomContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 0,
  flexBasis: "43%",
  backgroundColor: colors.palette.neutral100,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  paddingHorizontal: spacing.lg,
  justifyContent: "space-around",
}
const $welcomeLogo: ImageStyle = {
  height: 88,
  width: "100%",
  marginBottom: spacing.xxl,
}

const $welcomeFace: ImageStyle = {
  height: 169,
  width: 269,
  position: "absolute",
  bottom: -47,
  right: -80,
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}

const $welcomeHeading: TextStyle = {
  marginBottom: spacing.md,
}
