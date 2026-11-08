import React from "react";
import {
  View,
  Text,
  TextInput,
  ViewProps,
  TextProps,
  TextInputProps,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { useTheme } from "@/context/ThemedContext";

// 1. Themed View
export function ThemedView({ style, ...props }: ViewProps) {
  const { themeColors } = useTheme();
  return (
    <View style={[{ backgroundColor: themeColors.bg }, style]} {...props} />
  );
}

// 2. Themed Primary Button
export interface ThemedButtonPrimaryProps extends TouchableOpacityProps {
  title?: string;
}

export function ThemedButtonPrimary({
  style,
  title,
  children,
  ...props
}: ThemedButtonPrimaryProps) {
  const { themeColors } = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: themeColors.tint ?? "#48c0e7" }, // Falls back safely if tint isn't in your theme object
        style,
      ]}
      {...props}
    >
      {title ? <Text style={styles.buttonText}>{title}</Text> : children}
    </TouchableOpacity>
  );
}
export function ThemedButtonSecondary({
  style,
  title,
  children,
  ...props
}: ThemedButtonPrimaryProps) {
  const { themeColors } = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: themeColors.secondaryBtnBg ?? "#edf3f5" }, // Falls back safely if tint isn't in your theme object
        style,
      ]}
      {...props}
    >
      {title ? <Text style={styles.buttonText}>{title}</Text> : children}
    </TouchableOpacity>
  );
}

// 3. Themed Text
export function ThemedText({ style, ...props }: TextProps) {
  const { themeColors } = useTheme();
  return (
    <Text
      style={[{ color: themeColors.text, fontSize: 16 }, style]}
      {...props}
    />
  );
}

// 4. Themed Input
export function ThemedInput({ style, ...props }: TextInputProps) {
  const { themeColors } = useTheme();
  return (
    <TextInput
      placeholderTextColor="#888"
      style={[
        styles.input,
        {
          backgroundColor: themeColors.inputBg,
          color: themeColors.text,
          borderColor: themeColors.border,
        },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 45,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginVertical: 8,
  },
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
