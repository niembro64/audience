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

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  const [hasPermissionsRecordAudio, setHasPermissionsRecordAudio] =
    useState(true);
  const [hasPermissinosExternalStorage, setHasPermissinosExternalStorage] =
    useState(true);
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
  };

  useEffect(() => {
    console.log("Asking For Permissions");
    permissionsSetup();
  }, []);

  // useEffect(() => {
  //   if (hasPermissinosExternalStorage && hasPermissionsRecordAudio) {
  //     const options: Options = {
  //       sampleRate: 44100, // default 44100
  //       channels: 1, // 1 or 2, default 1
  //       bitsPerSample: 16, // 8 or 16, default 16
  //       audioSource: 6, // android only (see below)
  //       wavFile: "test.wav", // default 'audio.wav'
  //     };

  //     LiveAudioStream.init(options);
  //     LiveAudioStream.start();
  //     LiveAudioStream.on("data", (data: string) => {
  //       // base64-encoded audio data chunks
  //       var chunk: Buffer = Buffer.from(data, "base64");

  //       // setStreamData(data);
  //       // console.log("data", data);
  //       setChunkState(chunk.toString());
  //       // console.log("chunk", chunk.toString());
  //       console.log(chunk);
  //       setChunkStateData(chunk.buffer);

  //       // audioFile = new Audio();
  //       // audioFile.src = "data:audio/wav;base64," + data;
  //       // audioFile.play();
  //     });
  //     return () => {
  //       LiveAudioStream.stop();
  //     };
  //   }
  // }, [hasPermissionsRecordAudio, hasPermissinosExternalStorage]);

  /////////////////////////////////////////
  /////////////////////////////////////////
  /////////////////////////////////////////
  /////////////////////////////////////////
  /////////////////////////////////////////
  /////////////////////////////////////////

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

  //         setChunk(chunk);
  //         // setChunk(data);
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

  let bufferIndex = 0;
  let bufferIndexMod = 30;

  const startListening = () => {
    console.log("startListening");
    const options: Options = {
      sampleRate: 44100, // default 44100
      channels: 1, // 1 or 2, default 1
      bitsPerSample: 16, // 8 or 16, default 16
      audioSource: 6, // android only (see below)
      wavFile: "test.wav", // default 'audio.wav'
    };

    LiveAudioStream.init(options);
    LiveAudioStream.start();
    LiveAudioStream.on("data", (data: string) => {
      // base64-encoded audio data chunks
      var chunk: Buffer = Buffer.from(data, "base64");

      // setStreamData(data);
      // console.log("data", data);
      bufferIndex = bufferIndex + 1 > bufferIndexMod ? 0 : bufferIndex + 1;
      console.log("bufferIndex", bufferIndex);
      if (bufferIndex % bufferIndexMod === 0) {
        setChunkState(chunk.toString());
        // console.log("chunk", chunk.toString());
        console.log(chunk);
        setChunkStateData(chunk.buffer);
      }

      // audioFile = new Audio();
      // audioFile.src = "data:audio/wav;base64," + data;
      // audioFile.play();
    });
  };

  const stopListening = () => {
    console.log("stopListening");
    LiveAudioStream.stop();
  };

  return (
    <View style={styles.container}>
      <View style={styles.button_parent}>
        <TouchableOpacity
          style={(styles.button, styles.button_green)}
          onPress={() => {
            startListening();
          }}
        >
          <Text style={styles.button_text}>Start</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={(styles.button, styles.button_red)}
          onPress={() => {
            stopListening();
          }}
        >
          <Text style={styles.button_text}>Stop</Text>
        </TouchableOpacity>

        {/* <Button
          title="Start"
          onPress={() => {
            startListening();
          }}
          color="green"
        />
        <Button
          title="Stop"
          onPress={() => {
            stopListening();
          }}
          color="red"
        /> */}
      </View>
      <Text style={styles.title}>Mic Stream Data</Text>
      {/* <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      /> */}
      <View>
        <Text style={styles.small_text}>{chunkState}</Text>
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
    fontSize: 20,
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
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  button_red: {
    backgroundColor: "#AA3333",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  button_green: {
    backgroundColor: "#33AA55",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  button_text: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
  },
});
