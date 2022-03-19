import React from 'react';
import { IStackTokens, mergeStyles, Shimmer, Stack, Text } from '@fluentui/react';
import { Course } from '../../app/types';
import TextWithIcon from './TextWithIcon';
import Tag from '../Tag';

const actionsWrapperClassName = mergeStyles({ margin: '0 -8px' });
const thinPlusGapTokens: IStackTokens = { childrenGap: '6px' };
const tinyThickGapTokens: IStackTokens = { childrenGap: '2px 16px' };
const zeroMediumGapTokens: IStackTokens = { childrenGap: '0 8px' };

export interface CourseCardProps {
  course?: Course | null;
  loading?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, loading = false, children }) => {
  return (
    <Stack tokens={thinPlusGapTokens}>
      <Stack.Item>
        <Stack horizontal verticalAlign="center" wrap tokens={zeroMediumGapTokens}>
          <Stack.Item>
            {loading ? (
              <Shimmer width="48px" />
            ) : (
              <Text variant="mediumPlus">
                <b>{course?.courseName || '-'}</b>
              </Text>
            )}
          </Stack.Item>
          <Stack.Item grow>
            {loading ? (
              <Shimmer width="60px" />
            ) : (
              <Stack horizontal verticalAlign="center" wrap tokens={zeroMediumGapTokens}>
                <Text variant="smallPlus">({course?.courseId || '-'})</Text>
                <Text variant="smallPlus">{course?.credit || '-'}学分</Text>
              </Stack>
            )}
          </Stack.Item>
        </Stack>
        <Stack horizontal verticalAlign="center" wrap tokens={zeroMediumGapTokens}>
          <Stack.Item>{loading ? <Shimmer width="42px" /> : <Text>{course?.teacherName || '-'}</Text>}</Stack.Item>
          <Stack.Item grow>
            {loading ? (
              <Shimmer width="36px" />
            ) : (
              <Stack horizontal verticalAlign="center" wrap tokens={zeroMediumGapTokens}>
                <Text variant="smallPlus">({course?.teacherId || '-'})</Text>
                {course?.teacherTitle && <Text variant="smallPlus">{course.teacherTitle}</Text>}
              </Stack>
            )}
          </Stack.Item>
        </Stack>
      </Stack.Item>
      <Stack.Item>
        <Stack horizontal verticalAlign="center" wrap tokens={tinyThickGapTokens}>
          <Stack.Item>
            <TextWithIcon iconName="Clock" ariaLabel="上课时间" text={course?.classTime} loading={loading} />
          </Stack.Item>
          <Stack.Item>
            <TextWithIcon
              iconName="People"
              ariaLabel="人数"
              text={`${course?.number || '-'} / ${course?.capacity || '-'} 人`}
              loading={loading}
            />
          </Stack.Item>
          <Stack.Item>
            <Stack horizontal verticalAlign="center" tokens={tinyThickGapTokens}>
              <TextWithIcon iconName="Nav2DMapView" ariaLabel="校区" text={course?.campus} loading={loading} />
              <TextWithIcon iconName="MapPin" ariaLabel="上课地点" text={course?.position} loading={loading} />
            </Stack>
          </Stack.Item>
        </Stack>
      </Stack.Item>
      {course?.limitations && course.limitations.length > 0 && (
        <Stack.Item>
          <Stack horizontal verticalAlign="center" wrap tokens={zeroMediumGapTokens}>
            {course.limitations.map((limitation, index) => (
              <Tag text={limitation} key={index} />
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
  );
};

export default CourseCard;
