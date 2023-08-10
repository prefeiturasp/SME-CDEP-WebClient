import { Button, Layout } from 'antd';
import React, { useState } from 'react';

import styled from 'styled-components';
import { BoxShadow, Colors } from '~/core/styles/colors';

import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '~/core/enum/routes';
import { FaUser, FaUserPlus } from 'react-icons/fa';

const SiderContainer = styled(Layout.Sider)`
  box-shadow: ${BoxShadow.DEFAULT};
`;

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4px;
`;

const MenuGroup = styled.div`
  background-color: ${Colors.CDEP_PRIMARY};
  width: 100%;
  height: 60px;
  margin: 4px;
  border-radius: 4px;
  justify-content: space-evenly;
  display: flex;
  align-items: center;
  flex-direction: column;
  cursor: pointer;

  div {
    font-size: 10px;
    font-weight: 700;
  }
`;

const Sider: React.FC = () => {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(true);

  return (
    <SiderContainer
      width={collapsed ? 88 : 264}
      style={{
        textAlign: 'center',
        color: '#fff',
        backgroundColor: Colors.CDEP_DARK_PRIMARY,
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 12,
      }}
      trigger={null}
      collapsible
    >
      <Button
        type='text'
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: '24px',
          width: '100%',
          height: '72px',
          backgroundColor: Colors.CDEP_PRIMARY,
          color: 'white',
          borderRadius: 0,
        }}
      />
      <MenuContainer>
        {/* TODO - O MENU VAI SER CRIADO EM OUTRO MOMENTO! */}
        <MenuGroup onClick={() => navigate(ROUTES.MEUS_DADOS)}>
          <FaUser size={24} />
          <div>Meus dados</div>
        </MenuGroup>
        <MenuGroup onClick={() => navigate(ROUTES.CREDITO)}>
          <FaUserPlus size={24} />
          <div>Crédito</div>
        </MenuGroup>
        <MenuGroup onClick={() => navigate(ROUTES.AUTOR)}>
          <FaUserPlus size={24} />
          <div>Autor</div>
        </MenuGroup>
        <MenuGroup onClick={() => navigate(ROUTES.EDITORA)}>
          <FaUserPlus size={24} />
          <div>Editora</div>
        </MenuGroup>
        <MenuGroup onClick={() => navigate(ROUTES.ASSUNTO)}>
          <FaUserPlus size={24} />
          <div>Assunto</div>
        </MenuGroup>
        <MenuGroup onClick={() => navigate(ROUTES.SERIE_COLECAO)}>
          <FaUserPlus size={24} />
          <div>Série/Coleção</div>
        </MenuGroup>
      </MenuContainer>
    </SiderContainer>
  );
};

export default Sider;
