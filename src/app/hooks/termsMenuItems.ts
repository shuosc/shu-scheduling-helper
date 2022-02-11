import { useMemo } from 'react';
import type { IContextualMenuItem } from '@fluentui/react';
import { ContextualMenuItemType } from '@fluentui/react';
import { selectActiveTerm, selectAvailableTerms, switchActiveTerm } from '../store';
import type { Term } from '../types';
import { useAppDispatch, useAppSelector } from './index';

const useSectionItems = (active: Term | null, items: Term[]): IContextualMenuItem[] => {
  const dispatch = useAppDispatch();
  return useMemo(
    () =>
      !active
        ? []
        : items.map((item) => ({
            key: `TERM_${item.termId}`,
            text: item.termName,
            canCheck: true,
            checked: active.termId === item.termId,
            onClick: () => {
              dispatch(
                switchActiveTerm({
                  termId: item.termId,
                })
              );
            },
          })),
    [active, items, dispatch]
  );
};
const useTermsMenuItems = (): IContextualMenuItem[] => {
  const activeTerm = useAppSelector(selectActiveTerm);
  const availableTerms = useAppSelector(selectAvailableTerms);

  const currentTerms = useMemo(() => availableTerms.filter((item) => item.isCurrent), [availableTerms]);
  const historyTerms = useMemo(() => availableTerms.filter((item) => !item.isCurrent), [availableTerms]);
  const sectionCurrentTermsItems = useSectionItems(activeTerm, currentTerms);
  const sectionHistoryTermsItems = useSectionItems(activeTerm, historyTerms);

  return useMemo(() => {
    const items: IContextualMenuItem[] = [];
    if (sectionCurrentTermsItems.length > 0) {
      items.push({
        key: 'SECTION_ACTIVE',
        itemType: ContextualMenuItemType.Section,
        sectionProps: {
          title: '当前选课学期',
          bottomDivider: true,
          items: sectionCurrentTermsItems,
        },
      });
    }
    if (sectionHistoryTermsItems.length > 0) {
      items.push({
        key: 'SECTION_HISTORY',
        itemType: ContextualMenuItemType.Section,
        sectionProps: {
          title: '历史学期',
          bottomDivider: true,
          items: sectionHistoryTermsItems,
        },
      });
    }
    if (items.length > 0) {
      items.push({
        key: 'MANAGE',
        text: '管理学期...',
      });
    }
    return items;
  }, [sectionCurrentTermsItems, sectionHistoryTermsItems]);
};

export default useTermsMenuItems;
