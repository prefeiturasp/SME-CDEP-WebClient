import { Layout, Row } from 'antd';
import React from 'react';
import cdepLogo from '~/assets/cdep-logo-centralizado.svg';
import ExitButton from '../exit-button';
import { store } from '~/core/redux';
import { setDeslogar } from '~/core/redux/modules/auth/actions';
import { BoxShadow } from '~/core/styles/colors';
import { Link } from 'react-router-dom';

const contentStyle: React.CSSProperties = {
  position: 'sticky',
  top: 0,
  zIndex: 11,
  width: '100%',
  height: '72px',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
  boxShadow: BoxShadow.DEFAULT,
};

const Header: React.FC = () => {
  return (
    <Layout.Header style={contentStyle}>
      <Link to='/'>
        <img style={{ height: '75px' }} src={cdepLogo} alt='CDEP LOGO' />
      </Link>
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
