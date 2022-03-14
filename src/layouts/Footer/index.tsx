import React, { useMemo } from 'react';
import { IStackStyles, IStackTokens, ITextStyles, Link, mergeStyles, Stack, Text, useTheme } from '@fluentui/react';
import shuoscLogo from '../../assets/shuosc.png';

const stackTokens: IStackTokens = { childrenGap: '6px', padding: '20px 20px 32px' };
const stackStyles: Partial<IStackStyles> = { root: { textAlign: 'center' } };
const logoClassName = mergeStyles({
  height: '24px',
  width: '24px',
  opacity: '0.6',
  filter: 'grayscale(0.4)',
  transition: 'opacity .2s, filter .2s',
  margin: '6px 0',
  '&:hover': {
    opacity: '0.8',
    filter: 'grayscale(0.2)',
  },
});

const year = new Date().getFullYear();
const orgHref = 'https://github.com/shuosc';
const licenseHref = 'https://github.com/shuosc/shu-scheduling-helper/blob/main/LICENSE';
const xkHref = 'http://www.xk.shu.edu.cn/';
const beianHref = 'https://beian.miit.gov.cn';

const Footer: React.FC = () => {
  const theme = useTheme();
  const textStyles = useMemo<Partial<ITextStyles>>(
    () => ({ root: { color: theme.palette.neutralSecondary } }),
    [theme]
  );
  const linkStyles = useMemo<Partial<ITextStyles>>(
    () => ({
      root: {
        color: theme.palette.neutralTertiary,
        '&:active, &:hover, &:active:hover': {
          color: theme.palette.neutralTertiaryAlt,
        },
        '&:focus': {
          color: theme.palette.neutralTertiary,
        },
      },
    }),
    [theme]
  );

  return (
    <Stack horizontalAlign="center" tokens={stackTokens} styles={stackStyles}>
      <Stack.Item>
        <img src={shuoscLogo} alt="上海大学开源社区" className={logoClassName} />
      </Stack.Item>
      <Stack.Item>
        <Text variant="smallPlus" nowrap styles={textStyles}>
          Copyright &copy; {year}{' '}
          <Link href={orgHref} target="_blank" styles={linkStyles}>
            上海大学开源社区
          </Link>
          .
        </Text>{' '}
        <Text variant="smallPlus" nowrap styles={textStyles}>
          基于{' '}
          <Link href={licenseHref} target="_blank" styles={linkStyles}>
            GPL-3.0-or-later
          </Link>{' '}
          开源
        </Text>
      </Stack.Item>
      <Stack.Item>
        <Text variant="smallPlus" nowrap styles={textStyles}>
          数据来源:{' '}
          <Link href={xkHref} target="_blank" styles={linkStyles}>
            上海大学网上选课系统
          </Link>
        </Text>{' '}
        <Text variant="smallPlus" nowrap styles={textStyles}>
          版权归上海大学所有
        </Text>
      </Stack.Item>
      <Stack.Item>
        <Text variant="smallPlus" nowrap styles={textStyles}>
          <Link href={beianHref} target="_blank" styles={linkStyles}>
            沪ICP备19044115号-1
          </Link>
        </Text>
      </Stack.Item>
    </Stack>
  );
};

export default Footer;
