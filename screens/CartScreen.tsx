import React, { useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Appbar, Button, Card, IconButton } from 'react-native-paper';
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

export default function CartScreen() {
  const { cartItems, setCartItems, clearCart } = useContext(CartContext);

  const increaseQty = (id: string) => {
    const updated = cartItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updated);
  };

  const decreaseQty = (id: string) => {
    const updated = cartItems.map(item =>
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    );
    setCartItems(updated);
  };

  const itemsTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = 18;
  const taxes = itemsTotal * 0.08;
  const delivery = 30;
  const totalPay = itemsTotal - discount + taxes + delivery;

  const renderItem = ({ item }: any) => (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Image source={imageMap[item.image] || imageMap['placeholder.png']} style={styles.image} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.title}</Text>
          <View style={styles.qtyRow}>
            <IconButton icon="minus" size={16} onPress={() => decreaseQty(item.id)} />
            <Text>{item.quantity}</Text>
            <IconButton icon="plus" size={16} onPress={() => increaseQty(item.id)} />
            <Text style={styles.price}>{item.price * item.quantity} đ</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: 'white' }}>
        <Appbar.BackAction onPress={() => {}} />
        <Appbar.Content title="Cart" />
      </Appbar.Header>

      {cartItems.length === 0 ? (
        <Text style={styles.empty}>Your cart is empty</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item, index) => item.id + index}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16 }}
          />

          <View style={styles.receipt}>
            <Text style={styles.receiptText}>Items Total: {itemsTotal.toFixed(2)} đ</Text>
            <Text style={styles.receiptText}>Offer Discount: -{discount} đ</Text>
            <Text style={styles.receiptText}>Taxes (8%): {taxes.toFixed(2)} đ</Text>
            <Text style={styles.receiptText}>Delivery Charges: {delivery} đ</Text>
            <Text style={styles.total}>Total Pay: {totalPay.toFixed(2)} đ</Text>
            <Button mode="contained" onPress={clearCart} style={styles.payButton}>
              Proceed To Pay
            </Button>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  card: { marginBottom: 16 },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  image: { width: 64, height: 64, marginRight: 12, resizeMode: 'contain' },
  name: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  price: { marginLeft: 'auto', fontWeight: '600' },
  receipt: { padding: 16, borderTopWidth: 1, borderColor: '#ccc' },
  receiptText: { fontSize: 14, marginBottom: 4 },
  total: { fontSize: 16, fontWeight: 'bold', marginTop: 8 },
  payButton: { marginTop: 12 },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 16 },
});
