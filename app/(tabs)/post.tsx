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
        <Text style={styles.title}>Create New Ad</Text>
        <Ionicons name="megaphone-outline" size={24} color="#2563EB" />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Ad Title</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter ad title"
          placeholderTextColor="#94A3B8"
          selectionColor="#2563EB"
        />

        <Text style={styles.label}>Ad Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter ad description"
          placeholderTextColor="#94A3B8"
          multiline
          numberOfLines={4}
          selectionColor="#2563EB"
        />

        <Text style={styles.label}>Price</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="Enter price"
          placeholderTextColor="#94A3B8"
          keyboardType="numeric"
          selectionColor="#2563EB"
        />

        <View style={styles.imageSelectionContainer}>
          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={pickImage}
          >
            <Ionicons name="images-outline" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Select Images</Text>
          </TouchableOpacity>
        </View>

        {selectedImages.length > 0 && (
          <View style={styles.imagePreviewContainer}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewText}>
                Selected Images ({selectedImages.length})
              </Text>
              <TouchableOpacity
                style={styles.addMoreButton}
                onPress={pickImage}
              >
                <Ionicons name="add" size={20} color="#2563EB" />
                <Text style={styles.addMoreText}>Add More</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.imageScrollContainer}
              decelerationRate="fast"
              snapToInterval={140}
            >
              {selectedImages.map((uri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri }} style={styles.imagePreview} />
                  <View style={styles.imageOverlay}>
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(uri)}
                    >
                      <Ionicons name="close-circle" size={24} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.imageNumber}>
                    <Text style={styles.imageNumberText}>{index + 1}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Create Ad</Text>
          <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1E293B",
  },
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1E293B",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    color: "#1E293B",
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
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  imagePreviewContainer: {
    marginTop: 15,
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  previewText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },
  addMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  addMoreText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2563EB",
  },
  imageScrollContainer: {
    paddingRight: 16,
    gap: 12,
  },
  imageWrapper: {
    position: "relative",
    width: 120,
    height: 120,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 12,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 8,
  },
  removeImageButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageNumber: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  imageNumberText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#2563EB",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
});
