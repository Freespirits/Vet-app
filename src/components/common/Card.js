import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';

const Card = ({ 
  children, 
  style, 
  onPress, 
  activeOpacity = 0.7,
  disabled = false,
  ...props 
}) => {
  const Component = onPress ? TouchableOpacity : View;
  
  return (
    <Component
      style={[globalStyles.card, style]}
      onPress={onPress}
      activeOpacity={activeOpacity}
      disabled={disabled}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;