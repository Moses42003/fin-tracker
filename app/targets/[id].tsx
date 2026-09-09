import BackText from "@/components/backtext";
import QuickActionButton from "@/components/quickaction";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { LineChart, PieChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TargetPage() {
  const { id } = useLocalSearchParams();

  const total = 3000;
  const saved = 1950;

  const remaining = Math.max(total - saved, 0);

  const percentage = ((saved / total) * 100).toFixed();

  const pieData = [
    { value: saved, color: "green" },
    { value: remaining, color: "#e5e7eb" },
  ];

  const lineData = [
    { value: 20, label: "Mon" },
    { value: 200, label: "Tue" },
    { value: 10, label: "Wed" },
    { value: 105, label: "Fri" },
    { value: 378, label: "Sat" },
    { value: 190, label: "Sun" },
  ];
  const yValues = lineData.map((item) => item.value.toString());

  return (
    <SafeAreaView className="pt-5 px-4 flex flex-1">
      <View className="flex flex-row items-center justify-between mb-8">
        {/* Back */}
        <BackText title="My Targets" />

        {/* Three Dot: Menu */}
        <TouchableOpacity
          activeOpacity={0.7}
          className="w-16 h-6 rounded-2xl flex items-center justify-center"
        >
          <Ionicons name="ellipsis-horizontal" size={25} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          className="flex flex-1 rounded-3xl overflow-hidden bg-slate-300 border-2 border-gray-300 mb-3"
          style={{
            shadowColor: "gray",
            shadowOffset: { width: 0, height: 3 },
            shadowRadius: 2,
            shadowOpacity: 0.4,
          }}
        >
          <View className="flex flex-1 bg-slate-300">
            <View className="bg-slate-200 flex flex-[.4] align-center justify-center gap-2 py-3">
              <Text className="text-3xl text-center font-semibold">{id}</Text>

              <Text className="text-center text-lg">
                Target Date: Jun 20, 2015
              </Text>
            </View>

            {/* Image Space */}
            <View className="flex items-center justify-center flex-1 h-64 bg-blue-600 rounded-xl">
              <Text className="text-2xl font-bold">Image Here</Text>
            </View>
          </View>

          {/* Circle Progress Loader Analytics */}
          <View className="px-6 py-4 rounded-t-2xl bg-white">
            <View className="flex flex-row justify-between items-center mb-3">
              {/* Circle Progress */}
              <View className="w-36 h-36 rounded-full border-8 border-green-600 flex items-center justify-center">
                <PieChart
                  data={pieData}
                  donut
                  radius={70}
                  innerRadius={50}
                  backgroundColor="white"
                  centerLabelComponent={() => (
                    <View className="items-center justify-center">
                      <Text className="font-bold text-2xl">{percentage}%</Text>
                      <Text className="text-lg font-semibold text-gray-500">
                        Done
                      </Text>
                    </View>
                  )}
                />
              </View>

              <View className="gap-3">
                <View className="gap-2">
                  <Text className="text-lg text-gray-400 font-semibold">
                    Saved
                  </Text>
                  <Text className="text-2xl font-semibold">
                    GH₵ {saved.toLocaleString()}
                  </Text>
                </View>
                <View className="gap-2">
                  <Text className="text-lg text-gray-400 font-semibold">
                    Total
                  </Text>
                  <Text className="text-2xl font-semibold">
                    GH₵ {total.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>

            {/* Remaining */}
            <View className="flex flex-row items-center gap-2 justify-center">
              <Text className="text-lg font-semibold text-gray-400">
                Remaining:
              </Text>
              <Text className="text-xl font-semibold text-gray-700">
                GH₵ {remaining.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Graph Analysis */}
        <View className="bg-white border-2 border-gray-300 mb-3 p-3 rounded-3xl">
          <View className="flex flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold">Progress Over Time</Text>
            {/* Time Change Drop Down */}
            <View className="bg-slate-300 h-8 w-20 rounded-2xl"></View>
          </View>

          {/* Graph */}
          <View className="w-full rounded-2xl overflow-hidden">
            <LineChart
              data={lineData}
              // width={250}
              height={180}
              color="#4caf50"
              thickness={3}
              // showValuesAsDataPointsText
              xAxisLabelTextStyle={{
                color: "#888",
                fontSize: 12,
                fontWeight: "bold",
              }}
              yAxisTextStyle={{
                color: "#888",
                fontSize: 12,
                fontWeight: "bold",
              }}
              dataPointsColor="#4caf50"
              dataPointsRadius={5}
              xAxisColor="transparent"
              yAxisColor="transparent"
              // yAxisLabelTexts={yValues}
              noOfSections={4}
              pointerConfig={{
                pointerLabelComponent: (items: any) => {
                  const item = items[0];
                  // console.log("tooltip", item);
                  return (
                    <View
                      className="bg-white flex-col rounded-2xl"
                      style={{
                        width: 100,
                        padding: 5,
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 2,
                      }}
                    >
                      <Text className="font-bold text-2xl text-gray-700">
                        GH₵{item.value}
                      </Text>

                      <Text className="text-xl text-gray-500">
                        {item.label}
                      </Text>
                    </View>
                  );
                },
                activatePointersOnLongPress: true,
                pointerStripColor: "#4caf50",
                pointerColor: "#4caf50",
                pointerStripWidth: 2,
              }}
            />
          </View>
        </View>

        <View className="flex bg-white border-2 border-gray-300 p-3 rounded-3xl">
          <Text className="text-xl font-bold mb-3">Quick Actions</Text>

          <View className="flex flex-row items-center justify-evenly">
            <QuickActionButton name="Add Money" iconName="add-outline" />
            <QuickActionButton name="Edit Target" iconName="pencil-outline" />
            <QuickActionButton name="Pause" iconName="pause-outline" />
            <QuickActionButton name="Delete" iconName="trash-outline" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
