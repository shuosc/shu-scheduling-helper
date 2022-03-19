import { SortBy } from '../../app/types';
import { SortByKey } from '../../app/enums';

export const isSortByMutex = (presentList: SortBy[], current: SortBy): boolean => {
  switch (current.key) {
    case SortByKey.NUMBER:
    case SortByKey.CAPACITY:
    case SortByKey.REMAINING_CAPACITY:
      break;
    default:
      return false;
  }
  let number = 0,
    capacity = 0,
    remainingCapacity = 0;
  presentList.forEach(({ key, descending }) => {
    switch (key) {
      case SortByKey.NUMBER:
        number = descending ? 1 : -1;
        break;
      case SortByKey.CAPACITY:
        capacity = descending ? 1 : -1;
        break;
      case SortByKey.REMAINING_CAPACITY:
        remainingCapacity = descending ? 1 : -1;
        break;
    }
  });
  switch (current.key) {
    case SortByKey.NUMBER:
      return capacity !== 0 && remainingCapacity !== 0 && capacity + remainingCapacity === 0;
    case SortByKey.CAPACITY:
      return number !== 0 && remainingCapacity !== 0 && number === remainingCapacity;
    case SortByKey.REMAINING_CAPACITY:
      return number !== 0 && capacity !== 0 && number + capacity === 0;
  }
};
