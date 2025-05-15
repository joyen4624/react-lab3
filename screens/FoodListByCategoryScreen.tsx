import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Appbar, Button, Card } from 'react-native-paper';
import { CartContext } from '../context/CartContext';

const imageMap: Record<string, any> = {
  'chinese.png': require('../assets/images/chinese.png'),
  'south-indian.png': require('../assets/images/south-indian.png'),
  'beverages.png': require('../assets/images/beverages.png'),
  'north-indian.png': require('../assets/images/north-indian.png'),
  'banana.png': require('../assets/images/banana.png'),
  'biryani.png': require('../assets/images/biryani.png'),
  'mexican.png': require('../assets/images/mexican.png'),
  'pizza.png': require('../assets/images/pizza.png'),
  'desserts.png': require('../assets/images/desserts.png'),
  'ice-creams.png': require('../assets/images/ice-creams.png'),
  'placeholder.png': require('../assets/images/placeholder-food.png'),
};

type RouteParams = {
  category: string;
};

export default function FoodListByCategoryScreen() {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const { category } = route.params;
  const [foods, setFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('foods')
      .where('category', '==', category)
      .onSnapshot(snapshot => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFoods(items);
        setLoading(false);
      });

    return unsubscribe;
  }, [category]);

  const renderItem = ({ item }: any) => (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Image
          source={imageMap[item.image] || imageMap['placeholder.png']}
          style={styles.image}
        />
        <Text style={styles.name}>{item.title}</Text>
        <Text style={styles.price}>Giá: {item.price} đ</Text>
        <Button mode="contained" onPress={() => addToCart(item)}>
          Thêm vào giỏ
        </Button>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: 'white' }}>
        <Appbar.BackAction onPress={() => {}} />
        <Appbar.Content title={category} />
      </Appbar.Header>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={foods}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  card: { marginBottom: 16 },
  cardContent: { alignItems: 'center' },
  image: { width: 100, height: 100, resizeMode: 'contain', marginBottom: 8 },
  name: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  price: { fontSize: 14, marginBottom: 8 },
});
