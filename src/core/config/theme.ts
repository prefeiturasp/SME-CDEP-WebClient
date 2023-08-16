import { ThemeConfig } from 'antd';
import { Colors } from '../styles/colors';

export const CDEPTheme: ThemeConfig = {
  token: {
    fontFamily: 'Roboto',
    colorText: Colors.TEXT,
    colorPrimary: Colors.CDEP_PRIMARY,
    borderRadius: 4,
    controlHeight: 38,
    colorError: Colors.ERROR,
  },
  components: {
    Button: {
      colorText: Colors.CDEP_PRIMARY,
      colorBorder: Colors.CDEP_PRIMARY,
    },
    Layout: {
      colorBgLayout: Colors.BACKGROUND_CONTENT,
    },
    Form: {
      paddingXS: 2,
    },
    Modal: {
      borderRadiusLG: 4,
    },
  },
};
