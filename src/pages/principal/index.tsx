import { Layout } from 'antd';
import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '~/components/lib/footer';
import Header from '~/components/lib/header';
import Sider from '~/components/lib/sider';

const { Content } = Layout;

const Principal: React.FC = () => (
  <Layout hasSider>
    <Sider />
    <Layout style={{ marginLeft: '72px' }}>
      <Header />
      <Layout style={{ padding: '0px 32px 0px 32px' }}>
        <Layout style={{ height: 'calc(100vh - 72px)' }}>
          <Content>
            <Outlet />
          </Content>
          <Footer />
        </Layout>
      </Layout>
    </Layout>
  </Layout>
);

export default Principal;
