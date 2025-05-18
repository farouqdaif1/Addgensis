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
              <Ionicons name="create-outline" size={22} color="#2563EB" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleDeletePost(item.id)}
            >
              <Ionicons name="trash-outline" size={22} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        {renderImageGrid(item.images)}

        <View style={styles.postDetails}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.priceTag}>${item.price.toFixed(2)}</Text>
          </View>

          <TouchableOpacity
            style={styles.descriptionToggle}
            onPress={() => handleToggleExpand(item.id)}
          >
            <Text style={styles.descriptionLabel}>
              {isExpanded ? "Hide Details" : "Show Details"}
            </Text>
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={16}
              color="#2563EB"
            />
          </TouchableOpacity>
        </View>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionLabel}>Description</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.facebookButton]}
                onPress={() => handleCreateFacebookAd(item.id)}
              >
                <Ionicons name="logo-facebook" size={18} color="#FFFFFF" />
                <Text style={styles.buttonText}>Create Facebook Ad</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.aiButton]}
                onPress={() => handleEnhanceWithAI(item.id)}
              >
                <Ionicons name="flash-outline" size={18} color="#FFFFFF" />
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
        <Text style={styles.title}>My Ads</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/(tabs)/post")}
        >
          <Ionicons name="add-circle-outline" size={24} color="#2563EB" />
        </TouchableOpacity>
      </View>

      {posts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="megaphone-outline" size={64} color="#94A3B8" />
          </View>
          <Text style={styles.emptyText}>
            No ads yet. Create your first ad using the camera or gallery!
          </Text>
          <TouchableOpacity
            style={styles.createFirstButton}
            onPress={() => router.push("/(tabs)/post")}
          >
            <Text style={styles.createFirstText}>Create Your First Ad</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPostItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
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
            <Ionicons name="close" size={30} color="#FFFFFF" />
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 20,
  },
  createFirstButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  createFirstText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  listContainer: {
    padding: 16,
  },
  separator: {
    height: 16,
  },
  postContainer: {
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
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  postHeaderInfo: {
    flex: 1,
  },
  postName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 4,
  },
  postDate: {
    fontSize: 14,
    color: "#64748B",
  },
  postHeaderActions: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  singleImage: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    marginBottom: 12,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: 12,
  },
  gridImageContainer: {
    width: (screenWidth - 40) / 3,
    height: (screenWidth - 40) / 3,
  },
  gridImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  postDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: "#64748B",
  },
  priceTag: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2563EB",
  },
  descriptionToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  descriptionLabel: {
    fontSize: 14,
    color: "#2563EB",
    fontWeight: "500",
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  descriptionContainer: {
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#475569",
    lineHeight: 24,
    marginTop: 4,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  facebookButton: {
    backgroundColor: "#1877F2",
  },
  aiButton: {
    backgroundColor: "#2563EB",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  imageViewerContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
  },
  fullScreenImage: {
    width: "100%",
    height: "100%",
  },
});
