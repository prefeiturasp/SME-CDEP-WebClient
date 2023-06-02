import { ConfigProvider } from 'antd';
import { CDEPTheme } from './core/config/theme';
import ThemeProviders from './core/providers/theme-providers';
import { Provider } from 'react-redux';
import { persistor, store } from './core/redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes';
import 'antd/dist/reset.css';

const App = () => {
  return (
    <ConfigProvider theme={CDEPTheme}>
      <ThemeProviders>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
              <Routes />
            </BrowserRouter>
          </PersistGate>
        </Provider>
      </ThemeProviders>
    </ConfigProvider>
  );
};

export default App;
