import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  loading = false,
  style,
  textStyle,
  icon,
  fullWidth = false
}) => {
  const getButtonStyle = () => {
    let baseStyle = [styles.button, styles[size]];
    
    if (fullWidth) {
      baseStyle.push(styles.fullWidth);
    }
    
    switch (variant) {
      case 'primary':
        baseStyle.push(styles.primaryButton);
        break;
      case 'secondary':
        baseStyle.push(styles.secondaryButton);
        break;
      case 'outline':
        baseStyle.push(styles.outlineButton);
        break;
      case 'danger':
        baseStyle.push(styles.dangerButton);
        break;
      case 'success':
        baseStyle.push(styles.successButton);
        break;
      case 'ghost':
        baseStyle.push(styles.ghostButton);
        break;
      default:
        baseStyle.push(styles.primaryButton);
    }
    
    if (disabled) {
      baseStyle.push(styles.disabledButton);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    let baseStyle = [styles.buttonText];
    
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
      case 'success':
        baseStyle.push(styles.lightText);
        break;
      case 'outline':
      case 'ghost':
        baseStyle.push(styles.darkText);
        break;
      default:
        baseStyle.push(styles.lightText);
    }
    
    if (disabled) {
      baseStyle.push(styles.disabledText);
    }
    
    return baseStyle;
  };

  const getLoadingColor = () => {
    switch (variant) {
      case 'outline':
      case 'ghost':
        return Colors.primary;
      default:
        return Colors.surface;
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getLoadingColor()} />
      ) : (
        <>
          {icon}
          <Text style={[getTextStyle(), textStyle, icon && styles.textWithIcon]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 48,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 56,
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  dangerButton: {
    backgroundColor: Colors.error,
  },
  successButton: {
    backgroundColor: Colors.success,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  disabledButton: {
    backgroundColor: Colors.border,
    borderColor: Colors.border,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  lightText: {
    color: Colors.surface,
  },
  darkText: {
    color: Colors.primary,
  },
  disabledText: {
    color: Colors.textSecondary,
  },
  textWithIcon: {
    marginLeft: 8,
  },
});

export default Button;