import { Layout, Row } from 'antd';
import React from 'react';
import cdepLogo from '~/assets/cdep-logo.svg';
import ExitButton from '../exit-button';
import { store } from '~/core/redux';
import { setDeslogar } from '~/core/redux/modules/auth/actions';

const contentStyle: React.CSSProperties = {
  position: 'sticky',
  top: 0,
  zIndex: 1,
  width: '100%',
  height: '72px',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
};

const Header: React.FC = () => {
  return (
    <Layout.Header style={contentStyle}>
      <img style={{ height: '50px' }} src={cdepLogo} className='cdep logo' alt='CDEP LOGO' />
      <Row justify='end' style={{ width: '100%' }}>
        <ExitButton
          onClick={() => {
            store.dispatch(setDeslogar());
          }}
        />
      </Row>
    </Layout.Header>
  );
};

export default Header;
