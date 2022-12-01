import { StyleSheet } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";

import LiveAudioStream, { Options } from "react-native-live-audio-stream";
import { useEffect, useState } from "react";

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  const [isSetup, setIsSetup] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamData, setStreamData] = useState<any>(null);

  const options: Options = {
    sampleRate: 32000, // default is 44100 but 32000 is adequate for accurate voice recognition
    channels: 1, // 1 or 2, default 1
    bitsPerSample: 16, // 8 or 16, default 16
    audioSource: 6, // android only (see below)
    wavFile: "test.wav", // default 'audio.wav'
    bufferSize: 4096, // default is 2048
  };

  LiveAudioStream.on("data", (data) => {
    // base64-encoded audio data chunks

    setStreamData(data);
    console.log(data);
  });

  useEffect(() => {
    LiveAudioStream.init(options);
  }, []);

  useEffect(() => {
    if (isSetup) {
      LiveAudioStream.start();
    }
    return () => {
      if (isSetup) {
        LiveAudioStream.stop();
      }
    };
  }, [isSetup]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View>
        <Text>Stream Data: {streamData}</Text>
      </View>
      {/* <EditScreenInfo path="/screens/TabOneScreen.tsx" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
