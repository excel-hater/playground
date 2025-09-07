import React, { useRef, useState } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import Video from "react-native-video";
import Slider from "@react-native-community/slider";
import Svg, { Path } from "react-native-svg";

const SegmentedSeekBar = ({ duration, position, onSeek }) => {
  const segments = 4;
  const segmentLength = duration / segments;
  const screenWidth = Dimensions.get("window").width;

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
    <View style={styles.seekContainer}>
      {Array.from({ length: segments }).map((_, i) => (
        <View key={i}>
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

          {/* 折れ曲がりカーブ（最後のバー以外） */}
          {i < segments - 1 && (
            <Svg height="30" width={screenWidth}>
              {i % 2 === 0 ? (
                <Path
                  d={`M${screenWidth},0 C${screenWidth},0 ${screenWidth},30 ${screenWidth},30`}
                  stroke="#4CAF50"
                  strokeWidth="4"
                  fill="none"
                />
              ) : (
                <Path
                  d={`M0,0 C0,0 0,30 0,30`}
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
  const videoRef = useRef<Video>(null);
  const [duration, setDuration] = useState(1);
  const [position, setPosition] = useState(0);

  const handleSeek = (pos: number) => {
    setPosition(pos);
    videoRef.current?.seek(pos);
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: "https://www.w3schools.com/html/mov_bbb.mp4" }}
        style={styles.video}
        resizeMode="contain"
        onLoad={(data) => setDuration(data.duration)}
        onProgress={(data) => setPosition(data.currentTime)}
      />
      <Text style={styles.text}>
        {Math.floor(position)} / {Math.floor(duration)} 秒
      </Text>
      <SegmentedSeekBar
        duration={duration}
        position={position}
        onSeek={handleSeek}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
  },
  video: {
    width: "100%",
    height: 200,
    backgroundColor: "#222",
  },
  text: {
    color: "#fff",
    textAlign: "center",
    marginVertical: 10,
  },
  seekContainer: {
    flexDirection: "column",
    gap: 0,
    marginBottom: 30,
  },
  sliderContainer: {
    flexDirection: "row",
  },
  slider: {
    flex: 1,
    height: 40,
  },
});
