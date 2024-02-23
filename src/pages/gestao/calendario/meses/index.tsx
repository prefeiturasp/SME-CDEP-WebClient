import { CollapseProps } from 'antd';
import { MesesEnum, MesesEnumEnumDisplay } from '~/core/enum/meses';

export const mesesCalendario: CollapseProps['items'] = [
  {
    key: MesesEnum.Janeiro,
    label: MesesEnumEnumDisplay[MesesEnum.Janeiro],
  },
  {
    key: MesesEnum.Fevereiro,
    label: MesesEnumEnumDisplay[MesesEnum.Fevereiro],
  },
  {
    key: MesesEnum.Março,
    label: MesesEnumEnumDisplay[MesesEnum.Março],
  },
  {
    key: MesesEnum.Abril,
    label: MesesEnumEnumDisplay[MesesEnum.Abril],
  },
  {
    key: MesesEnum.Maio,
    label: MesesEnumEnumDisplay[MesesEnum.Maio],
  },
  {
    key: MesesEnum.Junho,
    label: MesesEnumEnumDisplay[MesesEnum.Junho],
  },
  {
    key: MesesEnum.Julho,
    label: MesesEnumEnumDisplay[MesesEnum.Julho],
  },
  {
    key: MesesEnum.Agosto,
    label: MesesEnumEnumDisplay[MesesEnum.Agosto],
  },
  {
    key: MesesEnum.Setembro,
    label: MesesEnumEnumDisplay[MesesEnum.Setembro],
  },
  {
    key: MesesEnum.Outubro,
    label: MesesEnumEnumDisplay[MesesEnum.Outubro],
  },
  {
    key: MesesEnum.Novembro,
    label: MesesEnumEnumDisplay[MesesEnum.Novembro],
  },
  {
    key: MesesEnum.Dezembro,
    label: MesesEnumEnumDisplay[MesesEnum.Dezembro],
  },
];
