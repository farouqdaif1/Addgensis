import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Link } from "expo-router";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";

export default function Index() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [flashMode, setFlashMode] = useState<"on" | "off">("off");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null); // Ref to access the CameraView instance

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  function toggleFlash() {
    setFlashMode((current) => (current === "off" ? "on" : "off"));
  }
  async function takePicture() {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        console.log("Photo taken:", photo); // Log the photo object
        if (photo) {
          setPhotoUri(photo.uri); // Save the photo URI to state
        }
      } catch (error) {
        console.error("Failed to take picture:", error);
      }
    }
  }
  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef} // Attach the ref to CameraView
        style={styles.camera}
        facing={facing}
        enableTorch={flashMode === "on"}
        flash={flashMode}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.touchable}
            onPress={toggleCameraFacing}
          >
            <Text style={styles.button}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.touchable} onPress={toggleFlash}>
            <Text style={styles.button}>
              {flashMode === "off" ? "Flash On" : "Flash Off"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.touchable} onPress={takePicture}>
            <Text style={styles.button}>Take Picture</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      {photoUri && (
        <View style={styles.previewContainer}>
          <Text style={styles.text}>Photo Preview:</Text>
          <Image source={{ uri: photoUri }} style={styles.previewImage} />
        </View>
      )}
      <Text style={styles.text}>Camera screen</Text>
      <Link href="/gallery" style={styles.button}>
        Go to Gallery screen
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#fff",
  },
  touchable: {
    height: 40,
    padding: 1,
    backgroundColor: "#1e1e1e",
    borderRadius: 5,
    marginHorizontal: 5, // Add some spacing between buttons
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
    alignItems: "flex-end", // Align buttons to the bottom
    justifyContent: "center", // Center buttons horizontally
  },
  previewContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
});
