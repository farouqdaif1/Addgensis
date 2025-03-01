import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { useSelector } from "react-redux";

export default function GalleryScreen() {
  const photos = useSelector(
    (state: { photos: { photos: string[] } }) => state.photos.photos
  ); // Get photos from Redux store

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gallery</Text>
      <ScrollView contentContainerStyle={styles.gallery}>
        {photos.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.image} />
        ))}
      </ScrollView>
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
  gallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  image: {
    width: "48%",
    height: 150,
    marginBottom: 10,
    borderRadius: 10,
  },
});
