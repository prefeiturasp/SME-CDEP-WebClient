class Relatorios_Localizadores {

  menu_relatorios = () => '.ant-menu-submenu-title'
  submenu_relatorios = () => '.ant-menu-title-content'
  select_tipo_sintetico = () => '#modelo'
  select_opcao = () => '.ant-select-item-option-content' 
  select_tipo_acervo_tombo = () => '#CDEP_SELECT_TIPO_ACERVO'
  select_situacao_tombo = () => '#situacao'
  select_editora_controle = () => '.ant-select-selection-overflow'
  btn_devolucao_atraso = () => ':nth-child(2) > .ant-radio > .ant-radio-input'
  select_data_inicio = () => '#dataInicio'
  select_data_fim = () => '#dataFim'
  select_data_inicio_historico = () => '#rangerPicker'
  select_data_fim_historico = () => ':nth-child(3) > input'
  select_situacao_item = () => '#CDEP_SELECT_SOLICITACAO_SITUACOES'
  btn_gerar = () => '.ant-row > :nth-child(2) > .ant-btn'
  modal_relatorio = () => '.ant-modal-content'

}

export default Relatorios_Localizadores 