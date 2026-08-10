class Calendario_Localizadores {

  // criar
  menu_gestao = () => 'aside li.ant-menu-submenu > div > span > div > div'
  menu_calendario = () => 'span.ant-menu-title-content:contains("Calendário")'
  mes_calendario = () => 'article.ant-typography'
  dia_calendario = () => 'div.ant-row.ant-row-space-between > div.ant-col'
  btn_incluir = () => '.ant-col > .ant-btn'
  input_justificativa = () => '#justificativa'
  btn_salvar = () => '.ant-modal-footer > .ant-btn-default'
  
  msg_sucesso = () => 'div.ant-notification-notice-description'

  // consultar
  

  // editar 
 

  // excluir
  btn_excluir = () => '.ant-row-middle > :nth-child(1) > .ant-btn'
  btn_confirmar_exclusao = () => '.ant-modal-confirm-btns > .ant-btn-default'

}

export default Calendario_Localizadores 