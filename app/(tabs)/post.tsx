import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { createPost } from "../../store/photoSlice";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";

export default function PostScreen() {
  const dispatch = useDispatch();
  const recentPhoto = useSelector(
    (state: { photos: { recentPhoto: string | null } }) =>
      state.photos.recentPhoto
  );
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [caption, setCaption] = useState("");

  // When the screen loads, if there's a recent photo from the camera, add it to selected images
  useEffect(() => {
    if (recentPhoto && !selectedImages.includes(recentPhoto)) {
      setSelectedImages([recentPhoto]);
    }
  }, [recentPhoto]);

  const pickImage = async () => {
    // Request permission first on iOS
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Sorry, we need camera roll permissions to make this work!"
        );
        return;
      }
    }

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri);
      setSelectedImages((current) => [...current, ...newImages]);
    }
  };

  const removeImage = (uri: string) => {
    setSelectedImages((current) => current.filter((img) => img !== uri));
  };

  const handleCreatePost = () => {
    if (selectedImages.length === 0) {
      Alert.alert(
        "No Images Selected",
        "Please select at least one image to create a post."
      );
      return;
    }

    dispatch(createPost({ images: selectedImages, caption }));
    Alert.alert("Success", "Your post has been created!", [
      {
        text: "OK",
        onPress: () => {
          router.push("/(tabs)/posts");
          // Clear state
          setSelectedImages([]);
          setCaption("");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Post</Text>

      <ScrollView horizontal style={styles.previewScroll}>
        {selectedImages.map((uri, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri }} style={styles.previewImage} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeImage(uri)}
            >
              <Ionicons name="close-circle" size={24} color="#ff6b6b" />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
          <Ionicons name="add-circle" size={40} color="#ffd33d" />
          <Text style={styles.addImageText}>Add Photos</Text>
        </TouchableOpacity>
      </ScrollView>

      <TextInput
        style={styles.captionInput}
        placeholder="Write a caption for your post..."
        placeholderTextColor="#aaa"
        value={caption}
        onChangeText={setCaption}
        multiline
      />

      <TouchableOpacity
        style={styles.postButton}
        onPress={handleCreatePost}
        disabled={selectedImages.length === 0}
      >
        <Text style={styles.postButtonText}>Share</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 20,
  },
  previewScroll: {
    marginBottom: 20,
    maxHeight: 200,
  },
  imageWrapper: {
    position: "relative",
    marginRight: 10,
  },
  previewImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12,
  },
  addImageButton: {
    width: 150,
    height: 150,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#aaa",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  addImageText: {
    color: "#ffd33d",
    marginTop: 5,
  },
  captionInput: {
    backgroundColor: "#353840",
    borderRadius: 10,
    padding: 15,
    color: "#fff",
    fontSize: 16,
    height: 120,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  postButton: {
    backgroundColor: "#ffd33d",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  postButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#25292e",
  },
});
