import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_VOLUME } from '~/core/constants/ids/input';
import { AcervoFieldName, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';

type InputVolumeProps = {
  extra?: React.ReactNode;
};
const InputVolume: React.FC<InputVolumeProps> = ({ extra }) => {
  return (
    <Form.Item label='Volume' name={AcervoFieldName[FieldAcervoEnum.Volume]} extra={extra}>
      <Input type='text' placeholder='Volume' maxLength={15} id={CDEP_INPUT_VOLUME} />
    </Form.Item>
  );
};

export default InputVolume;
