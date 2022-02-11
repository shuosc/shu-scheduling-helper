import React, { useMemo } from 'react';
import {
  Icon,
  IIconStyles,
  IStackTokens,
  ITextStyles,
  mergeStyles,
  Shimmer,
  Stack,
  Text,
  useTheme,
} from '@fluentui/react';
import { Course } from '../../app/types';

const actionsWrapperClassName = mergeStyles({ margin: '0 -8px' });
const thinGapTokens: IStackTokens = { childrenGap: '4px' };
const thinPlusGapTokens: IStackTokens = { childrenGap: '6px' };
const tinyThickGapTokens: IStackTokens = { childrenGap: '2px 16px' };
const zeroMediumGapTokens: IStackTokens = { childrenGap: '0 8px' };

export interface CourseCardProps {
  course?: Course | null;
  loading?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, loading = false, children }) => {
  const theme = useTheme();
  const iconStyles = useMemo<Partial<IIconStyles>>(
    () => ({
      root: {
        color: theme.palette.neutralSecondary,
      },
    }),
    [theme]
  );
  const limitationStyles = useMemo<Partial<ITextStyles>>(
    () => ({
      root: {
        color: theme.palette.neutralTertiary,
      },
    }),
    [theme]
  );

  return (
    <>
      {loading}
      <Stack tokens={thinPlusGapTokens}>
        <Stack.Item>
          <Stack horizontal verticalAlign="center" wrap tokens={zeroMediumGapTokens}>
            {loading ? (
              <Shimmer width="48px" />
            ) : (
              <Text variant="mediumPlus">
                <b>{course?.courseName || '-'}</b>
              </Text>
            )}
            {loading ? (
              <Shimmer width="60px" />
            ) : (
              <Stack horizontal verticalAlign="center" wrap tokens={zeroMediumGapTokens}>
                <Text variant="smallPlus">({course?.courseId || '-'})</Text>
                <Text variant="smallPlus">{course?.credit || '-'}学分</Text>
              </Stack>
            )}
          </Stack>
          <Stack horizontal verticalAlign="center" wrap tokens={zeroMediumGapTokens}>
            {loading ? <Shimmer width="42px" /> : <Text>{course?.teacherName || '-'}</Text>}
            {loading ? (
              <Shimmer width="36px" />
            ) : (
              <Stack horizontal verticalAlign="center" wrap tokens={zeroMediumGapTokens}>
                <Text variant="smallPlus">({course?.teacherId || '-'})</Text>
                {course?.teacherTitle && <Text variant="smallPlus">{course.teacherTitle}</Text>}
              </Stack>
            )}
          </Stack>
        </Stack.Item>
        <Stack.Item>
          <Stack horizontal verticalAlign="center" wrap tokens={tinyThickGapTokens}>
            <Stack.Item>
              <Stack horizontal verticalAlign="center" tokens={thinGapTokens}>
                <Icon iconName="Clock" ariaLabel="上课时间" styles={iconStyles} />
                {loading ? <Shimmer width="24px" /> : <Text>{course?.classTime || '-'}</Text>}
              </Stack>
            </Stack.Item>
            <Stack.Item>
              <Stack horizontal verticalAlign="center" tokens={thinGapTokens}>
                <Icon iconName="People" ariaLabel="人数" styles={iconStyles} />
                {loading ? (
                  <Shimmer width="24px" />
                ) : (
                  <Text>
                    {course?.number || '-'} / {course?.capacity || '-'} 人
                  </Text>
                )}
              </Stack>
            </Stack.Item>
            <Stack.Item>
              <Stack horizontal verticalAlign="center" tokens={tinyThickGapTokens}>
                <Stack horizontal verticalAlign="center" tokens={thinGapTokens}>
                  <Icon iconName="Nav2DMapView" ariaLabel="校区" styles={iconStyles} />
                  {loading ? <Shimmer width="24px" /> : <Text>{course?.campus || '-'}</Text>}
                </Stack>
                <Stack horizontal verticalAlign="center" tokens={thinGapTokens}>
                  <Icon iconName="MapPin" ariaLabel="上课地点" styles={iconStyles} />
                  {loading ? <Shimmer width="24px" /> : <Text>{course?.position || '-'}</Text>}
                </Stack>
              </Stack>
            </Stack.Item>
          </Stack>
        </Stack.Item>
        {course?.limitations && course.limitations.length > 0 && (
          <Stack.Item>
            <Stack horizontal verticalAlign="center" wrap tokens={zeroMediumGapTokens}>
              {course.limitations.map((limitation, index) => (
                <Text variant="smallPlus" styles={limitationStyles} key={index}>
                  {limitation}
                </Text>
              ))}
            </Stack>
          </Stack.Item>
        )}
        {children && (
          <Stack.Item>
            <div className={actionsWrapperClassName}>{children}</div>
          </Stack.Item>
        )}
      </Stack>
    </>
  );
};

export default CourseCard;
