import { FaCalendarAlt } from 'react-icons/fa';
import { MesesEnum, MesesEnumEnumDisplay } from '~/core/enum/meses';

export type MesesRowProps = {
  key: MesesEnum;
  label: string;
  extra?: React.ReactNode;
};

export type MesesProps = {
  row: MesesRowProps[];
};

const icon = <FaCalendarAlt size={16} />;

export const mesesCalendario: MesesProps[] = [
  {
    row: [
      {
        key: MesesEnum.Janeiro,
        label: MesesEnumEnumDisplay[MesesEnum.Janeiro],
        extra: icon,
      },
      {
        key: MesesEnum.Fevereiro,
        label: MesesEnumEnumDisplay[MesesEnum.Fevereiro],
        extra: icon,
      },
      {
        key: MesesEnum.Março,
        label: MesesEnumEnumDisplay[MesesEnum.Março],
        extra: icon,
      },
      {
        key: MesesEnum.Abril,
        label: MesesEnumEnumDisplay[MesesEnum.Abril],
        extra: icon,
      },
    ],
  },
  {
    row: [
      {
        key: MesesEnum.Maio,
        label: MesesEnumEnumDisplay[MesesEnum.Maio],
        extra: icon,
      },
      {
        key: MesesEnum.Junho,
        label: MesesEnumEnumDisplay[MesesEnum.Junho],
        extra: icon,
      },
      {
        key: MesesEnum.Julho,
        label: MesesEnumEnumDisplay[MesesEnum.Julho],
        extra: icon,
      },
      {
        key: MesesEnum.Agosto,
        label: MesesEnumEnumDisplay[MesesEnum.Agosto],
        extra: icon,
      },
    ],
  },
  {
    row: [
      {
        key: MesesEnum.Setembro,
        label: MesesEnumEnumDisplay[MesesEnum.Setembro],
        extra: icon,
      },
      {
        key: MesesEnum.Outubro,
        label: MesesEnumEnumDisplay[MesesEnum.Outubro],
        extra: icon,
      },
      {
        key: MesesEnum.Novembro,
        label: MesesEnumEnumDisplay[MesesEnum.Novembro],
        extra: icon,
      },
      {
        key: MesesEnum.Dezembro,
        label: MesesEnumEnumDisplay[MesesEnum.Dezembro],
        extra: icon,
      },
    ],
  },
];
