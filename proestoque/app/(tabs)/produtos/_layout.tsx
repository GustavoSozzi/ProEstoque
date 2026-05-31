import { Stack } from 'expo-router';

export default function ProdutosLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Produtos',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="novo" 
        options={{ 
          title: 'Novo Produto',
          presentation: 'modal'
        }} 
      />
      <Stack.Screen 
        name="[id]" 
        options={{ 
          title: 'Editar Produto',
          presentation: 'modal'
        }} 
      />
    </Stack>
  );
}
