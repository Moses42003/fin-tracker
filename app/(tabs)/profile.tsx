import CustomButton from "@/components/custombutton";
import GreetingCard from "@/components/greetingcard";
import SettingOption from "@/components/settingoption";
import { ScrollView, View } from "react-native";

export default function ProfileTab() {
  return (
    <View className="flex flex-1 bg-violet-950 pt-10">
      <View className="flex flex-2 px-5 mb-4">
        <GreetingCard name="CodeTech SP" profile />
      </View>
      <ScrollView className="flex flex-1 h-max bg-white rounded-t-3xl px-8 py-5">
        <SettingOption value="GH₵" icon="cash-outline" name="Currency" />

        <SettingOption name="Budget Settings" icon="wallet-outline" />

        <SettingOption icon="notifications-outline" name="Notifications" />

        <SettingOption value="System" name="Theme" icon="color-fill-outline" />

        <SettingOption icon="cloud-outline" name="Data & Backups" />

        <SettingOption
          last
          icon="information-circle-outline"
          name="About App"
        />

        <CustomButton name="Log Out" color="red" />
      </ScrollView>
    </View>
  );
}
