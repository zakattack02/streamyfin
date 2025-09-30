import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/common/Text";

export default function SettingsIndex() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  // Redirect only once on mount, not on every focus
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(auth)/(tabs)/(settings)/settings");
    }, 50);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        paddingBottom: insets.bottom,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className='text-white text-lg'>
        {t("home.settings.settings_title")}...
      </Text>
    </View>
  );
}
