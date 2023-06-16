import { Spin as SpinAnt } from 'antd';
import React, { PropsWithChildren } from 'react';
import { useAppSelector } from '~/core/hooks/use-redux';

const Spin: React.FC<PropsWithChildren> = ({ children }) => {
  const spinning = useAppSelector((state) => state.spin.spinning);

  return <SpinAnt spinning={spinning}>{children}</SpinAnt>;
};

export default Spin;
