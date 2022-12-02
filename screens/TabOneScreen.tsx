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
  const [chunkStateData, setChunkStateData] = useState<any>("test data here");

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
      setUpLiveAudioStream();
    }
  }, [
    ranPermissionsSetup,
    hasPermissionsRecordAudio,
    hasPermissinosExternalStorage,
  ]);

  const setUpLiveAudioStream = () => {
    const options: Options = {
      sampleRate: 44100, // default 44100
      channels: 1, // 1 or 2, default 1
      bitsPerSample: 16, // 8 or 16, default 16
      audioSource: 6, // android only (see below)
      wavFile: "test.wav", // default 'audio.wav'
    };

    LiveAudioStream.init(options);
    // LiveAudioStream.start();
    LiveAudioStream.on("data", (data: string) => {
      // base64-encoded audio data chunks
      let chunk: Buffer = Buffer.from(data, "base64");
      let chunkString: string = chunk.toString();
      // let chunkObject: any = JSON.parse(chunkString);

      // setStreamData(data);
      // console.log("data", data);
      bufferIndex = bufferIndex + 1 > bufferIndexMod ? 0 : bufferIndex + 1;
      console.log(bufferIndex);
      if (bufferIndex === 0) {
        setChunkState(chunk.toString());
        // console.log("chunk", chunk.toString());
        console.log("data");
        console.log(JSON.parse(JSON.stringify(chunk)).data.toString());
        // console.log(chunk);
        // console.log(chunk.toString());
        // setChunkStateData(chunk.buffer);
      }

      // audioFile = new Audio();
      // audioFile.src = "data:audio/wav;base64," + data;
      // audioFile.play();
    });
  };

  let bufferIndex = 0;
  let bufferIndexMod = 30;

  const startListening = () => {
    setIsStreaming(true);
    console.log("startListening");
    LiveAudioStream.start();
    LiveAudioStream.on("data", (data: string) => {
      // base64-encoded audio data chunks
      let chunk: Buffer = Buffer.from(data, "base64");
      let chunkString: string = chunk.toString();

      bufferIndex = bufferIndex + 1 > bufferIndexMod ? 0 : bufferIndex + 1;
      console.log("bufferIndex", bufferIndex);
      if (bufferIndex === 0) {
        setChunkState(chunk.toString());
        console.log(chunk);
      }
    });
  };

  const stopListening = () => {
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
      <TouchableOpacity
        style={[
          styles.button,
          isStreaming ? styles.button_red : styles.button_green,
        ]}
        onPress={() => {
          if (isStreaming) {
            stopListening();
          } else {
            startListening();
          }
        }}
      >
        <Text style={styles.button_text}>{isStreaming ? "Stop" : "Start"}</Text>
      </TouchableOpacity>
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
    // borderRadius: 8,
    // paddingVertical: 10,
    // paddingHorizontal: 20,
  },
  button_green: {
    backgroundColor: "#339933",
    // borderRadius: 8,
    // paddingVertical: 10,
    // paddingHorizontal: 20,
  },
  button_text: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
  },
});
