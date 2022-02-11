import React from 'react';
import { ISpinnerProps, ISpinnerStyles, Spinner } from '@fluentui/react';

const spinnerStyles: Partial<ISpinnerStyles> = { root: { padding: '0 8px' } };

export interface SpinnerItemProps {
  text?: string;
}

const SpinnerItem: React.FC<SpinnerItemProps> = ({ text = '' }) => {
  const extraProps: Partial<ISpinnerProps> = text ? { label: text, labelPosition: 'right' } : {};
  return <Spinner styles={spinnerStyles} {...extraProps} />;
};

export default SpinnerItem;
