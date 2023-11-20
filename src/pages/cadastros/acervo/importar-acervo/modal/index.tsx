import { Col, Row, Tooltip } from 'antd';
import React, { useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { CDEP_BUTTON_EDITAR, CDEP_BUTTON_EXCLUIR } from '~/core/constants/ids/button/intex';
import { AcervoLinhaErroDTO } from '~/core/dto/acervo-linha-erro-dto';
import FormAcervo from '../../form';

type ModalImportacaoAcervoProps = {
  acervoLinhaErro: AcervoLinhaErroDTO;
  obterDados: () => void;
  atualizarLinhaParaSucesso: () => void;
  removerLinhaDoArquivo: () => void;
};
const ModalImportacaoAcervo: React.FC<ModalImportacaoAcervoProps> = ({
  acervoLinhaErro,
  removerLinhaDoArquivo,
  atualizarLinhaParaSucesso,
}) => {
  const [open, setOpen] = useState(false);

  const modalFormInitialValues = acervoLinhaErro?.retornoObjeto;
  const errosAcervoLinhaRetorno = acervoLinhaErro?.retornoErro;

  return (
    <>
      <Row gutter={[8, 8]} justify='center'>
        <Col xs={12}>
          <Tooltip title='Ajustar linha'>
            <FaEdit
              cursor='pointer'
              fontSize={16}
              id={CDEP_BUTTON_EDITAR}
              onClick={() => {
                setOpen(true);
              }}
            />
          </Tooltip>
        </Col>
        <Col xs={12}>
          <Tooltip title='Excluir linha'>
            <FaTrashAlt
              cursor='pointer'
              fontSize={16}
              id={CDEP_BUTTON_EXCLUIR}
              onClick={() => {
                removerLinhaDoArquivo();
              }}
            />
          </Tooltip>
        </Col>
      </Row>
      {open ? (
        <FormAcervo
          errosAcervoLinhaRetorno={errosAcervoLinhaRetorno}
          modalFormInitialValues={modalFormInitialValues}
          setOpenFormModal={({ open, updateData }) => {
            setOpen(open);
            if (updateData) {
              atualizarLinhaParaSucesso();
            }
          }}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default ModalImportacaoAcervo;
