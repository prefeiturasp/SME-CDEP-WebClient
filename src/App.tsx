import { ConfigProvider } from 'antd';
import { CDEPTheme } from './core/config/theme';
import ThemeProviders from './core/providers/theme-providers';
import { Provider } from 'react-redux';
import { persistor, store } from './core/redux';
import { PersistGate } from 'redux-persist/integration/react';
import Routes from './routes';
import 'antd/dist/reset.css';
import 'dayjs/locale/pt-br';

import GlobalStyle from '~/core/styles/global';
import Spin from './components/cdep/spin';
import dayjs from 'dayjs';

dayjs.locale('pt-br');

declare global {
  interface Window {
    clarity: (identify: string, value: any) => void;
  }
}

const App = () => {
  return (
    <ConfigProvider theme={CDEPTheme}>
      <ThemeProviders>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <GlobalStyle />
            <Spin>
              <Routes />
            </Spin>
          </PersistGate>
        </Provider>
      </ThemeProviders>
    </ConfigProvider>
  );
};

export default App;
