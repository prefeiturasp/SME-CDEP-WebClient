import styled from 'styled-components';
import { Colors } from '~/core/styles/colors';

export const ErroGeralLogin = styled.h2`
  font-family: Roboto;
  font-size: 14px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 0.28px;
  color: ${Colors.ERROR};
  border-radius: 4px;
  border: solid 2px ${Colors.ERROR};
  padding: 1rem;
  text-align: center;
  margin-bottom: 24px;
`;
