# Instagram-like Camera App

A mobile app built with Expo and React Native that allows users to take photos with the device camera, save images to the mobile gallery, and create posts with one or more images.

## Features

- Camera functionality to take photos
- Automatic saving of photos to the device gallery
- Create posts with single or multiple images
- Pick images from the device's gallery
- View all your posts in an Instagram-like feed

## Installation

1. Make sure you have Node.js and npm/yarn installed
2. Install Expo CLI globally:
```
npm install -g expo-cli
```
3. Clone this repository
4. Install the dependencies:
```
npm install
```
5. Run the app:
```
npx expo start
```

## Dependencies

This app requires the following dependencies:

```
expo-camera
expo-media-library
expo-image-picker
expo-router
@reduxjs/toolkit
react-redux
@expo/vector-icons
```

To install them, run:

```
npx expo install expo-camera expo-media-library expo-image-picker expo-router @reduxjs/toolkit react-redux @expo/vector-icons
```

## How to Use

1. Open the app
2. Use the Camera tab to take photos
3. Photos are automatically saved to your device gallery
4. Use the New Post tab to create a post
   - Select images from your device gallery
   - Add a caption
   - Share your post
5. View all your posts in the My Posts tab
