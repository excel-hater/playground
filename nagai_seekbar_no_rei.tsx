import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import Slider from "@react-native-community/slider";
import Svg, { Path } from "react-native-svg";

const SegmentedSeekBar = ({ duration, position, onSeek }) => {
  const segments = 4;
  const segmentLength = duration / segments;

  const getSegmentValue = (index: number) => {
    const segStart = index * segmentLength;
    const segEnd = (index + 1) * segmentLength;
    if (position <= segStart) return 0;
    if (position >= segEnd) return 1;
    return (position - segStart) / segmentLength;
  };

  const handleChange = (value: number, index: number) => {
    const absolutePos = index * segmentLength + value * segmentLength;
    onSeek(absolutePos);
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: segments }).map((_, i) => (
        <View key={i} style={{ alignItems: "stretch" }}>
          {/* スライダー */}
          <View
            style={[
              styles.sliderContainer,
              i % 2 === 1 ? { transform: [{ rotate: "180deg" }] } : null,
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

          {/* 下にカーブを描画（最後のバー以外） */}
          {i < segments - 1 && (
            <Svg height="30" width="100%">
              {i % 2 === 0 ? (
                // 右端から下へカーブ
                <Path
                  d="M100,0 C100,0 100,30 100,30"
                  stroke="#4CAF50"
                  strokeWidth="4"
                  fill="none"
                />
              ) : (
                // 左端から下へカーブ
                <Path
                  d="M0,0 C0,0 0,30 0,30"
                  stroke="#4CAF50"
                  strokeWidth="4"
                  fill="none"
                />
              )}
            </Svg>
          )}
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
      <Text style={{ marginBottom: 20 }}>
        現在位置: {Math.floor(position)} / {duration} 秒
      </Text>
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
    gap: 0,
  },
  sliderContainer: {
    flexDirection: "row",
  },
  slider: {
    flex: 1,
    height: 40,
  },
});
