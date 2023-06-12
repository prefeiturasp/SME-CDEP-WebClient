import { Layout, theme } from 'antd';
import React from 'react';

import styled from 'styled-components';

const { useToken } = theme;

const SiderContainer = styled(Layout.Sider)`
  box-shadow: 4px 0px 8px rgba(0, 0, 0, 0.1);
`;

const Sider: React.FC = () => {
  const { token } = useToken();

  const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: token.colorPrimary,
    overflow: 'auto',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
  };

  return (
    <SiderContainer width={72} style={contentStyle}>
      Menu lateral
    </SiderContainer>
  );
};

export default Sider;
