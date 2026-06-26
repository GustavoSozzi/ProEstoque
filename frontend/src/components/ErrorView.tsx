import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '../constants/theme';
import { Button } from './Button';

interface ErrorViewProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorView({ 
  message = 'Algo deu errado. Tente novamente.',
  onRetry 
}: ErrorViewProps) {
  return (
    <View style={styles.container}>
      <Feather name="alert-circle" size={64} color={Colors.error[500]} />
      <Text style={styles.title}>Ops!</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Button
          title="Tentar Novamente"
          onPress={onRetry}
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.appBackground,
    padding: Spacing[6],
  },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginTop: Spacing[4],
    marginBottom: Spacing[2],
  },
  message: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing[6],
  },
  button: {
    minWidth: 200,
  },
});
