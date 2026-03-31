class Minhas_Solicitacoes_CDEP_Localizadores {
	tbl_numero = () => { return '.ant-table-tbody > :nth-child(1) > :nth-child(1)' }
	tbl_tipo_de_item = () => { return '.ant-table-tbody > :nth-child(1) > :nth-child(2)' }
	tbl_titulo_do_item = () => { return '.ant-table-tbody > :nth-child(1) > :nth-child(3)' }
	tbl_dia_da_solicitacao = () => { return '.ant-table-tbody > :nth-child(1) > :nth-child(4)' }
	tbl_dia_de_visita = () => { return '.ant-table-tbody > :nth-child(1) > :nth-child(5)' }
	tbl_status = () => { return '.ant-table-tbody > :nth-child(1) > :nth-child(6)' }
	tbl_dados_solicitante = () => { return '.ant-card-head' }
	card_solicitacao = () => { return '.ant-table-tbody tr:not(.ant-table-placeholder)' } 
	tbl_tipo_acervo_solicitacao = () => { return '.ant-table-row > :nth-child(1)' }
    tbl_titulo_solicitacao = () => { return '.ant-table-row > :nth-child(2) > div' }
    tbl_autor_credito_solicitacao = () => { return '.ant-table-row > :nth-child(3)' }
    tbl_situacao_solicitacao = () => { return '.ant-table-row > :nth-child(4)' }
    tbl_tipo_atendimento_solicitacao = () => { return '.ant-table-row > :nth-child(5)' }
    tbl_data_visita_solicitacao = () => { return '.ant-table-row > :nth-child(6)' }

}

export default Minhas_Solicitacoes_CDEP_Localizadores