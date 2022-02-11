import React, { useCallback } from 'react';
import { IMessageBarStyles, MessageBar, MessageBarButton, MessageBarType } from '@fluentui/react';
import constants from '../../app/constants';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { initTerms, selectInitStatus, selectUpdateStatus, updateCourses } from '../../app/store';
import { InitStatus, UpdateStatus } from '../../app/enums';

const messageBarStyles: Partial<IMessageBarStyles> = {
  root: {
    padding: '4px 0',
    [constants.MEDIA_WIDE_DESKTOP_SCREEN]: {
      display: 'none',
    },
  },
};
const inlineMessageBarStyles: Partial<IMessageBarStyles> = {
  root: {
    marginRight: '8px',
    display: 'none',
    [constants.MEDIA_WIDE_DESKTOP_SCREEN]: {
      display: 'flex',
    },
  },
  iconContainer: {
    alignItems: 'center',
  },
  text: {
    alignItems: 'center',
  },
};

export interface UpdateMessageBarProps {
  inline?: boolean;
}

const UpdateMessageBar: React.FC<UpdateMessageBarProps> = ({ inline = false }) => {
  const initStatus = useAppSelector(selectInitStatus);
  const updateStatus = useAppSelector(selectUpdateStatus);
  const dispatch = useAppDispatch();

  const onClick = useCallback(() => {
    if (initStatus === InitStatus.NETWORK_ERROR || initStatus === InitStatus.DB_ERROR) {
      dispatch(initTerms());
    } else if (updateStatus === UpdateStatus.NETWORK_ERROR) {
      dispatch(updateCourses());
    }
  }, [dispatch, initStatus, updateStatus]);

  return (
    <MessageBar
      messageBarType={MessageBarType.error}
      isMultiline={false}
      styles={inline ? inlineMessageBarStyles : messageBarStyles}
      actions={<MessageBarButton onClick={onClick}>重试</MessageBarButton>}
    >
      数据更新失败，检查网络连接后重试。
    </MessageBar>
  );
};

export default UpdateMessageBar;
