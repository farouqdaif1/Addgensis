import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef, useEffect } from "react";
import * as MediaLibrary from "expo-media-library";
import { useDispatch } from "react-redux";
import { setRecentPhoto } from "../../store/photoSlice";
import { router } from "expo-router";

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [flashMode, setFlashMode] = useState<"on" | "off">("off");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState<
    boolean | null
  >(null);
  const cameraRef = useRef<CameraView>(null);
  const dispatch = useDispatch(); // Get the dispatch function from Redux

  // Request media library permissions
  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setMediaLibraryPermission(status === "granted");
    })();
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  if (mediaLibraryPermission === null) {
    return <View />;
  }

  if (!mediaLibraryPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to save photos to the gallery
        </Text>
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
        console.log("Photo taken:", photo);
        if (photo) {
          setPhotoUri(photo.uri);
          dispatch(setRecentPhoto(photo.uri)); // Store the most recent photo

          // Save the photo to the device's gallery
          await MediaLibrary.saveToLibraryAsync(photo.uri);
        }
      } catch (error) {
        console.error("Failed to take picture:", error);
      }
    }
  }

  const handleCreatePost = () => {
    if (photoUri) {
      router.push("/(tabs)/post");
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
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
          <TouchableOpacity
            style={styles.postButton}
            onPress={handleCreatePost}
          >
            <Text style={styles.postButtonText}>Create Post</Text>
          </TouchableOpacity>
        </View>
      )}
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
    marginHorizontal: 5,
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
    alignItems: "flex-end",
    justifyContent: "center",
  },
  previewContainer: {
    width: "100%",
    padding: 20,
    backgroundColor: "#1e1e1e",
    flexDirection: "column",
    alignItems: "center",
  },
  previewImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  postButton: {
    backgroundColor: "#ffd33d",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10,
    width: "80%",
    alignItems: "center",
  },
  postButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#25292e",
  },
});
