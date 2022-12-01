import { PermissionsAndroid, StyleSheet } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";

import LiveAudioStream, { Options } from "react-native-live-audio-stream";
import { useEffect, useState } from "react";

import { Buffer } from "buffer";

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  const [isSetup, setIsSetup] = useState(false);
  const [streamData, setStreamData] = useState<any>("test data here");

  let audioFile: any = null;

  const permissionsSetup = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: "Audio Recording Permission",
        message: "App needs access to your audio to record audio.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("RECORD_AUDIO | You can use the audio");
    } else {
      console.log("RECORD_AUDIO | Audio permission denied");
    }

    const granted2 = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "Audio Recording Permission",
        message: "App needs access to your audio to record audio.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );
    if (granted2 === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("WRITE_EXTERNAL_STORAGE | You can use the audio");
    } else {
      console.log("WRITE_EXTERNAL_STORAGE | Audio permission denied");
    }
  };

  useEffect(() => {
    permissionsSetup();
    setIsSetup(true);
  }, []);

  useEffect(() => {
    if (isSetup) {
      const options: Options = {
        sampleRate: 44100, // default 44100
        channels: 1, // 1 or 2, default 1
        bitsPerSample: 16, // 8 or 16, default 16
        audioSource: 6, // android only (see below)
        wavFile: "test.wav", // default 'audio.wav'
      };

      LiveAudioStream.init(options);
      LiveAudioStream.start();
      LiveAudioStream.on("data", (data) => {
        // base64-encoded audio data chunks
        var chunk = Buffer.from(data, "base64");

        setStreamData(chunk);
        // setStreamData(data);
        console.log(chunk);
      });
    }
    return () => {
      LiveAudioStream.stop();
    };
  }, [isSetup]);

  // Permissions.new("android.permission.RECORD_AUDIO").then(permission => {
  //   const options = {
  //     sampleRate: 16000, // default 44100
  //     channels: 1, // 1 or 2, default 1
  //     bitsPerSample: 16, // 8 or 16, default 16
  //     audioSource: 6, // android only (see below)
  //     bufferSize: 4096 * 2 // default is 2048
  //   }
  //   AudioRecord.init(options)
  //   AudioRecord.start()
  // })

  // useEffect(() => {
  //   async (params: any) => {
  //     await PermissionsAndroid.requestMultiple([
  //       PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  //     ]);

  //     // await PermissionsAndroid.requestMultiple([
  //     //   PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  //     // ]);

  //     const options: Options = {
  //       sampleRate: 32000, // default is 44100 but 32000 is adequate for accurate voice recognition
  //       channels: 1, // 1 or 2, default 1
  //       bitsPerSample: 16, // 8 or 16, default 16
  //       audioSource: 6, // android only (see below)
  //       wavFile: "test.wav", // default 'audio.wav'
  //       bufferSize: 4096, // default is 2048
  //     };

  //     LiveAudioStream.init(options);

  //     if (isSetup) {
  //       LiveAudioStream.start();
  //       LiveAudioStream.on("data", (data) => {
  //         // base64-encoded audio data chunks
  //         var chunk = Buffer.from(data, "base64");

  //         setStreamData(chunk);
  //         // setStreamData(data);
  //         console.log(data);
  //       });
  //     }
  //   };
  //   return () => {
  //     if (isSetup) {
  //       audioFile = LiveAudioStream.stop();
  //     }
  //   };
  //   // setIsSetup(true);
  // }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AudIence Stream Data</Text>
      {/* <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      /> */}
      <View>
        <Text style={styles.small_text}>Data: {streamData}</Text>
      </View>
      {/* <EditScreenInfo path="/screens/TabOneScreen.tsx" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
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
  small_text: {
    fontSize: 7,
  },
});
