export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    Home: undefined;
    Category: { category: string };
    Cart: undefined;
  };
  
  export type FoodItem = {
    id: string;
    title: string;
    price: number;
    image: string;
    quantity: number; 
  };
  