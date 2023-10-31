import { Button, Col, Empty, Image, List, Row, Space, Tag } from 'antd';
import React from 'react';
import cdepLogo from '~/assets/cdep-logo-centralizado.svg';
import InfoAssuntoConsultaAcervo from '~/components/cdep/text/consulta-acervo/assunto-consulta-acervo';
import InfoCreditoAutorConsultaAcervo from '~/components/cdep/text/consulta-acervo/credito-autor-consulta-acervo';
import InfoDataConsultaAcervo from '~/components/cdep/text/consulta-acervo/data-consulta-acervo';
import InfoDescricaoConsultaAcervo from '~/components/cdep/text/consulta-acervo/descricao-consulta-acervo';
import InfoTipoAcervoConsultaAcervo from '~/components/cdep/text/consulta-acervo/tipo-de-acervo-consulta-acervo';
import InfoTituloConsultaAcervo from '~/components/cdep/text/consulta-acervo/titulo-consulta-acervo';
import { PesquisaAcervoDTO } from '~/core/dto/pesquisa-acervo-dto';
import { TipoAcervo, TipoAcervoDisplay } from '~/core/enum/tipo-acervo';
import { TipoAcervoTag, TipoAcervoTagDisplay } from '~/core/enum/tipo-acervo-tag';
import { Colors } from '~/core/styles/colors';

type ListaCardsConsultaAcervoProps = {
  dadosGerais: PesquisaAcervoDTO[];
};

export const ListaCardsConsultaAcervo: React.FC<ListaCardsConsultaAcervoProps> = ({
  dadosGerais,
}) => {
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

  const desabilitarCliqueDireitoImagem = (e: any) => {
    e.preventDefault();
  };

  return (
    <List
      style={{ paddingBottom: 16 }}
      dataSource={dadosGerais}
      locale={{
        emptyText: (
          <Empty
            description='Sem dados'
            className='ant-empty-small'
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ),
      }}
      renderItem={(item: PesquisaAcervoDTO, index) => {
        return (
          <List style={{ margin: 16 }}>
            <Row
              key={index}
              style={{
                display: 'flex',
                borderRadius: 4,
                border: `1px solid #ccc`,
                justifyContent: 'space-between',
              }}
            >
              <Col style={{ display: 'flex', alignContent: 'center' }}>
                <Image
                  alt='example'
                  preview={false}
                  style={{
                    minWidth: 200,
                    minHeight: 200,
                    maxWidth: 200,
                    maxHeight: 200,
                    height: '100%',
                  }}
                  src={item.enderecoImagem || cdepLogo}
                  onContextMenu={desabilitarCliqueDireitoImagem}
                />
                <Tag
                  color={`${Colors.BACKGROUND_CONTENT}`}
                  style={{
                    left: 6,
                    bottom: 6,
                    borderRadius: 10,
                    position: 'absolute',
                    color: `${Colors.TEXT}`,
                  }}
                >
                  {tagAcervo(item.tipo)}
                </Tag>
                <Space direction='vertical' size={5} style={{ marginTop: 4 }}>
                  {item.tipo && <InfoTipoAcervoConsultaAcervo valor={tipoAcervoNome(item.tipo)} />}
                  {item.titulo && <InfoTituloConsultaAcervo valor={item.titulo} />}
                  {item.creditoAutoria && (
                    <InfoCreditoAutorConsultaAcervo valor={item.creditoAutoria} />
                  )}
                  {item.assunto && <InfoAssuntoConsultaAcervo valor={item.assunto} />}
                  {item.descricao && <InfoDescricaoConsultaAcervo valor={item.descricao} />}
                  {item.data && <InfoDataConsultaAcervo valor={item.data} />}
                </Space>
              </Col>
              <Col style={{ display: 'flex', alignItems: 'end' }}>
                <Button type='link'>Detalhes</Button>
              </Col>
            </Row>
          </List>
        );
      }}
    />
  );
};
