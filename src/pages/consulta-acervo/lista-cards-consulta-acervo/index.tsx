import { Button, Col, Empty, Image, List, Row, Tag, Typography } from 'antd';

import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import cdepLogo from '~/assets/cdep-logo-centralizado.svg';
import { FiltroTextoLivreTipoAcervoDTO } from '~/core/dto/filtro-texto-livre-tipo-acervo-dto';
import { PesquisaAcervoDTO } from '~/core/dto/pesquisa-acervo-dto';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import { ROUTES } from '~/core/enum/routes';
import { TipoAcervo, TipoAcervoDisplay } from '~/core/enum/tipo-acervo';
import { TipoAcervoTag, TipoAcervoTagDisplay } from '~/core/enum/tipo-acervo-tag';
import { Colors } from '~/core/styles/colors';
import TextItemCardContentConsultaAcervo from '../components/text-content-card';
import { ConsultaAcervoContext } from '../provider';

const tagAcervo = (tipo: TipoAcervo) => {
  switch (tipo) {
    case TipoAcervo.Bibliografico:
      return TipoAcervoTagDisplay[TipoAcervoTag.Biblioteca];
    case TipoAcervo.DocumentacaoHistorica:
      return TipoAcervoTagDisplay[TipoAcervoTag.MemoriaDocumental];
    case TipoAcervo.ArtesGraficas:
    case TipoAcervo.Audiovisual:
    case TipoAcervo.Fotografico:
    case TipoAcervo.Tridimensional:
      return TipoAcervoTagDisplay[TipoAcervoTag.MemoriaEducacaoMunicipal];
  }
};

const tipoAcervoNome = (tipo: TipoAcervo) => {
  switch (tipo) {
    case TipoAcervo.Bibliografico:
      return TipoAcervoDisplay[TipoAcervo.Bibliografico];
    case TipoAcervo.DocumentacaoHistorica:
      return TipoAcervoDisplay[TipoAcervo.DocumentacaoHistorica];
    case TipoAcervo.ArtesGraficas:
      return TipoAcervoDisplay[TipoAcervo.ArtesGraficas];
    case TipoAcervo.Audiovisual:
      return TipoAcervoDisplay[TipoAcervo.Audiovisual];
    case TipoAcervo.Fotografico:
      return TipoAcervoDisplay[TipoAcervo.Fotografico];
    case TipoAcervo.Tridimensional:
      return TipoAcervoDisplay[TipoAcervo.Tridimensional];
  }
};

export const ListaCardsConsultaAcervo: React.FC = () => {
  const form = useFormInstance();
  const navigate = useNavigate();

  const { dataSource, loading, listParams, carregarDados } = useContext(ConsultaAcervoContext);

  const desabilitarCliqueDireitoImagem = (e: any) => {
    e.preventDefault();
  };

  const onListChange = (current: number, pageSize: number) => {
    const newListParams = {
      ...listParams,
      current,
      pageSize,
    };

    const params: FiltroTextoLivreTipoAcervoDTO = form.getFieldsValue();

    carregarDados(newListParams, params);
  };

  return (
    <List
      pagination={{ ...listParams, onChange: onListChange }}
      dataSource={dataSource}
      loading={loading}
      locale={{
        emptyText: (
          <Empty
            description='Sem dados'
            className='ant-empty-small'
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ),
      }}
      style={{ padding: '25px 60px' }}
      renderItem={(item: PesquisaAcervoDTO, index) => {
        return (
          <Row
            key={index}
            style={{
              display: 'flex',
              borderRadius: 4,
              border: `1px solid #ccc`,
              justifyContent: 'space-between',
              marginBottom: '24px',
            }}
          >
            <Col style={{ display: 'flex', alignContent: 'center', width: '100%' }}>
              <Col>
                <Image
                  alt='example'
                  preview={false}
                  style={{
                    minHeight: 200,
                    height: '100%',
                    width: 200,
                  }}
                  src={item.enderecoImagem || cdepLogo}
                  onContextMenu={desabilitarCliqueDireitoImagem}
                />
              </Col>

              <Col style={{ margin: '10px 15px 40px' }}>
                <Row gutter={[6, 6]} style={{ display: 'grid' }} wrap>
                  <TextItemCardContentConsultaAcervo
                    label='Tipo de acervo: '
                    description={tipoAcervoNome(item.tipo)}
                    exibirLabelSemValor={false}
                  />

                  <TextItemCardContentConsultaAcervo
                    label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Titulo].label}: `}
                    description={item.titulo}
                    exibirLabelSemValor={false}
                  />

                  <TextItemCardContentConsultaAcervo
                    label='Autoria/Crédito: '
                    description={item.creditoAutoria}
                    exibirLabelSemValor={false}
                  />

                  <TextItemCardContentConsultaAcervo
                    label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Assunto].label}: `}
                    description={item.assunto}
                    exibirLabelSemValor={false}
                    ellipsis
                  />

                  <TextItemCardContentConsultaAcervo
                    label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Descricao].label}: `}
                    description={item.descricao}
                    exibirLabelSemValor={false}
                    ellipsis
                  />

                  <TextItemCardContentConsultaAcervo
                    label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Ano].label}: `}
                    description={item.ano}
                    exibirLabelSemValor={false}
                  />

                  <TextItemCardContentConsultaAcervo
                    label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.DataAcervo].label}: `}
                    description={item.dataAcervo}
                    exibirLabelSemValor={false}
                  />
                </Row>
              </Col>

              <Row
                justify='start'
                style={{ width: '100%', bottom: 6, left: 6, position: 'absolute' }}
              >
                <Tag
                  color={`${Colors.BACKGROUND_CONTENT}`}
                  style={{
                    borderRadius: 10,
                    color: Colors.TEXT,
                  }}
                >
                  {tagAcervo(item.tipo)}
                </Tag>
              </Row>

              <Row justify='end' style={{ width: '100%', bottom: 6, position: 'absolute' }}>
                <Button
                  type='link'
                  onClick={() => {
                    navigate(ROUTES.CONSULTA_ACERVO_DETALHES, {
                      state: {
                        tipo: item.tipo,
                        codigo: item.codigo,
                      },
                    });
                  }}
                >
                  <Typography.Text strong underline style={{ color: Colors.CDEP_PRIMARY }}>
                    Detalhes
                  </Typography.Text>
                </Button>
              </Row>
            </Col>
          </Row>
        );
      }}
    />
  );
};
