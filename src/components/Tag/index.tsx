import React, { useMemo } from 'react';
import { ITextStyles, Text, useTheme } from '@fluentui/react';
import constants from '../../app/constants';
import { SpecialLimitationType } from '../../app/enums';

const TAG_COLOR_TYPES = ['red', 'orange', 'purple', 'default'] as const;
type Colors = Record<typeof TAG_COLOR_TYPES[number], { text: string; border: string; background: string }>;

const getStyles = (colors: Colors) =>
  TAG_COLOR_TYPES.reduce((acc, cur) => {
    acc[cur] = {
      root: {
        display: 'inline-block',
        padding: '1px 4px',
        borderRadius: '2px',
        color: colors[cur].text,
        border: `1px solid ${colors[cur].border}`,
        background: colors[cur].background,
      },
    };
    return acc;
  }, {} as Record<typeof TAG_COLOR_TYPES[number], ITextStyles>);

const styles = getStyles({
  red: { text: '#cf1322', border: '#ffa39e', background: '#fff1f0' },
  orange: { text: '#d46b08', border: '#ffd591', background: '#fff7e6' },
  purple: { text: '#531dab', border: '#d3adf7', background: '#f9f0ff' },
  default: { text: '#000000d9', border: '#d9d9d9', background: '#fafafa' },
});
const darkStyles = getStyles({
  red: { text: '#e84749', border: '#58181c', background: '#2a1215' },
  orange: { text: '#e89a3c', border: '#593815', background: '#2b1d11' },
  purple: { text: '#854eca', border: '#301c4d', background: '#1a1325' },
  default: { text: 'rgba(255, 255, 255, 0.85)', border: '#434343', background: 'rgba(255, 255, 255, 0.04)' },
});

export interface TagProps {
  text: string;
}

const Tag: React.FC<TagProps> = ({ text }) => {
  const theme = useTheme();

  const textStyles = useMemo(() => {
    const currentStyles = theme.isInverted ? darkStyles : styles;
    switch (text) {
      case constants.LIMITATION_VALUE[SpecialLimitationType.LIMITED_IN_NUMBER]:
        return currentStyles.orange;
      case constants.LIMITATION_VALUE[SpecialLimitationType.NOT_SELECTABLE]:
        return currentStyles.red;
      case constants.LIMITATION_VALUE[SpecialLimitationType.NOT_UNSELECTABLE]:
        return currentStyles.purple;
      default:
        return currentStyles.default;
    }
  }, [text, theme]);

  return (
    <Text variant="smallPlus" styles={textStyles} nowrap>
      {text}
    </Text>
  );
};

export default Tag;
