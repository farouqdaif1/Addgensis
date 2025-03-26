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
import { addPost } from "../../store/photoSlice";
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
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

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
      setSelectedImages(result.assets.map((asset) => asset.uri));
    }
  };

  const removeImage = (uri: string) => {
    setSelectedImages((current) => current.filter((img) => img !== uri));
  };

  const handleSubmit = () => {
    if (selectedImages.length === 0) {
      Alert.alert(
        "No Images Selected",
        "Please select at least one image to create a post."
      );
      return;
    }

    if (!name.trim()) {
      Alert.alert("Please enter a name for your post");
      return;
    }

    dispatch(
      addPost({
        id: Date.now().toString(),
        name,
        description,
        price: price ? parseFloat(price) : 0,
        images: selectedImages,
        createdAt: new Date().toISOString(),
      })
    );

    Alert.alert("Success", "Your post has been created!", [
      {
        text: "OK",
        onPress: () => {
          router.push("/(tabs)/posts");
          // Clear state
          setSelectedImages([]);
          setCaption("");
          setName("");
          setDescription("");
          setPrice("");
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create New Post</Text>
        <Ionicons name="create-outline" size={24} color="#ffd33d" />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={[styles.input, { color: "#ffffff" }]}
          value={name}
          onChangeText={setName}
          placeholder="Enter post name"
          placeholderTextColor="#8a8a8a"
          selectionColor="#ffd33d"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea, { color: "#ffffff" }]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
          placeholderTextColor="#8a8a8a"
          multiline
          numberOfLines={4}
          selectionColor="#ffd33d"
        />

        <Text style={styles.label}>Price</Text>
        <TextInput
          style={[styles.input, { color: "#ffffff" }]}
          value={price}
          onChangeText={setPrice}
          placeholder="Enter price"
          placeholderTextColor="#8a8a8a"
          keyboardType="numeric"
          selectionColor="#ffd33d"
        />

        <View style={styles.imageSelectionContainer}>
          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={pickImage}
          >
            <Ionicons name="images-outline" size={20} color="#25292e" />
            <Text style={styles.buttonText}>Select Images</Text>
          </TouchableOpacity>
        </View>

        {selectedImages.length > 0 && (
          <View style={styles.imagePreviewContainer}>
            <Text style={styles.previewText}>
              Selected Images ({selectedImages.length})
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {selectedImages.map((uri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri }} style={styles.imagePreview} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(uri)}
                  >
                    <Ionicons name="close-circle" size={22} color="#ff3b30" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Create Post</Text>
          <Ionicons name="checkmark-circle-outline" size={20} color="#25292e" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#353840",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ffffff",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#353840",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
    borderWidth: 0,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  imageSelectionContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  imagePickerButton: {
    backgroundColor: "#ffd33d",
    padding: 14,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#25292e",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  imagePreviewContainer: {
    marginTop: 15,
    marginBottom: 20,
  },
  previewText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  imageWrapper: {
    position: "relative",
    marginRight: 12,
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  removeImageButton: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "#25292e",
    borderRadius: 15,
    padding: 2,
  },
  submitButton: {
    backgroundColor: "#ffd33d",
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#25292e",
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 8,
  },
});
