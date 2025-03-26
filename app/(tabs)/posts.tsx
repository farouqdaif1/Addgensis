import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  deletePost,
  createFacebookAd,
  enhanceWithAI,
} from "../../store/photoSlice";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

interface Post {
  id: string;
  images: string[];
  caption?: string;
  createdAt: string;
  name: string;
  description: string;
  price: number;
}

const screenWidth = Dimensions.get("window").width;

export default function PostsScreen() {
  const dispatch = useDispatch();
  const posts = useSelector(
    (state: { photos: { posts: Post[] } }) => state.photos.posts
  );
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDeletePost = (postId: string) => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => dispatch(deletePost(postId)),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const handleEditPost = (postId: string) => {
    // In a real app, you would navigate to the edit screen with the post data
    Alert.alert("Edit Post", "This feature will be available soon!");
    // Future implementation could navigate to edit screen
    // router.push(`/(tabs)/edit/${postId}`);
  };

  const handleToggleExpand = (postId: string) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  const handleCreateFacebookAd = (postId: string) => {
    dispatch(createFacebookAd(postId));
    Alert.alert("Facebook Ad", "Creating Facebook advertisement...");
  };

  const handleEnhanceWithAI = (postId: string) => {
    dispatch(enhanceWithAI(postId));
    Alert.alert("AI Enhancement", "Enhancing post with AI...");
  };

  const openImageViewer = (uri: string) => {
    setSelectedImage(uri);
    setImageViewerVisible(true);
  };

  const closeImageViewer = () => {
    setImageViewerVisible(false);
    setSelectedImage(null);
  };

  const renderImageGrid = (images: string[]) => {
    // Instagram-style grid layout
    if (images.length === 0) return null;

    if (images.length === 1) {
      return (
        <TouchableOpacity onPress={() => openImageViewer(images[0])}>
          <Image source={{ uri: images[0] }} style={styles.singleImage} />
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.imageGrid}>
        {images.map((uri, index) => (
          <TouchableOpacity
            key={index}
            style={styles.gridImageContainer}
            onPress={() => openImageViewer(uri)}
          >
            <Image source={{ uri }} style={styles.gridImage} />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderPostItem = ({ item }: { item: Post }) => {
    const isExpanded = expandedPostId === item.id;

    return (
      <View style={styles.postContainer}>
        <View style={styles.postHeader}>
          <View style={styles.postHeaderInfo}>
            <Text style={styles.postName}>{item.name}</Text>
            <Text style={styles.postDate}>{formatDate(item.createdAt)}</Text>
          </View>
          <View style={styles.postHeaderActions}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleEditPost(item.id)}
            >
              <Ionicons name="create-outline" size={22} color="#ffd33d" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleDeletePost(item.id)}
            >
              <Ionicons name="trash-outline" size={22} color="#ff3b30" />
            </TouchableOpacity>
          </View>
        </View>

        {renderImageGrid(item.images)}

        <View style={styles.postDetails}>
          <Text style={styles.priceTag}>${item.price.toFixed(2)}</Text>

          <TouchableOpacity
            style={styles.descriptionToggle}
            onPress={() => handleToggleExpand(item.id)}
          >
            <Text style={styles.descriptionLabel}>
              {isExpanded ? "Hide Description" : "Show Description"}
            </Text>
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={16}
              color="#ffd33d"
            />
          </TouchableOpacity>
        </View>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <Text style={styles.description}>{item.description}</Text>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.facebookButton]}
                onPress={() => handleCreateFacebookAd(item.id)}
              >
                <Ionicons name="logo-facebook" size={18} color="#ffffff" />
                <Text style={styles.buttonText}>Create Facebook Ad</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.aiButton]}
                onPress={() => handleEnhanceWithAI(item.id)}
              >
                <Ionicons name="flash-outline" size={18} color="#ffffff" />
                <Text style={styles.buttonText}>Enhance with AI</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Posts</Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)/post")}>
          <Ionicons name="add-circle-outline" size={24} color="#ffd33d" />
        </TouchableOpacity>
      </View>

      {posts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="images-outline" size={64} color="#aaa" />
          <Text style={styles.emptyText}>
            No posts yet. Create your first post using the camera or gallery!
          </Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPostItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Full screen image viewer modal */}
      <Modal
        visible={imageViewerVisible}
        transparent={true}
        onRequestClose={closeImageViewer}
        animationType="fade"
      >
        <View style={styles.imageViewerContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={closeImageViewer}
          >
            <Ionicons name="close" size={30} color="#ffffff" />
          </TouchableOpacity>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </View>
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
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#353840",
    backgroundColor: "#25292e",
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  listContainer: {
    paddingBottom: 20,
  },
  postContainer: {
    marginHorizontal: 12,
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: "#2d3035",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  postHeaderInfo: {
    flex: 1,
  },
  postHeaderActions: {
    flexDirection: "row",
  },
  iconButton: {
    padding: 6,
    marginLeft: 8,
  },
  postName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  postDate: {
    fontSize: 12,
    color: "#aaaaaa",
    marginTop: 4,
  },
  singleImage: {
    width: "100%",
    height: 300,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  gridImageContainer: {
    width: "33.33%",
    aspectRatio: 1,
    padding: 1,
  },
  gridImage: {
    flex: 1,
    width: null,
    height: null,
  },
  postDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  priceTag: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2ecc71",
  },
  descriptionToggle: {
    flexDirection: "row",
    alignItems: "center",
  },
  descriptionLabel: {
    color: "#ffd33d",
    marginRight: 5,
    fontWeight: "500",
  },
  expandedContent: {
    padding: 15,
    borderTopWidth: 0.5,
    borderTopColor: "#353840",
  },
  description: {
    fontSize: 14,
    marginBottom: 15,
    lineHeight: 20,
    color: "#ffffff",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  facebookButton: {
    backgroundColor: "#ffd33d",
  },
  aiButton: {
    backgroundColor: "#ffd33d",
  },
  buttonText: {
    color: "#25292e",
    fontWeight: "bold",
    marginLeft: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
  },
  imageViewerContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
  },
  fullScreenImage: {
    width: "100%",
    height: "80%",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 5,
  },
});
