import React, { useCallback, useMemo } from 'react';
import {
  getRTL,
  IButtonStyles,
  IconButton,
  IIconProps,
  ILabelStyles,
  ITextFieldStyles,
  mergeStyles,
  TextField,
  useTheme,
} from '@fluentui/react';
import constants from '../../../app/constants';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { changeFilterConditions, selectFilterConditions } from '../../../app/store';

const clearIconProps: IIconProps = { iconName: 'Clear' };
const clearButtonStyles: Partial<IButtonStyles> = { root: { height: 'auto' }, icon: { fontSize: '12px' } };

export interface SearchFieldBaseProps {
  fieldName: 'courseId' | 'courseName' | 'credit' | 'teacherId' | 'teacherName' | 'classTime';
  label: string;
  width: string;
}

const SearchField: React.FC<SearchFieldBaseProps> = ({ fieldName, label, width }) => {
  const theme = useTheme();
  const styles = useMemo<Partial<ITextFieldStyles>>(
    () => ({
      prefix: {
        fontWeight: '600',
        color: theme.palette.black,
        display: 'flex',
        minWidth: 'calc(5em + 20px)',
        textAlign: 'right',
        [constants.MEDIA_DESKTOP_SCREEN]: {
          display: 'none',
        },
      },
      suffix: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        cursor: 'pointer',
        flexBasis: '32px',
        flexShrink: '0',
        padding: '1px 0',
        margin: '-1px 0px',
        background: 'transparent',
        '&:hover .ms-Button': {
          backgroundColor: theme.palette.neutralLighter,
        },
        '&:hover .ms-Button-icon': {
          color: theme.palette.neutralPrimary,
        },
        '.ms-Button': {
          borderRadius: getRTL(theme) ? '1px 0 0 1px' : '0 1px 1px 0',
        },
        '.ms-Button-icon': {
          color: theme.palette.neutralPrimary,
        },
      },
      subComponentStyles: {
        label: {
          root: {
            display: 'none',
            [constants.MEDIA_DESKTOP_SCREEN]: {
              display: 'block',
            },
          },
        } as Partial<ILabelStyles>,
      },
    }),
    [theme]
  );
  const wrapperClassName = useMemo(
    () =>
      mergeStyles({
        width: '100%',
        [constants.MEDIA_DESKTOP_SCREEN]: {
          maxWidth: width,
        },
      }),
    [width]
  );

  const conditions = useAppSelector(selectFilterConditions);
  const dispatch = useAppDispatch();
  const value = conditions[fieldName];

  const onChange = useCallback(
    (newValue: string) => {
      dispatch(
        changeFilterConditions({
          [fieldName]: newValue,
        })
      );
    },
    [dispatch, fieldName]
  );
  const onChangeImpl = useCallback(
    (_, newValue: string | undefined) => {
      onChange(newValue?.replace(/\s+/g, ' ') || '');
    },
    [onChange]
  );

  const onClear = useCallback(() => {
    onChange('');
  }, [onChange]);

  const onBlur = useCallback(() => {
    onChange(value.trim());
  }, [onChange, value]);

  const onRenderSuffix = useCallback(() => {
    return value ? (
      <IconButton iconProps={clearIconProps} styles={clearButtonStyles} ariaLabel="清除文本" onClick={onClear} />
    ) : null;
  }, [onClear, value]);

  return (
    <div className={wrapperClassName}>
      <TextField
        value={value}
        label={label}
        prefix={label}
        styles={styles}
        onRenderSuffix={onRenderSuffix}
        onChange={onChangeImpl}
        onBlur={onBlur}
      />
    </div>
  );
};

export default SearchField;
