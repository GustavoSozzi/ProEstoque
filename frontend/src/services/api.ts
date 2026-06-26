import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Obter URL da API das variáveis de ambiente
const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3001/api';

// Configuração base da API
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request - adiciona o token JWT automaticamente
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@proestoque:token');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    } catch (error) {
      console.error('Erro ao obter token:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de response - trata erros 401 (não autenticado)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido - limpar armazenamento
      try {
        await AsyncStorage.removeItem('@proestoque:token');
        await AsyncStorage.removeItem('@proestoque:user');
        
        // Você pode adicionar navegação para tela de login aqui se necessário
        console.log('Token inválido ou expirado. Faça login novamente.');
      } catch (storageError) {
        console.error('Erro ao limpar storage:', storageError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
