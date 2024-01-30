import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from 'styled-components';
import { CDEPTheme } from './core/config/theme';
import { persistor, store } from './core/redux';
import Routes from './routes';
import NotificationStorage from './components/lib/notification/index';

import { App as AppAntd } from 'antd';

import 'antd/dist/reset.css';

import GlobalStyle from '~/core/styles/global';
import Spin from './components/cdep/spin';

declare global {
  interface Window {
    clarity: (identify: string, value: any) => void;
  }
}

const App = () => {
  return (
    <ConfigProvider theme={CDEPTheme}>
      <ThemeProvider theme={CDEPTheme}>
        <AppAntd>
          <NotificationStorage />
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <GlobalStyle />
              <Spin>
                <Routes />
              </Spin>
            </PersistGate>
          </Provider>
        </AppAntd>
      </ThemeProvider>
    </ConfigProvider>
  );
};

export default App;
