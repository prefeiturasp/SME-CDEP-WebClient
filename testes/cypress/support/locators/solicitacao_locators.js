class Solicitacao_CDEP_Localizadores {
	btn_nova_solicitacao = () => { return '#CDEP_BUTTON_NOVA_SOLICITACAO' }
	btn_adicionar_acervos = () => { return '#CDEP_BUTTON_ADICIONAR_ACERVOS' }
	btn_buscar_acervos = () => { return 'div:nth-child(2) > button > span' }
	check_acervos = () => { return 'label .ant-checkbox' }
	btn_enviar_selecao = () => { return 'span:contains("Enviar para a minha seleção")' }
	btn_remove_acervo_solicitacao = () => { return '#CDEP_BUTTON_REMOVER_ACERVO_0' }
	btn_enviar_acervo_solicitacao = () => { return '#CDEP_BUTTON_NOVO' }
	check_termo_solicitacao = () => { return '.ant-checkbox' }
	btn_prosseguir_acervo_solicitacao = () => { return '.ant-modal-footer > .ant-btn-default' }
	btn_fechar_acervo_solicitacao = () => { return '.ant-modal-close-x' }
	btn_cancelar_acervo_solicitacao = () => { return '.ant-modal-footer > .ant-btn-text > span' }
	msg_enviar_acervo_solicitacao = () => { return '.ant-notification-notice-description' }
	btn_remover_item_acervo_solicitacao = () => { return '#CDEP_BUTTON_REMOVER_ACERVO_0' }
	btn_retornar_acervo_solicitacao = () => { return '#CDEP_BUTTON_VOLTAR > span > svg' }
	mdl_termo_compromisso_pesquisador = () => { return '.ant-modal-header' }
	campo_busca_texto = () => { return '#CDEP_INPUT_BUSCA_TEXTO_LIVRE' }
	campo_busca_tipos_acervos = () => { return '#CDEP_SELECT_TIPO_ACERVO' }	
	btn_buscar = () => { return ':nth-child(2) > .ant-btn > span' }
	btn_campo_limpar_busca = () => { return '.ant-row > :nth-child(1) > .ant-btn > span' }
}

export default Solicitacao_CDEP_Localizadores