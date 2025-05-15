import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Appbar, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const imageMap: Record<string, any> = {
  'chinese.png': require('../assets/images/chinese.png'),
  'south-indian.png': require('../assets/images/south-indian.png'),
  'beverages.png': require('../assets/images/beverages.png'),
  'north-indian.png': require('../assets/images/north-indian.png'),
  'banana.png': require('../assets/images/banana.png'),
  'biryani.png': require('../assets/images/biryani.png'),
  'mexican.png': require('../assets/images/mexican.png'),
  'pizza.png': require('../assets/images/pizza.png'),
  'pizza (1).png': require('../assets/images/pizza (1).png'),
  'desserts.png': require('../assets/images/desserts.png'),
  'ice-creams.png': require('../assets/images/ice-creams.png'),
  'food.jpeg': require('../assets/images/food.jpeg'),
  'placeholder.png': require('../assets/images/placeholder-food.png'),
};

export default function HomeScreen() {
  const [foods, setFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('foods')
      .onSnapshot(snapshot => {
        const items = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
          };
        });
        setFoods(items);
        setLoading(false);
      });

    return unsubscribe;
  }, []);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('Category', { category: item.category })}>
      <Card style={styles.card} elevation={2}>
        <Card.Content style={styles.cardContent}>
          <Image
            source={imageMap[item.image] || imageMap['placeholder.png']}
            style={styles.image}
          />
          <Text style={styles.label}>{item.title}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}> 
        <ActivityIndicator size="large" color="#d32f2f" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={{ backgroundColor: 'white' }}>
        <Appbar.Action icon="menu" onPress={() => {}} />
        <Appbar.Content title="Restaurant App" titleStyle={{ textAlign: 'center', color: 'red' }} />
        <Appbar.Action icon="cart" onPress={() => navigation.navigate('Cart')} />
      </Appbar.Header>

      <Text style={styles.header}>Cuisine</Text>

      <FlatList
        data={foods}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 12,
    marginLeft: 16,
    color: 'crimson',
  },
  grid: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  item: {
    flex: 1,
    margin: 8,
  },
  card: {
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  cardContent: {
    alignItems: 'center',
  },
  image: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
