import { Button, Col, Empty, Image, List, Row, Tag, Typography } from 'antd';

import { useWatch } from 'antd/es/form/Form';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { PaginationConfig } from 'antd/es/pagination';
import React, { useEffect, useState } from 'react';
import cdepLogo from '~/assets/cdep-logo-centralizado.svg';
import { FiltroTextoLivreTipoAcervoDTO } from '~/core/dto/filtro-texto-livre-tipo-acervo-dto';
import { PesquisaAcervoDTO } from '~/core/dto/pesquisa-acervo-dto';
import { TipoAcervo, TipoAcervoDisplay } from '~/core/enum/tipo-acervo';
import { TipoAcervoTag, TipoAcervoTagDisplay } from '~/core/enum/tipo-acervo-tag';
import { pesquisarAcervosAreaPublica } from '~/core/services/acervo-service';
import { Colors } from '~/core/styles/colors';
import TextItemCardContentConsultaAcervo from '../components/text-content-card';

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

  const [loading, setLoading] = useState<boolean>(false);

  const [filtro, setFiltro] = useState<FiltroTextoLivreTipoAcervoDTO>({
    textoLivre: '',
    anoFinal: '',
    anoInicial: '',
    tipoAcervo: undefined,
  });

  const [dataSource, setDataSource] = useState<PesquisaAcervoDTO[]>();

  const [listParams, setListParams] = useState<PaginationConfig>({
    current: 1,
    pageSize: 5,
    showSizeChanger: true,
    hideOnSinglePage: true,
    defaultCurrent: 1,
    position: 'bottom',
    align: 'center',
    locale: { items_per_page: '' },
    disabled: false,
    pageSizeOptions: [5, 10, 20, 50, 100],
  });

  const tipoAcervo = useWatch('tipoAcervo', form);
  const textoLivre = useWatch('textoLivre', form);
  const anoInicial = useWatch('anoInicial', form);
  const anoFinal = useWatch('anoFinal', form);

  const desabilitarCliqueDireitoImagem = (e: any) => {
    e.preventDefault();
  };

  const carregarDados = (listParams: PaginationConfig, params: FiltroTextoLivreTipoAcervoDTO) => {
    const numeroPagina = listParams?.current || 1;
    const numeroRegistros = listParams?.pageSize || 5;

    setLoading(true);
    pesquisarAcervosAreaPublica(numeroPagina, numeroRegistros, params)
      .then((response) => {
        if (response.sucesso) {
          setDataSource(response.dados.items);

          setListParams({
            ...listParams,
            total: response.dados.totalRegistros,
          });
        } else {
          setDataSource([]);
        }
      })
      .finally(() => setLoading(false));
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

  useEffect(() => {
    carregarDados({ ...listParams, current: 1 }, filtro);
  }, [filtro]);

  useEffect(() => {
    form.validateFields().then((values: FiltroTextoLivreTipoAcervoDTO) => {
      setFiltro({ ...values });
    });
  }, [tipoAcervo, textoLivre, anoInicial, anoFinal]);

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
                  />

                  <TextItemCardContentConsultaAcervo label='Título: ' description={item.titulo} />

                  <TextItemCardContentConsultaAcervo
                    label='Autoria/Crédito: '
                    description={item.creditoAutoria}
                  />

                  <TextItemCardContentConsultaAcervo
                    label='Assunto: '
                    description={item.assunto}
                    ellipsis
                  />

                  <TextItemCardContentConsultaAcervo
                    label='Descrição: '
                    description={item.descricao}
                    ellipsis
                  />

                  <TextItemCardContentConsultaAcervo label='Ano: ' description={item.ano} />

                  <TextItemCardContentConsultaAcervo label='Data: ' description={item.dataAcervo} />
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
                <Button type='link'>
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
