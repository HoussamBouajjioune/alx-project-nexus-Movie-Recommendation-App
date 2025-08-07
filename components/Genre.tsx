import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
} from 'react-native';
import { genres } from '@/constants/genres'; // Assuming you have a genres constant file

const Genre = ({ onSelect }: { onSelect: (id: number) => void }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Set default selected to the first genre on mount
  useEffect(() => {
    if (genres.length > 0) {
      setSelectedId(genres[0].id);
      onSelect(genres[0].id); // Notify parent
    }
  }, []);

  const handleSelect = (id: number) => {
    setSelectedId(id);
    onSelect(id);
    setModalVisible(false);
  };

  return (
    <View className="w-full px-4 mt-4 mb-4 rounded-full  bg-dark-200">
      {/* Trigger Button */}
      <TouchableOpacity
        className="bg-dark-200 rounded-full px-5 py-4"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white text-center p-2 font-semibold">
          {selectedId
            ? `Selected: ${
                genres.find((g) => g.id === selectedId)?.name || 'Genre'
              }`
            : 'Select Genre'}
        </Text>
      </TouchableOpacity>

      {/* Fullscreen Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-white pt-12 px-4">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold">Choose a Genre</Text>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text className="text-blue-600 text-base">Close</Text>
            </Pressable>
          </View>

          {/* Scrollable List */}
          <FlatList
            data={genres}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isSelected = item.id === selectedId;
              return (
                <TouchableOpacity
                  className="py-4 px-4 flex-row items-center gap-3 border-b border-gray-200"
                  onPress={() => handleSelect(item.id)}
                >
                  {/* Blue Dot for selected item */}
                  {isSelected ? (
                    <View className="w-3 h-3 rounded-full bg-blue-600" />
                  ) : (
                    <View className="w-3 h-3" />
                  )}
                  <Text className="text-lg text-gray-800">{item.name}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

export default Genre;
