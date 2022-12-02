import {
  Button,
  PermissionsAndroid,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import LiveAudioStream, { Options } from "react-native-live-audio-stream";
import React, { useEffect, useState } from "react";
import { Buffer } from "buffer";
import { LogBox } from "react-native";
export function ignoreWarningLogs() {
  LogBox.ignoreLogs(["new NativeEventEmitter"]); // Ignore log notification by message
  LogBox.ignoreAllLogs(); //Ignore all log notifications
}
export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  ignoreWarningLogs();
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasPermissionsRecordAudio, setHasPermissionsRecordAudio] =
    useState(true);
  const [hasPermissinosExternalStorage, setHasPermissinosExternalStorage] =
    useState(true);
  const [ranPermissionsSetup, setRanPermissionsSetup] = useState(false);
  const [chunkState, setChunkState] = useState<any>("test data here");
  const [chunkArray, setChunkArray] = useState<any>([]);
  let chunkArrayMeanFloat: number[] = [];
  let chunkArrayMeanInt: number[] = [];
  let percentKeep: number = 0.99;
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
      setHasPermissionsRecordAudio(true);
      console.log("RECORD_AUDIO | You can use the audio");
    } else {
      setHasPermissionsRecordAudio(false);
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
      setHasPermissinosExternalStorage(true);
      console.log("WRITE_EXTERNAL_STORAGE | You can use the audio");
    } else {
      setHasPermissinosExternalStorage(false);
      console.log("WRITE_EXTERNAL_STORAGE | Audio permission denied");
    }
    setRanPermissionsSetup(true);
  };
  useEffect(() => {
    console.log("Asking For Permissions");
    permissionsSetup();
  }, []);
  useEffect(() => {
    if (
      ranPermissionsSetup &&
      hasPermissionsRecordAudio &&
      hasPermissinosExternalStorage
    ) {
      initAudioStream();
    }
  }, [
    ranPermissionsSetup,
    hasPermissionsRecordAudio,
    hasPermissinosExternalStorage,
  ]);
  const initAudioStream = () => {
    const options: Options = {
      sampleRate: 44100, // default 44100
      channels: 1, // 1 or 2, default 1
      bitsPerSample: 16, // 8 or 16, default 16
      audioSource: 6, // android only (see below)
      wavFile: "test.wav", // default 'audio.wav'
    };
    LiveAudioStream.init(options);
    LiveAudioStream.on("data", (data: string) => {
      // base64-encoded audio data chunks
      let chunk: Buffer = Buffer.from(data, "base64");
      bufferIndex = bufferIndex + 1 > bufferIndexMod ? 0 : bufferIndex + 1;
      console.log(bufferIndex);
      if (bufferIndex === 0) {
        setChunkState(chunk.toString());
        console.log("data");
        let cArrayString =
          "[" + JSON.parse(JSON.stringify(chunk)).data.toString() + "]";
        // console.log(cArrayString);
        let cArrayData = JSON.parse(cArrayString);
        // console.log(JSON.stringify(cArrayData, null, 2));
        if (chunkArrayMeanFloat.length > 0) {
          cArrayData.forEach((x: number, i: number) => {
            chunkArrayMeanFloat[i] =
              chunkArrayMeanFloat[i] * percentKeep + x * (1 - percentKeep);
          });
          chunkArrayMeanFloat.forEach((x: number, i: number) => {
            chunkArrayMeanInt[i] = Math.round(x / 32);
          });
          console.log(chunkArrayMeanInt);
          // cArrayData.forEach((x, i) => {
          //   chunkArrayMean[i] = 1;
          // });
          // chunkArrayMean.forEach((element, index) => {
          //   chunkArrayMean[index] = Math.floor(
          //     element * percentKeep + cArrayData[index] * (1 - percentKeep)
          //   );
          // });
          // chunkArrayMean = chunkArrayMean.map((item, i) => {
          //   return item * (1 - percentKeep) + cArrayData[i] * percentKeep;
          // });
        } else {
          chunkArrayMeanFloat = [...cArrayData];
        }
        // console.log(JSON.stringify(chunkArrayMeanFloat));
        // setChunkArray([...cArrayString]);
      }
    });
  };
  let bufferIndex = 0;
  let bufferIndexMod = 30;
  const startAudioStream = () => {
    setIsStreaming(true);
    console.log("startListening");
    LiveAudioStream.start();
  };
  const stopAudioStream = () => {
    setIsStreaming(false);
    console.log("stopListening");
    LiveAudioStream.stop();
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stream Data</Text>
      <View style={styles.small_text_container}>
        <Text style={styles.small_text}>{chunkState}</Text>
      </View>
      <View style={styles.button_parent}>
        <TouchableOpacity
          style={[styles.button, styles.button_purple]}
          onPress={() => initAudioStream()}
        >
          <Text style={styles.button_text}>Initialize</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            isStreaming ? styles.button_red : styles.button_green,
          ]}
          onPress={() => {
            if (isStreaming) {
              stopAudioStream();
            } else {
              startAudioStream();
            }
          }}
        >
          <Text style={styles.button_text}>
            {isStreaming ? "Stop" : "Start"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  small_text_container: {
    width: "90%",
    height: 300,
    borderWidth: 5,
    borderColor: "black",
    padding: 10,
    margin: 10,
    borderRadius: 10,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  small_text: {
    fontSize: 30,
    font: "monospace",
  },
  button_parent: {
    width: "100%",
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  button: {
    width: 120,
    height: 50,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 10,
  },
  button_red: {
    backgroundColor: "#AA3333",
  },
  button_green: {
    backgroundColor: "#339933",
  },
  button_purple: {
    backgroundColor: "#3333AA",
  },
  button_text: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
  },
});
