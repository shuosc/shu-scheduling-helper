import React, { FormEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import {
  DefaultButton,
  Dialog,
  DialogFooter,
  IDialogContentProps,
  IModalProps,
  ISpinButtonStyles,
  SpinButton,
  useTheme,
} from '@fluentui/react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  hideModel,
  loadCourseDetails,
  selectCourseMaxPage,
  selectCoursePage,
  selectModalVisibility,
} from '../../app/store';

const dialogContentProps: IDialogContentProps = {
  title: '跳转到页码',
  subText: '输入要跳转到的目标页码（1 ~ 474）',
};
const spinButtonStyles: Partial<ISpinButtonStyles> = {
  root: { marginBottom: '36px' },
};

const JumpToDialog: React.FC = () => {
  const theme = useTheme();
  const page = useAppSelector(selectCoursePage);
  const maxPage = useAppSelector(selectCourseMaxPage);
  const { jumpToDialog } = useAppSelector(selectModalVisibility);
  const dispatch = useAppDispatch();

  const [value, setValue] = useState(page.toString());
  useEffect(() => {
    setValue(page.toString());
  }, [jumpToDialog, page]);

  const modelProps = useMemo<IModalProps>(
    () => ({
      isDarkOverlay: !theme.isInverted,
    }),
    [theme]
  );

  const onDismiss = useCallback(() => {
    dispatch(hideModel('jumpToDialog'));
  }, [dispatch]);
  const onSubmit: FormEventHandler = (ev) => {
    ev.preventDefault();
    dispatch(
      loadCourseDetails({
        offset: parseInt(value) * 10 - 10,
        limit: 10,
      })
    );
    dispatch(hideModel('jumpToDialog'));
  };
  const onChange = useCallback((_, newValue?: string) => {
    if (newValue) {
      setValue(newValue);
    }
  }, []);

  return (
    <Dialog
      hidden={!jumpToDialog}
      onDismiss={onDismiss}
      modalProps={modelProps}
      dialogContentProps={dialogContentProps}
    >
      <form onSubmit={onSubmit}>
        <SpinButton
          label="页码："
          value={value}
          onChange={onChange}
          min={1}
          max={maxPage}
          step={1}
          styles={spinButtonStyles}
        />
        <DialogFooter>
          <DefaultButton primary text="确定" type="submit" />
          <DefaultButton text="取消" onClick={onDismiss} />
        </DialogFooter>
      </form>
    </Dialog>
  );
};

export default JumpToDialog;
