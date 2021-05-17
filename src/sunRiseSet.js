import { dayjs } from 'dayjs';
const sunriseAndSunsetData = require('./sunrise-sunset.json');

const getMoment = (locationName) => {
    const location = sunriseAndSunsetData.find(
      (data) => data.locationName === locationName
    );
  
    if (!location) return null;
  
    const now = dayjs();
    const nowDate = Intl.DateTimeFormat('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
      .format(now)
      .replace(/\//g, '-');
  
    const locationDate =
      location.time && location.time.find((time) => time.dataTime === nowDate);
    const sunriseTimestamp = dayjs(
      `${locationDate.dataTime} ${locationDate.sunrise}`
    ).unix();
    const sunsetTimestamp = dayjs(
      `${locationDate.dataTime} ${locationDate.sunset}`
    ).unix();
  
    const nowTimeStamp = now.unix();
  
    return sunriseTimestamp <= nowTimeStamp && nowTimeStamp <= sunsetTimestamp
      ? 'day'
      : 'night';
  };

export { getMoment }