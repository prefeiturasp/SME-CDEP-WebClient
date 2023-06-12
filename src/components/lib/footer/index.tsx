import { Layout } from 'antd';
import React from 'react';

const contentStyle: React.CSSProperties = {
  position: 'sticky',
  bottom: 0,
  zIndex: 1,
  width: '100%',
  height: '48px',
  display: 'flex',
  alignItems: 'center',
  borderTop: '1px solid #BFBFBF',
};

const Footer: React.FC = () => {
  return <Layout.Footer style={contentStyle}>Footer</Layout.Footer>;
};

export default Footer;
