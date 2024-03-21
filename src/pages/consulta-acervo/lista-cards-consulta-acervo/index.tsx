import { Button, Col, Empty, Image, List, Row, Tag, Typography } from 'antd';

import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { DestacarTexto } from '~/components/cdep/destacar-texto';
import { FiltroTextoLivreTipoAcervoDTO } from '~/core/dto/filtro-texto-livre-tipo-acervo-dto';
import { PesquisaAcervoDTO } from '~/core/dto/pesquisa-acervo-dto';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import { ROUTES } from '~/core/enum/routes';
import { TipoAcervo, TipoAcervoDisplay } from '~/core/enum/tipo-acervo';
import { TipoAcervoTag, TipoAcervoTagDisplay } from '~/core/enum/tipo-acervo-tag';
import { Colors } from '~/core/styles/colors';
import { ButtonEnviarParaMinhaSelecao } from '../components/button-enviar-para-minha-selecao';
import CheckboxSelecionarAcervo from '../components/selecionar-acervo';
import { TextItemCardContentConsultaAcervo } from '../components/text-content-card';
import { ConsultaAcervoContext } from '../provider';

const ImageContainer = styled.div`
  .ant-image {
    text-align: center;
  }
`;

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

  const { dataSource, loading, listParams, carregarDados, textoLivrePesquisado } =
    useContext(ConsultaAcervoContext);

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
    <>
      {dataSource.length > 0 ? (
        <Row justify='end' style={{ padding: '20px 60px' }}>
          <Col>
            <ButtonEnviarParaMinhaSelecao />
          </Col>
        </Row>
      ) : (
        <></>
      )}

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
                <Col style={{ display: 'flex', alignItems: 'center' }}>
                  <ImageContainer>
                    <Image
                      alt='example'
                      preview={false}
                      style={{
                        minHeight: 200,
                        height: '100%',
                        width: item.enderecoImagem ? 200 : 100,
                      }}
                      width={200}
                      src={item.enderecoImagem || item.enderecoImagemPadrao}
                      onContextMenu={desabilitarCliqueDireitoImagem}
                    />
                  </ImageContainer>
                </Col>
                <Col style={{ right: 13, top: 13, position: 'absolute' }}>
                  <CheckboxSelecionarAcervo pesquisaAcervo={item} />
                </Col>

                <Col style={{ margin: '10px 15px 40px' }}>
                  <Row gutter={[6, 6]} style={{ display: 'grid' }} wrap>
                    <TextItemCardContentConsultaAcervo
                      label='Tipo de acervo: '
                      description={DestacarTexto({
                        palavraPraDestacar: tipoAcervoNome(item.tipo),
                        palavraComparacao: textoLivrePesquisado,
                      })}
                    />

                    <TextItemCardContentConsultaAcervo
                      label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Titulo].label}: `}
                      description={DestacarTexto({
                        palavraPraDestacar: item.titulo,
                        palavraComparacao: textoLivrePesquisado,
                      })}
                      item={item}
                    />

                    <TextItemCardContentConsultaAcervo
                      label='Autoria/Crédito: '
                      description={DestacarTexto({
                        palavraPraDestacar: item.creditoAutoria,
                        palavraComparacao: textoLivrePesquisado,
                      })}
                    />

                    <TextItemCardContentConsultaAcervo
                      label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Assunto].label}: `}
                      description={DestacarTexto({
                        palavraPraDestacar: item.assunto,
                        palavraComparacao: textoLivrePesquisado,
                      })}
                      ellipsis
                      exibirTooltip
                    />

                    <TextItemCardContentConsultaAcervo
                      label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Descricao].label}: `}
                      description={DestacarTexto({
                        palavraPraDestacar: item.descricao,
                        palavraComparacao: textoLivrePesquisado,
                      })}
                      ellipsis
                      exibirTooltip
                    />

                    <TextItemCardContentConsultaAcervo
                      label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Ano].label}: `}
                      description={item.ano}
                    />

                    <TextItemCardContentConsultaAcervo
                      label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.DataAcervo].label}: `}
                      description={item.dataAcervo}
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
                      color: Colors.Neutral.DARK,
                    }}
                  >
                    {DestacarTexto({
                      palavraPraDestacar: tagAcervo(item.tipo),
                      palavraComparacao: textoLivrePesquisado,
                    })}
                  </Tag>
                </Row>

                <Row justify='end' style={{ width: '100%', bottom: 6, position: 'absolute' }}>
                  <Button
                    type='link'
                    onClick={() => {
                      navigate(ROUTES.CONSULTA_ACERVO_DETALHES, {
                        state: item,
                      });
                    }}
                  >
                    <Typography.Text
                      strong
                      underline
                      style={{ color: Colors.SystemSME.CDEP.PRIMARY }}
                    >
                      Detalhes
                    </Typography.Text>
                  </Button>
                </Row>
              </Col>
            </Row>
          );
        }}
      />
    </>
  );
};
