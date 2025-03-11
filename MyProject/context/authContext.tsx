import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Define Auth Context Type (Better for TypeScript)
type AuthContextType = {
  user: any;
  login: (token: string, userData: any) => void;
  logout: () => void;
  loading: boolean;
  setstate: (state: {token: string; user: any}) => void;
};

// ✅ Provide default values to avoid `null` issues
export const AuthContext = createContext<AuthContextType | null>(null);
export const AuthProvider = ({children}: any) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const authData = await AsyncStorage.getItem('@auth');
        if (authData) {
          setUser(JSON.parse(authData));
        }
      } catch (error) {
        console.log('Auth Load Error:', error);
      }
      setLoading(false);
    };
    loadUserData();
  }, []);

  const login = async (token: string, userData: any) => {
    try {
      await AsyncStorage.setItem('@auth', JSON.stringify({token, userData}));
      setUser({token, userData});
    } catch (error) {
      console.log('Login Error:', error);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('@auth');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{user, login, logout, loading, setstate: setUser}}>
      {children}
    </AuthContext.Provider>
  );
};
