import React, { useMemo } from 'react';
import { mergeStyles, useTheme } from '@fluentui/react';
import constants from '../../app/constants';
import { useAppSelector } from '../../app/hooks';
import { selectInitStatus, selectUpdateStatus } from '../../app/store';
import { InitStatus, UpdateStatus } from '../../app/enums';
import UpdateMessageBar from './UpdateMessageBar';

const desktopHeaderInnerStyle = mergeStyles({ margin: '0 auto', width: '100%', maxWidth: '1600px' });

const errorStatuses = [InitStatus.NETWORK_ERROR, InitStatus.DB_ERROR];

export interface NavWrapperProps {
  desktop?: boolean;
}

const NavWrapper: React.FC<NavWrapperProps> = ({ desktop, children }) => {
  const theme = useTheme();
  const initStatus = useAppSelector(selectInitStatus);
  const updateStatus = useAppSelector(selectUpdateStatus);
  const className = useMemo(
    () =>
      desktop
        ? mergeStyles({
            display: 'none',
            background: theme.palette.white,
            borderBottom: `1px solid ${theme.palette.neutralLighter}`,
            [constants.MEDIA_DESKTOP_SCREEN]: {
              display: 'block',
            },
          })
        : mergeStyles({
            position: 'sticky',
            zIndex: '1',
            top: '0',
            right: '0',
            left: '0',
            borderBottom: `1px solid ${theme.palette.neutralLighter}`,
            [constants.MEDIA_DESKTOP_SCREEN]: {
              display: 'none',
            },
          }),
    [desktop, theme]
  );
  return (
    <header className={className}>
      {desktop ? <div className={desktopHeaderInnerStyle}>{children}</div> : children}
      {(errorStatuses.includes(initStatus) || updateStatus === UpdateStatus.NETWORK_ERROR) && <UpdateMessageBar />}
    </header>
  );
};

export default NavWrapper;
