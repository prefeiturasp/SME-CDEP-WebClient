import { ThemeConfig } from 'antd';
import { Colors } from '../styles/colors';

export const CDEPTheme: ThemeConfig = {
  token: {
    fontFamily: 'Roboto',
    colorText: Colors.TEXT,
    colorPrimary: Colors.BLUE_CDEP,
    borderRadius: 4,
    controlHeight: 38,
    colorError: Colors.ERROR,
  },
};
