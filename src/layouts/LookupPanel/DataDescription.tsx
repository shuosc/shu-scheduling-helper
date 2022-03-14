import React from 'react';
import { IStackTokens, Label, mergeStyles, Stack, Text } from '@fluentui/react';
import { format } from 'date-fns';
import { useAppSelector } from '../../app/hooks';
import { selectActiveTerm } from '../../app/store';
import useTimeDistance from '../../app/hooks/timeDistance';

const stackTokens: IStackTokens = { childrenGap: '12px', padding: '0 8px 8px' };
const detailInfoLabelClassName = mergeStyles({ width: '65px', display: 'inline-block' });

const DataDescription: React.FC = () => {
  const activeTerm = useAppSelector(selectActiveTerm);
  const distance = useTimeDistance(activeTerm?.updateTimeMs || 0, true);

  return (
    <Stack tokens={stackTokens}>
      <Stack.Item>
        <Label>数据说明</Label>
      </Stack.Item>
      <Stack.Item>
        <Text block>
          人数等所有数据<b>【非实时】</b>，视情况可能存在高达数日的误差，仅供参考。
        </Text>
      </Stack.Item>
      {activeTerm && (
        <Stack.Item>
          <Text variant="smallPlus" nowrap block>
            <b className={detailInfoLabelClassName}>更新时间：</b>
            {format(activeTerm.updateTimeMs, 'yyyy年M月d日 HH:mm')}（{distance}）
          </Text>
          <Text variant="smallPlus" nowrap block>
            <b className={detailInfoLabelClassName}>数据Hash：</b>
            {activeTerm.hash.slice(0, 8)}
          </Text>
        </Stack.Item>
      )}
    </Stack>
  );
};

export default DataDescription;
