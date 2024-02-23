import { FaCalendarAlt } from 'react-icons/fa';
import { MesesEnum, MesesEnumEnumDisplay } from '~/core/enum/meses';

type MesesProps = {
  label: string;
  extra?: React.ReactNode;
};

const icon = <FaCalendarAlt size={16} />;

export const mesesCalendario: MesesProps[] = [
  {
    label: MesesEnumEnumDisplay[MesesEnum.Janeiro],
    extra: icon,
  },
  {
    label: MesesEnumEnumDisplay[MesesEnum.Fevereiro],
    extra: icon,
  },
  {
    label: MesesEnumEnumDisplay[MesesEnum.Março],
    extra: icon,
  },
  {
    label: MesesEnumEnumDisplay[MesesEnum.Abril],
    extra: icon,
  },
  {
    label: MesesEnumEnumDisplay[MesesEnum.Maio],
    extra: icon,
  },
  {
    label: MesesEnumEnumDisplay[MesesEnum.Junho],
    extra: icon,
  },
  {
    label: MesesEnumEnumDisplay[MesesEnum.Julho],
    extra: icon,
  },
  {
    label: MesesEnumEnumDisplay[MesesEnum.Agosto],
    extra: icon,
  },
  {
    label: MesesEnumEnumDisplay[MesesEnum.Setembro],
    extra: icon,
  },
  {
    label: MesesEnumEnumDisplay[MesesEnum.Outubro],
    extra: icon,
  },
  {
    label: MesesEnumEnumDisplay[MesesEnum.Novembro],
    extra: icon,
  },
  {
    label: MesesEnumEnumDisplay[MesesEnum.Dezembro],
    extra: icon,
  },
];
