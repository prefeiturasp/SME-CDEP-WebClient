import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_VOLUME } from '~/core/constants/ids/input';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.Volume];

type InputVolumeProps = {
  extra?: React.ReactNode;
};
const InputVolume: React.FC<InputVolumeProps> = ({ extra }) => (
  <Form.Item label={fieldProps.label} name={fieldProps.name} extra={extra}>
    <Input type='text' placeholder={fieldProps.label} maxLength={15} id={CDEP_INPUT_VOLUME} />
  </Form.Item>
);

export default InputVolume;
