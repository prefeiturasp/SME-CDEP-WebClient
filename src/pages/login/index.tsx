import { Alert, Button, Col, Row } from 'antd';
import { useState } from 'react';

import cdepLogo from '~/assets/cdep-logo-titulo.svg';

const Login = () => {
  const [count, setCount] = useState<number>(0);

  const urlBase = import.meta.env?.VITE_SME_CDEP_API
    ? `.env VITE_SME_CDEP_API=${import.meta.env?.VITE_SME_CDEP_API}`
    : '.env VITE_SME_CDEP_API=não configurada';

  return (
    <Row gutter={[0, 80]}>
      <Col span={24}>
        <Row justify='center'>
          <img
            style={{ widows: '200px', height: '200px' }}
            src={cdepLogo}
            className='cdep logo'
            alt='CDEP LOGO'
          />
        </Row>
      </Col>
      <Col span={24}>
        <Row justify='center'>
          <Button type='primary' onClick={() => setCount((count: number) => count + 1)}>
            count is {count}
          </Button>
        </Row>
      </Col>
      <Col span={24}>
        <Row justify='center'>
          <Alert message={urlBase} type='info' />
        </Row>
      </Col>
    </Row>
  );
};

export default Login;
