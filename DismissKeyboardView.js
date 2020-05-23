import React from 'react';
import { TouchableWithoutFeedback, Keyboard, SafeAreaView } from 'react-native';

export const DismissKeyboardHOC = (Comp) => {
  return ({ children, ...props }) => (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Comp {...props}>
          {children}
        </Comp>
      </TouchableWithoutFeedback>
  );
};
export const DismissKeyboardView = DismissKeyboardHOC(SafeAreaView);
