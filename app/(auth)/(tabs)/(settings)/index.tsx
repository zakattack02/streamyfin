import { useRouter } from "expo-router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/common/Text";

export default function SettingsIndex() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const handleNavigateToSettings = useCallback(() => {
    router.push("/(auth)/(tabs)/(home)/settings");
  }, [router]);

  return (
    <View
      className='flex-1 bg-black'
      style={{
        paddingTop: insets.top + 16,
        paddingHorizontal: insets.left + 16,
        paddingBottom: insets.bottom + 16,
      }}
    >
      <View className='flex-1 justify-center items-center'>
        <Text className='text-2xl font-bold text-white mb-4'>
          {t("home.settings.settings_title")}
        </Text>
        <Text className='text-gray-400 text-center mb-8 max-w-md'>
          Access your Streamyfin settings and configuration options.
        </Text>
        <TouchableOpacity
          onPress={handleNavigateToSettings}
          className='bg-purple-600 px-8 py-4 rounded-lg'
        >
          <Text className='text-white font-medium text-lg'>Open Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
