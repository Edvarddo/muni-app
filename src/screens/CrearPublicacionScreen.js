import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function CrearPublicacionScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(['General']);

  const categories = ['General', 'Eventos', 'Discusiones'];

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleAddPost = () => {
    // Aquí irá la lógica para crear el post
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="chevron-back" size={24} color="#000" />
          <Text style={styles.headerTitle}>Crear Publicación</Text>
        </TouchableOpacity>
        <Icon name="chatbox-ellipses-outline" size={24} color="#000" />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Título</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese el título"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Contenido</Text>
          <TextInput
            style={[styles.input, styles.contentInput]}
            placeholder="Escriba el contenido"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Categoría</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategories.includes(category) && styles.categoryChipSelected
                ]}
                onPress={() => toggleCategory(category)}
              >
                <Text style={[
                  styles.categoryChipText,
                  selectedCategories.includes(category) && styles.categoryChipTextSelected
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.addCategoryButton}>
              <Icon name="add" size={24} color="#FF5722" />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={handleCancel}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddPost}
        >
          <Text style={styles.addButtonText}>Añadir Post</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  contentInput: {
    height: 150,
    textAlignVertical: 'top',
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF5722',
    marginRight: 8,
  },
  categoryChipSelected: {
    backgroundColor: '#FF5722',
  },
  categoryChipText: {
    color: '#FF5722',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryChipTextSelected: {
    color: '#fff',
  },
  addCategoryButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF5722',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF5722',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FF5722',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#FF5722',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

