import { Button, Col, Image, List, Row, Space, Tag } from 'antd';
import React from 'react';
import InfoAssuntoConsultaAcervo from '~/components/cdep/text/consulta-acervo/assunto-consulta-acervo';
import InfoCreditoAutorConsultaAcervo from '~/components/cdep/text/consulta-acervo/credito-autor-consulta-acervo';
import InfoDataConsultaAcervo from '~/components/cdep/text/consulta-acervo/data-consulta-acervo';
import InfoDescricaoConsultaAcervo from '~/components/cdep/text/consulta-acervo/descricao-consulta-acervo';
import InfoTipoAcervoConsultaAcervo from '~/components/cdep/text/consulta-acervo/tipo-de-acervo-consulta-acervo';
import InfoTituloConsultaAcervo from '~/components/cdep/text/consulta-acervo/titulo-consulta-acervo';
import { PesquisaAcervoDTO } from '~/core/dto/pesquisa-acervo-dto';
import { TipoAcervo, TipoAcervoDisplay } from '~/core/enum/tipo-acervo';
import { TipoAcervoTagDisplay } from '~/core/enum/tipo-acervo-tag';
import { Colors } from '~/core/styles/colors';

type ListaCardsConsultaAcervoProps = {
  dadosGerais: any;
};

export const ListaCardsConsultaAcervo: React.FC<ListaCardsConsultaAcervoProps> = ({
  dadosGerais,
}) => {
  const tagAcervo = (tipo: TipoAcervo) => {
    switch (tipo) {
      case TipoAcervo.Bibliografico:
        return TipoAcervoTagDisplay[1];
      case TipoAcervo.DocumentacaoHistorica:
        return TipoAcervoTagDisplay[2];
      case TipoAcervo.ArtesGraficas:
      case TipoAcervo.Audiovisual:
      case TipoAcervo.Fotografico:
      case TipoAcervo.Tridimensional:
        return TipoAcervoTagDisplay[3];
    }
  };

  const tipoAcervoNome = (tipo: TipoAcervo) => {
    switch (tipo) {
      case TipoAcervo.Bibliografico:
        return TipoAcervoDisplay[1];
      case TipoAcervo.DocumentacaoHistorica:
        return TipoAcervoDisplay[2];
      case TipoAcervo.ArtesGraficas:
        return TipoAcervoDisplay[3];
      case TipoAcervo.Audiovisual:
        return TipoAcervoDisplay[4];
      case TipoAcervo.Fotografico:
        return TipoAcervoDisplay[5];
      case TipoAcervo.Tridimensional:
        return TipoAcervoDisplay[6];
    }
  };

  return (
    <List
      style={{ paddingBottom: 16 }}
      pagination={{
        pageSize: 5,
        align: 'center',
        total: dadosGerais.length,
      }}
      dataSource={dadosGerais}
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
                  src={item.enderecoImagem}
                  style={{ maxWidth: 200, maxHeight: 200, height: '100%' }}
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
                  {tagAcervo(item.tipoAcervoId)}
                </Tag>
                <Space direction='vertical' size={5}>
                  <InfoTipoAcervoConsultaAcervo valor={tipoAcervoNome(item.tipoAcervoId)} />
                  <InfoTituloConsultaAcervo valor={item.titulo} />
                  <InfoCreditoAutorConsultaAcervo valor={item.creditoAutoria} />
                  <InfoAssuntoConsultaAcervo valor={item.assunto} />
                  <InfoDescricaoConsultaAcervo valor={item.descricao} />
                  <InfoDataConsultaAcervo valor={item.data} />
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
