
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

export default function Publicacion({item: publication}) {
  
  return (
    <View style={styles.publicationCard}>
      <View style={styles.publicationHeader}>
        <Text style={styles.publicationTitle}>{publication.titulo}</Text>
        <Text style={styles.publicationCode}>{publication.codigo}</Text>
      </View>
      <Text style={styles.publicationAuthor}>Por: {publication.usuario.nombre}</Text>
      <Text style={styles.publicationDescription}>{publication.descripcion}</Text>
      <View style={styles.publicationFooter}>
        <Text style={styles.publicationDate}>
          {new Date(publication.fecha_publicacion).toLocaleDateString()}
        </Text>
        <View style={[styles.situationTag, { backgroundColor: getSituationColor(publication.situacion.nombre) }]}>
          <Text style={styles.situationText}>{publication.situacion.nombre}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  publicationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  publicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  publicationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  publicationCode: {
    fontSize: 12,
    color: '#666',
  },
  publicationDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  publicationAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  publicationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  publicationDate: {
    fontSize: 12,
    color: '#666',
  },
  situationTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  situationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});



