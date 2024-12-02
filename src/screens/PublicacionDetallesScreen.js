import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MapView, { Marker } from 'react-native-maps';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const PublicationDetailScreen = ({ route, navigation }) => {
  const { publication } = route.params;
  const [selectedImage, setSelectedImage] = useState(null);

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Icon name="chevron-back" size={24} color="#000" />
        <Text style={styles.headerTitle}>Detalles de Publicación</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCard = (title, content) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {content}
    </View>
  );

  const renderMap = () => (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: parseFloat(publication.latitud),
        longitude: parseFloat(publication.longitud),
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
    >
      <Marker
        coordinate={{
          latitude: parseFloat(publication.latitud),
          longitude: parseFloat(publication.longitud),
        }}
        title={publication.titulo}
      />
    </MapView>
  );

  const renderEvidences = () => {
    if (!publication.evidencias || publication.evidencias.length === 0) {
      return <Text style={styles.noEvidenceText}>No hay evidencias disponibles</Text>;
    }

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {publication.evidencias.map((evidence, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedImage(evidence.archivo)}
          >
            <Image
              source={{ uri: "https://res.cloudinary.com/de06451wd/" + evidence.archivo }}
              style={styles.evidenceImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderImageModal = () => (
    <Modal
      visible={!!selectedImage}
      transparent={true}
      onRequestClose={() => setSelectedImage(null)}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setSelectedImage(null)}
        >
          <Icon name="close" size={30} color="#fff" />
        </TouchableOpacity>
        <Image
          source={{ uri: "https://res.cloudinary.com/de06451wd/" + selectedImage }}
          style={styles.fullScreenImage}
          resizeMode="contain"
        />
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <ScrollView style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.publicationTitle}>{publication.titulo}</Text>
          <Text style={styles.publicationCode}>{publication.codigo}</Text>
        </View>

        {renderCard("Información General", (
          <View>
            <Text style={styles.infoText}>
              <Icon name="person-outline" size={16} color="#666" /> Autor: {publication.usuario.nombre}
            </Text>
            <Text style={styles.infoText}>
              <Icon name="calendar-outline" size={16} color="#666" /> Fecha: {new Date(publication.fecha_publicacion).toLocaleString()}
            </Text>
            <View style={styles.tagContainer}>
              <View style={[styles.tag, { backgroundColor: getSituationColor(publication.situacion.nombre) }]}>
                <Text style={styles.tagText}>{publication.situacion.nombre}</Text>
              </View>
              <View style={[styles.tag, { backgroundColor: '#4CAF50' }]}>
                <Text style={styles.tagText}>{publication.categoria.nombre}</Text>
              </View>
            </View>
          </View>
        ))}

        {renderCard("Descripción", (
          <Text style={styles.descriptionText}>{publication.descripcion}</Text>
        ))}

        {renderCard("Ubicación", (
          <View>
            <Text style={styles.infoText}>
              <Icon name="home-outline" size={16} color="#666" /> Junta Vecinal: {publication.junta_vecinal.villa}
            </Text>
            <Text style={styles.infoText}>
              <Icon name="location-outline" size={16} color="#666" /> Dirección: {publication.junta_vecinal.nombre_calle} {publication.junta_vecinal.numero_calle}
            </Text>
            {renderMap()}
          </View>
        ))}

        {renderCard("Departamento", (
          <Text style={styles.infoText}>
            <Icon name="business-outline" size={16} color="#666" /> {publication.departamento.nombre}
          </Text>
        ))}

        {renderCard("Evidencias", renderEvidences())}
      </ScrollView>
      {renderImageModal()}
    </SafeAreaView>
  );
};

const getSituationColor = (situation) => {
  switch (situation) {
    case 'Recibido':
      return '#FFA500';
    case 'En curso':
      return '#4CAF50';
    case 'Pendiente':
      return '#FF5722';
    default:
      return '#9E9E9E';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
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
  titleContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  publicationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  publicationCode: {
    fontSize: 14,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  map: {
    height: 200,
    marginTop: 8,
    borderRadius: 8,
  },
  evidenceImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginRight: 8,
  },
  noEvidenceText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: screenWidth,
    height: screenHeight,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
});

export default PublicationDetailScreen;

