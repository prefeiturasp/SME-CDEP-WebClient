import { Form } from 'antd';
import React from 'react';
import { CDEP_INPUT_TIPO_AUTORIA } from '~/core/constants/ids/input';

import InputTipoAutoria from './input-tipo-autoria';

const InputTipoAutoriaLista: React.FC = () => {
  return (
    <Form.List name='listaTipoAutoria'>
      {(fields) => (
        <>
          {fields.map(({ key, name, ...restField }) => {
            return (
              <Form.Item shouldUpdate key={key} style={{ margin: 0 }}>
                {(form) => {
                  const coAutores = form.getFieldValue('coAutores');

                  const label = coAutores[name].label;

                  return (
                    <InputTipoAutoria
                      inputProps={{
                        id: `${CDEP_INPUT_TIPO_AUTORIA}_${name}`,
                        placeholder: 'Tipo de autoria',
                      }}
                      formItemProps={{
                        ...restField,
                        name: [name, 'tipoAutoria'],
                        label: `Tipo de autoria - ${label}`,
                        required: false,
                      }}
                    />
                  );
                }}
              </Form.Item>
            );
          })}
        </>
      )}
    </Form.List>
  );
};

export default InputTipoAutoriaLista;
