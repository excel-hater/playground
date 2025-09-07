import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import Slider from "@react-native-community/slider";

const SegmentedSeekBar = ({ duration, position, onSeek }) => {
  const segments = 4;
  const segmentLength = duration / segments;

  // 現在の位置から各セグメントの値を計算
  const getSegmentValue = (index: number) => {
    const segStart = index * segmentLength;
    const segEnd = (index + 1) * segmentLength;
    if (position <= segStart) return 0;
    if (position >= segEnd) return 1;
    return (position - segStart) / segmentLength;
  };

  // ユーザーが動かしたとき
  const handleChange = (value: number, index: number) => {
    const absolutePos = index * segmentLength + value * segmentLength;
    onSeek(absolutePos); // 動画プレイヤーに渡す
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: segments }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.sliderContainer,
            i % 2 === 1 ? { transform: [{ rotate: "180deg" }] } : null, // 偶数/奇数で逆向き
          ]}
        >
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={getSegmentValue(i)}
            onSlidingComplete={(v) => handleChange(v, i)}
            minimumTrackTintColor="#4CAF50"
            maximumTrackTintColor="#ccc"
            thumbTintColor="#4CAF50"
          />
        </View>
      ))}
    </View>
  );
};

export default function App() {
  const [position, setPosition] = useState(0);
  const duration = 4000; // 例: 4000秒の動画

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text>現在位置: {Math.floor(position)} / {duration} 秒</Text>
      <SegmentedSeekBar
        duration={duration}
        position={position}
        onSeek={(pos) => setPosition(pos)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 8,
  },
  sliderContainer: {
    flexDirection: "row",
  },
  slider: {
    flex: 1,
    height: 40,
  },
});
