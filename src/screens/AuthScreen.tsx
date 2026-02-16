import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

type Mode = 'login' | 'register';

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert('Error', 'Completa email y contraseña.');
      return;
    }
    if (mode === 'register') {
      const trimmedFullname = fullname.trim();
      if (!trimmedFullname) {
        Alert.alert('Error', 'Completa tu nombre.');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(trimmedEmail, trimmedPassword);
      } else {
        await signUp(fullname.trim(), trimmedEmail, trimmedPassword);
        Alert.alert(
          'Registro enviado',
          'Revisa tu correo para confirmar la cuenta (si tienes confirmación activada).'
        );
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión o registrarte.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>{mode === 'login' ? 'Iniciar sesión' : 'Registrarse'}</Text>

        {mode === 'register' && (
          <View style={styles.field}>
            <Text style={styles.label}>Nombre completo</Text>
            <TextInput
              style={styles.input}
              value={fullname}
              onChangeText={setFullname}
              placeholder="Tu nombre"
              autoCapitalize="words"
              autoCorrect={false}
              editable={!loading}
            />
          </View>
        )}

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="email@ejemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {mode === 'login' ? 'Entrar' : 'Crear cuenta'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switch}
          onPress={() => setMode(mode === 'login' ? 'register' : 'login')}
          disabled={loading}
        >
          <Text style={styles.switchText}>
            {mode === 'login'
              ? '¿No tienes cuenta? Regístrate'
              : '¿Ya tienes cuenta? Inicia sesión'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
    color: '#1a1a1a',
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switch: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '500',
  },
});
