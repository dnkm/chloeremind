import React from 'react';
import {Button} from 'react-native';

export default function MyButton({ children, onClick }) {
  return (
    <Button
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
