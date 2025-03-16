import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { deletePost } from "../../store/photoSlice";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Post {
  id: string;
  images: string[];
  caption?: string;
  createdAt: number;
}

const screenWidth = Dimensions.get("window").width;

export default function PostsScreen() {
  const dispatch = useDispatch();
  const posts = useSelector(
    (state: { photos: { posts: Post[] } }) => state.photos.posts
  );

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDeletePost = (postId: string) => {
    dispatch(deletePost(postId));
  };

  const renderPost = ({ item }: { item: Post }) => {
    return (
      <View style={styles.postContainer}>
        <View style={styles.postHeader}>
          <View style={styles.userInfo}>
            <View style={styles.userAvatar}>
              <Ionicons name="person" size={18} color="#fff" />
            </View>
            <Text style={styles.username}>You</Text>
          </View>
          <TouchableOpacity onPress={() => handleDeletePost(item.id)}>
            <Ionicons name="trash-outline" size={24} color="#ff6b6b" />
          </TouchableOpacity>
        </View>

        {item.images.length === 1 ? (
          <Image source={{ uri: item.images[0] }} style={styles.singleImage} />
        ) : (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          >
            {item.images.map((uri, index) => (
              <Image
                key={index}
                source={{ uri }}
                style={styles.multipleImage}
              />
            ))}
          </ScrollView>
        )}

        <View style={styles.postActions}>
          <View style={styles.actionButtons}>
            <Ionicons
              name="heart-outline"
              size={28}
              color="#ffd33d"
              style={styles.actionIcon}
            />
            <Ionicons
              name="chatbubble-outline"
              size={24}
              color="#ffd33d"
              style={styles.actionIcon}
            />
            <Ionicons
              name="paper-plane-outline"
              size={24}
              color="#ffd33d"
              style={styles.actionIcon}
            />
          </View>
          <Ionicons name="bookmark-outline" size={24} color="#ffd33d" />
        </View>

        {item.caption && (
          <View style={styles.captionContainer}>
            <Text style={styles.username}>You</Text>
            <Text style={styles.caption}>{item.caption}</Text>
          </View>
        )}

        <Text style={styles.postDate}>{formatDate(item.createdAt)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Posts</Text>
        <TouchableOpacity>
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
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    marginBottom: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#353840",
    paddingBottom: 15,
    backgroundColor: "#25292e",
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#353840",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  username: {
    color: "#fff",
    fontWeight: "bold",
    marginRight: 5,
  },
  singleImage: {
    width: screenWidth,
    height: screenWidth,
  },
  multipleImage: {
    width: screenWidth,
    height: screenWidth,
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  actionButtons: {
    flexDirection: "row",
  },
  actionIcon: {
    marginRight: 15,
  },
  captionContainer: {
    flexDirection: "row",
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  caption: {
    color: "#fff",
    flex: 1,
    flexWrap: "wrap",
  },
  postDate: {
    color: "#aaa",
    fontSize: 12,
    paddingHorizontal: 15,
    marginTop: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
  },
});
