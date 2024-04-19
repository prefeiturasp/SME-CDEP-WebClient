import { ThemeConfig } from 'antd';
import { Colors } from '../styles/colors';

export type ThemeConfigCustomColors = {
  colors: {
    colorPrimaryDark: string;
  };
};

export type ThemeConfigSME = ThemeConfigCustomColors & ThemeConfig;

export const CDEPTheme: ThemeConfigSME = {
  colors: {
    colorPrimaryDark: Colors.SystemSME.CDEP.PRIMARY_DARK,
  },
  token: {
    fontFamily: 'Roboto',
    colorText: Colors.Neutral.DARK,
    colorPrimary: Colors.SystemSME.CDEP.PRIMARY,
    borderRadius: 4,
    controlHeight: 38,
    colorError: Colors.Suporte.Primary.ERROR,
    colorTextLabel: Colors.Neutral.WHITE,
  },
  components: {
    Button: {
      colorText: Colors.SystemSME.CDEP.PRIMARY,
      colorBorder: Colors.SystemSME.CDEP.PRIMARY,
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
    Select: {
      zIndexPopup: 1,
    },
    Alert: {
      fontSize: 16,
      colorText: Colors.Neutral.WHITE,
      colorTextHeading: Colors.Neutral.WHITE,
      colorIcon: Colors.Neutral.WHITE,
      colorSuccess: Colors.Suporte.Secondary.SUCCESS,
      colorSuccessBg: Colors.Components.BACKGROUND_ALERT,
      colorError: Colors.Suporte.Secondary.ERROR,
      colorErrorBg: Colors.Components.BACKGROUND_ALERT,
      colorWarning: Colors.Suporte.Secondary.WARNING,
      colorWarningBg: Colors.Components.BACKGROUND_ALERT,
      colorInfo: Colors.Suporte.Secondary.INFO,
      colorInfoBg: Colors.Components.BACKGROUND_ALERT,
    },
    Notification: {
      fontSize: 16,
      colorText: Colors.Neutral.WHITE,
      colorTextHeading: Colors.Neutral.WHITE,
      colorIcon: Colors.Neutral.WHITE,
      colorSuccess: Colors.Suporte.Secondary.SUCCESS,
      colorError: Colors.Suporte.Secondary.ERROR,
      colorWarning: Colors.Suporte.Secondary.WARNING,
      colorInfo: Colors.Suporte.Secondary.INFO,
      colorBgElevated: Colors.Components.BACKGROUND_ALERT,
    },
  },
};
