import { useEffect, useState } from 'react';
import { formatDistance } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const getDistance = (from: Date | number, addSuffix: boolean) =>
  formatDistance(from, new Date(), { addSuffix, locale: zhCN }).replace(/\s+/g, '');

const useTimeDistance = (from: Date | number, addSuffix: boolean = false, updateIntervalMs: number = 10000) => {
  const [str, setStr] = useState(getDistance(from, addSuffix));

  useEffect(() => {
    setStr(getDistance(from, addSuffix));
    const timer = setInterval(() => {
      setStr(getDistance(from, addSuffix));
    }, Math.max(500, updateIntervalMs));
    return () => {
      clearInterval(timer);
    };
  }, [from, addSuffix, updateIntervalMs]);

  return str;
};

export default useTimeDistance;
