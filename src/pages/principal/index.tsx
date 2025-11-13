import { Layout } from 'antd';
import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '~/components/lib/footer';
import Header from '~/components/lib/header';
import SiderCDEP from '~/components/cdep/sider';
import BreadcrumbCDEP from '~/components/cdep/breadcrumb';

const { Content } = Layout;

const Principal: React.FC = () => (
  <Layout hasSider style={{ minHeight: '100vh' }}>
    <SiderCDEP />
    <Layout style={{ marginLeft: '88px' }}>
      <Header />
      <Content style={{ margin: '16px 32px' }}>
        <div style={{ marginBottom: '16px' }}>
          <BreadcrumbCDEP auto />
        </div>
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  </Layout>
);

export default Principal;
