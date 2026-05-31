import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../constants/theme';
import { CATEGORIAS } from '../data/mockData';
import { ProdutoFormData, produtoSchema } from '../schemas/produtoSchema';
import { Button } from './Button';

interface ProdutoFormProps {
  defaultValues?: Partial<ProdutoFormData>;
  onSubmit: (data: ProdutoFormData) => void;
  submitLabel?: string;
  isLoading?: boolean;
}

const UNIDADES = ['un', 'kg', 'g', 'L', 'ml', 'pct', 'cx'];

export function ProdutoForm({
  defaultValues,
  onSubmit,
  submitLabel = 'Salvar',
  isLoading,
}: ProdutoFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues: defaultValues || {
      nome: '',
      categoria: '',
      quantidade: 0,
      quantidadeMinima: 0,
      preco: 0,
      unidade: 'un',
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Nome */}
        <View style={styles.field}>
          <Text style={styles.label}>Nome do Produto *</Text>
          <Controller
            control={control}
            name="nome"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.nome && styles.inputError]}
                placeholder="Ex: Notebook Dell"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {errors.nome && <Text style={styles.errorText}>{errors.nome.message}</Text>}
        </View>

        {/* Categoria */}
        <View style={styles.field}>
          <Text style={styles.label}>Categoria *</Text>
          <Controller
            control={control}
            name="categoria"
            render={({ field: { onChange, value } }) => (
              <View style={styles.chipsContainer}>
                {CATEGORIAS.filter((c) => c !== 'Todas').map((cat) => (
                  <Button
                    key={cat}
                    title={cat}
                    variant={value === cat ? 'primary' : 'outline'}
                    onPress={() => onChange(cat)}
                    style={styles.chipButton}
                  />
                ))}
              </View>
            )}
          />
          {errors.categoria && <Text style={styles.errorText}>{errors.categoria.message}</Text>}
        </View>

        {/* Quantidade e Quantidade Mínima */}
        <View style={styles.row}>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Quantidade *</Text>
            <Controller
              control={control}
              name="quantidade"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.quantidade && styles.inputError]}
                  placeholder="0"
                  keyboardType="numeric"
                  value={value?.toString() || ''}
                  onChangeText={(text) => onChange(parseFloat(text) || 0)}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.quantidade && (
              <Text style={styles.errorText}>{errors.quantidade.message}</Text>
            )}
          </View>

          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Qtd. Mínima *</Text>
            <Controller
              control={control}
              name="quantidadeMinima"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.quantidadeMinima && styles.inputError]}
                  placeholder="0"
                  keyboardType="numeric"
                  value={value?.toString() || ''}
                  onChangeText={(text) => onChange(parseFloat(text) || 0)}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.quantidadeMinima && (
              <Text style={styles.errorText}>{errors.quantidadeMinima.message}</Text>
            )}
          </View>
        </View>

        {/* Preço e Unidade */}
        <View style={styles.row}>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Preço (R$) *</Text>
            <Controller
              control={control}
              name="preco"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.preco && styles.inputError]}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  value={value?.toString() || ''}
                  onChangeText={(text) => onChange(parseFloat(text) || 0)}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.preco && <Text style={styles.errorText}>{errors.preco.message}</Text>}
          </View>

          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Unidade *</Text>
            <Controller
              control={control}
              name="unidade"
              render={({ field: { onChange, value } }) => (
                <View style={styles.unidadesRow}>
                  {UNIDADES.map((un) => (
                    <Button
                      key={un}
                      title={un}
                      variant={value === un ? 'primary' : 'outline'}
                      onPress={() => onChange(un)}
                      style={styles.unidadeButton}
                    />
                  ))}
                </View>
              )}
            />
            {errors.unidade && <Text style={styles.errorText}>{errors.unidade.message}</Text>}
          </View>
        </View>

        <Button
          title={submitLabel}
          onPress={handleSubmit(onSubmit)}
          isLoading={isLoading}
          fullWidth
          style={styles.submitButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.appBackground,
  },
  scrollContent: {
    padding: Spacing[4],
  },
  field: {
    marginBottom: Spacing[4],
  },
  halfField: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing[3],
  },
  label: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing[2],
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputError: {
    borderColor: Colors.danger.border,
  },
  errorText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.danger.text,
    marginTop: Spacing[1],
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
  },
  chipButton: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
  },
  unidadesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[1],
  },
  unidadeButton: {
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    minWidth: 40,
  },
  submitButton: {
    marginTop: Spacing[4],
  },
});
