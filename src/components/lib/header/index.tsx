import { LoginOutlined } from '@ant-design/icons';
import { Button, Layout, Row } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import cdepLogo from '~/assets/cdep-logo-centralizado.svg';
import { ROUTES } from '~/core/enum/routes';
import { useAppSelector } from '~/core/hooks/use-redux';
import { store } from '~/core/redux';
import { setDeslogar } from '~/core/redux/modules/auth/actions';
import { BoxShadow } from '~/core/styles/colors';
import ExitButton from '../exit-button';

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

type HeaderProps = {
  logo?: React.ReactNode;
  style?: React.CSSProperties;
};
const Header: React.FC<HeaderProps> = ({ logo, style = {} }) => {
  const autenticado = useAppSelector((state) => state.auth.autenticado);

  return (
    <Layout.Header style={{ ...contentStyle, ...style }}>
      <Link to={autenticado ? ROUTES.PRINCIPAL : ROUTES.LOGIN}>
        {logo || <img style={{ height: '75px' }} src={cdepLogo} alt='CDEP LOGO' />}
      </Link>
      <Row justify='end' style={{ width: '100%' }}>
        {autenticado && (
          <ExitButton
            onClick={() => {
              store.dispatch(setDeslogar());
            }}
          />
        )}

        {!autenticado && (
          <Link to={ROUTES.LOGIN}>
            <Button
              size='small'
              type='text'
              icon={<LoginOutlined size={18} />}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              Login
            </Button>
          </Link>
        )}
      </Row>
    </Layout.Header>
  );
};

export default Header;
