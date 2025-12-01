import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/Colors';
import { globalStyles } from '../../styles/globalStyles';

const Loading = ({
  message = 'טוען...',
  size = 'large',
  color = Colors.primary,
  style,
  textStyle
}) => {
  return (
    <View style={[globalStyles.loadingContainer, style]}>
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text style={[globalStyles.loadingMessage, textStyle]}>
          {message}
        </Text>
      )}
    </View>
  );
};

export default Loading;