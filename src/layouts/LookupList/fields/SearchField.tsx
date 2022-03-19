import React, { useCallback, useMemo } from 'react';
import {
  IButtonStyles,
  IconButton,
  IIconProps,
  ILabelStyles,
  ITextFieldStyles,
  ITextStyles,
  mergeStyles,
  Stack,
  Text,
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
        [constants.MEDIA_WIDE_DESKTOP_SCREEN]: {
          display: 'none',
        },
      },
      suffix: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        flexShrink: '0',
        padding: '1px 0',
        margin: '-1px 0px',
        background: 'transparent',
        userSelect: 'none',
        '.ms-Stack': {
          marginRight: '4px',
        },
        '.ms-Button': {
          borderRadius: '0 1px 1px 0',
        },
        '.ms-Button-icon': {
          color: theme.palette.neutralPrimary,
        },
      },
      subComponentStyles: {
        label: {
          root: {
            display: 'none',
            [constants.MEDIA_WIDE_DESKTOP_SCREEN]: {
              display: 'block',
            },
          },
        } as Partial<ILabelStyles>,
      },
    }),
    [theme]
  );
  const regExpModeTextStyles = useMemo<Partial<ITextStyles>>(
    () => ({
      root: { color: theme.palette.neutralTertiary },
    }),
    [theme]
  );
  const wrapperClassName = useMemo(
    () =>
      mergeStyles({
        width: '100%',
        [constants.MEDIA_WIDE_DESKTOP_SCREEN]: {
          maxWidth: width,
        },
      }),
    [width]
  );

  const conditions = useAppSelector(selectFilterConditions);
  const dispatch = useAppDispatch();
  const value = conditions[fieldName];

  const errorMessage = useMemo(() => {
    if (conditions.regExpMode) {
      try {
        new RegExp(value);
      } catch (e: any) {
        return e.message;
      }
    }
    return undefined;
  }, [conditions.regExpMode, value]);
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
  const onRenderSuffix = useMemo(
    () =>
      conditions.regExpMode || value
        ? () => (
            <>
              {conditions.regExpMode && (
                <Stack horizontal verticalAlign="center">
                  <Text variant="smallPlus" styles={regExpModeTextStyles}>
                    正则
                  </Text>
                </Stack>
              )}
              {value && (
                <IconButton
                  iconProps={clearIconProps}
                  styles={clearButtonStyles}
                  ariaLabel="清除文本"
                  onClick={onClear}
                />
              )}
            </>
          )
        : undefined,
    [conditions.regExpMode, onClear, regExpModeTextStyles, value]
  );

  return (
    <div className={wrapperClassName}>
      <TextField
        value={value}
        label={label}
        prefix={label}
        styles={styles}
        maxLength={50}
        errorMessage={errorMessage}
        onRenderSuffix={onRenderSuffix}
        onChange={onChangeImpl}
        onBlur={onBlur}
      />
    </div>
  );
};

export default SearchField;
