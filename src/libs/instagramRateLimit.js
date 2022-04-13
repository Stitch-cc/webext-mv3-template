import { useSettingState, useCache } from "../store";
const setting = useSettingState().value;
const cache = useCache().value;

// hisrtoryTimestamp: 历史首次请求时间戳; lastTimestamp: 当天首次请求时间戳;
// todayCounts: 当天请求次数; hourCounts: 当前小时请求次数;
// todayMaxCounts: 当天最大请求次数; hourMaxCounts: 当前小时最大请求次数;
const { hourMaxCounts, todayMaxCounts } = setting;

// 检测是否达到 Instagram rate limit
export function checkRateLimit() {
  const now = Date.now();
  const { isDayReached, historyTimestamp } = cache;
  if (isDayReached) {
    // checkDayRateLimit
    const oneDay = 24 * 60 * 60 * 1000;
    if (now - historyTimestamp > oneDay) {
      cache.historyTimestamp = now;
      cache.todayCounts = 0;
      cache.isDayReached = false;
      return false;
    } else {
      cache.delayTime = oneDay - (now - historyTimestamp);
      return true;
    }
  } else {
    !historyTimestamp && (cache.historyTimestamp = now);
    return checkHourRateLimit();
  }
}

function checkHourRateLimit() {
  const now = Date.now();
  const { isHourReached, lastTimestamp, todayCounts, hourCounts } = cache;
  if (isHourReached) {
    const oneHour = 60 * 60 * 1000;
    if (now - lastTimestamp > oneHour) {
      cache.lastTimestamp = now;
      cache.hourCounts = 0;
      cache.isHourReached = false;
      return false;
    } else {
      cache.delayTime = oneHour - (now - lastTimestamp);
      return true;
    }
  } else {
    !lastTimestamp && (cache.lastTimestamp = now);
    if (todayCounts >= todayMaxCounts) {
      cache.isDayReached = true;
      return true;
    } else if (hourCounts >= hourMaxCounts) {
      cache.isHourReached = true;
      return true;
    } else {
      cache.todayCounts++;
      cache.hourCounts++;
      return false;
    }
  }
}