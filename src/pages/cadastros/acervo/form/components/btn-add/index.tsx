import { Button, ButtonProps } from 'antd';
import React from 'react';
import { FaPlus } from 'react-icons/fa';

export const ButtonAdicionar: React.FC<ButtonProps> = ({ ...rest }) => (
  <Button
    type='default'
    block
    icon={<FaPlus />}
    style={{
      marginTop: 24,
      fontSize: 16,
      width: '43px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
    {...rest}
  />
);
