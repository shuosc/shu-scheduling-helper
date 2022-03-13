import React from 'react';
import { CommandBar, ICommandBarItemProps, ICommandBarStyles } from '@fluentui/react';

export interface NavBaseProps {
  items: ICommandBarItemProps[];
  farItems: ICommandBarItemProps[];
  styles?: Partial<ICommandBarStyles>;
}

const NavBase: React.FC<NavBaseProps> = ({ items, farItems, styles }) => {
  return <CommandBar items={items} farItems={farItems} styles={styles} onReduceData={() => undefined} />;
};

export default NavBase;