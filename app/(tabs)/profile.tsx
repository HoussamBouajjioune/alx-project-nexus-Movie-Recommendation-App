import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const STORAGE_KEY = "userProfile";

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    city: "",
  });

  const loadUser = async () => {
    const savedUser = await AsyncStorage.getItem(STORAGE_KEY);
    if (savedUser) setUser(JSON.parse(savedUser));
  };

  const saveUser = async () => {
    if (!formData.firstName || !formData.lastName || !formData.age || !formData.city) {
      Alert.alert("Please fill in all fields");
      return;
    }
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    setUser(formData);
    setShowForm(false);
    router.replace("/(tabs)")
  };

  const deleteUser = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setFormData({ firstName: "", lastName: "", age: "", city: "" });
    setShowForm(false);
    router.replace("/(tabs)")
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <SafeAreaView className="bg-primary flex-1 px-5 py-8">
      <View className="flex-1 justify-item mt-10 gap-4">
        {user ? (
          <View className="gap-3 mt-10">
            <Text className="text-white text-xl">👤 User Info</Text>
            <Text className="text-gray-300">First Name: {user.firstName}</Text>
            <Text className="text-gray-300">Last Name: {user.lastName}</Text>
            <Text className="text-gray-300">Age: {user.age}</Text>
            <Text className="text-gray-300">City: {user.city}</Text>

            <TouchableOpacity
              onPress={() => {
                setShowForm(true);
                setFormData(user);
                setUser(null); // Temporarily clear user to show form
              }}
              className="bg-yellow-500 p-3 rounded-xl mt-4"
            >
              <Text className="text-center text-white">Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={deleteUser}
              className="bg-red-600 p-3 rounded-xl"
            >
              <Text className="text-center text-white">Delete</Text>
            </TouchableOpacity>
          </View>
        ) : showForm ? (
          <View className="gap-4 mt-10">
            <Text className="text-white text-xl">➕ Create User</Text>
            <TextInput
              placeholder="First Name"
              value={formData.firstName}
              onChangeText={(text) => handleInputChange("firstName", text)}
              className="bg-white rounded-xl px-4 py-3"
            />
            <TextInput
              placeholder="Last Name"
              value={formData.lastName}
              onChangeText={(text) => handleInputChange("lastName", text)}
              className="bg-white rounded-xl px-4 py-3"
            />
            <TextInput
              placeholder="Age"
              value={formData.age}
              onChangeText={(text) => handleInputChange("age", text)}
              keyboardType="numeric"
              className="bg-white rounded-xl px-4 py-3"
            />
            <TextInput
              placeholder="City"
              value={formData.city}
              onChangeText={(text) => handleInputChange("city", text)}
              className="bg-white rounded-xl px-4 py-3"
            />
            <TouchableOpacity
              onPress={saveUser}
              className="bg-green-600 p-3 rounded-xl mt-2"
            >
              <Text className="text-center text-white">Submit</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => setShowForm(true)}
            className="bg-blue-600 p-4 rounded-xl"
          >
            <Text className="text-center text-white text-lg">➕ Create User</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Profile;
