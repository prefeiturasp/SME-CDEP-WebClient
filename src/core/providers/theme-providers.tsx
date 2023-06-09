import { ThemeProvider } from 'styled-components';
import { theme } from 'antd';
import React from 'react';

const ThemeProviders = ({ children }: React.PropsWithChildren) => {
  const { token } = theme.useToken();
  return <ThemeProvider theme={{ antd: token }}>{children}</ThemeProvider>;
};

export default ThemeProviders;
