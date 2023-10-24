import { Button, Col, Image, List, Row, Space, Tag, Typography } from 'antd';
import cdepLogo from '~/assets/cdep-logo-centralizado.svg';
import { Colors } from '~/core/styles/colors';

export const ListaCardsConsultaAcervo = () => {
  const dadosFiltro = [
    {
      tipoAcervo: 'teste',
      imagem: cdepLogo,
      titulos: [
        { titulo: 'Tipo de acervo' },
        { titulo: 'Título' },
        { titulo: 'Autoria/Crédito' },
        { titulo: 'Assunto' },
        { titulo: 'Descrição' },
        { titulo: 'Data' },
      ],
    },
    {
      tipoAcervo: 'teste',
      imagem:
        'https://img.freepik.com/fotos-gratis/ilustracao-3d-de-caneta-colocando-carrapatos-azuis-no-papel_107791-15675.jpg?size=626&ext=jpg&ga=GA1.2.1620652628.1695409578&semt=sph',
      titulos: [
        { titulo: 'Tipo de acervo' },
        { titulo: 'Título' },
        { titulo: 'Autoria/Crédito' },
        { titulo: 'Assunto' },
        { titulo: 'Descrição' },
        { titulo: 'Data' },
      ],
    },
    {
      tipoAcervo: 'teste',
      imagem: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
      titulos: [
        { titulo: 'Tipo de acervo' },
        { titulo: 'Título' },
        { titulo: 'Autoria/Crédito' },
        { titulo: 'Assunto' },
        { titulo: 'Descrição' },
        { titulo: 'Data' },
      ],
    },
    {
      tipoAcervo: 'teste',
      imagem:
        'https://img.freepik.com/fotos-gratis/close-up-da-pessoa-que-preencher-questionario-formulario_1262-2259.jpg?size=626&ext=jpg&ga=GA1.2.1620652628.1695409578&semt=sph',
      titulos: [
        { titulo: 'Tipo de acervo' },
        { titulo: 'Título' },
        { titulo: 'Autoria/Crédito' },
        { titulo: 'Assunto' },
        { titulo: 'Descrição' },
        { titulo: 'Data' },
      ],
    },
    {
      tipoAcervo: 'teste',
      imagem: cdepLogo,
      titulos: [
        { titulo: 'Tipo de acervo' },
        { titulo: 'Título' },
        { titulo: 'Autoria/Crédito' },
        { titulo: 'Assunto' },
        { titulo: 'Descrição' },
        { titulo: 'Data' },
      ],
    },
    {
      tipoAcervo: 'teste',
      imagem: cdepLogo,
      titulos: [
        { titulo: 'Tipo de acervo' },
        { titulo: 'Título' },
        { titulo: 'Autoria/Crédito' },
        { titulo: 'Assunto' },
        { titulo: 'Descrição' },
        { titulo: 'Data' },
      ],
    },
    {
      tipoAcervo: 'teste',
      imagem: cdepLogo,
      titulos: [
        { titulo: 'Tipo de acervo' },
        { titulo: 'Título' },
        { titulo: 'Autoria/Crédito' },
        { titulo: 'Assunto' },
        { titulo: 'Descrição' },
        { titulo: 'Data' },
      ],
    },
  ];

  return (
    <List
      style={{ paddingBottom: 16 }}
      pagination={{
        pageSize: 5,
        align: 'center',
        total: dadosFiltro.length,
      }}
      dataSource={dadosFiltro}
      renderItem={(item, index) => (
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
                src={item.imagem}
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
                {item.tipoAcervo}
              </Tag>
              <Space direction='vertical' size={5}>
                {item.titulos.map((titulo, index) => (
                  <Typography key={index} style={{ fontWeight: 'bold', marginLeft: 16 }}>
                    {titulo.titulo}: <span style={{ fontWeight: 'normal' }}>teste</span>
                  </Typography>
                ))}
              </Space>
            </Col>
            <Col style={{ display: 'flex', alignItems: 'end' }}>
              <Button type='link'>Detalhes</Button>
            </Col>
          </Row>
        </List>
      )}
    />
  );
};
