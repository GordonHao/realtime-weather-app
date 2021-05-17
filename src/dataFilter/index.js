import fs from 'fs';

const fileContent = fs.readFileSync('A-B0062-001.json', 'utf-8');
const dataSet = JSON.parse(fileContent);

const location = dataSet.cwbopendata.dataset.locations.location;
const nowTimesStamp = new Date('2021-05-09').getTime(); //今天的 timestamp


const newData = location.map(location => {
    const time = location.time
        .filter(time => new Date(time.dataTime).getTime() > nowTimesStamp)
        .map(time => {
            const { sunrise, sunset } = time.parameter
                .filter(timeParameter => 
                    ['日出時刻', '日落時刻'].includes(timeParameter.parameterName)
                )
                .reduce((accumulator, timeParameter) => {
                    const objectKey = timeParameter.parameterName === '日出時刻' ? 'sunrise' : 'sunset';

                    accumulator[objectKey] = timeParameter.parameterValue;
                    return accumulator;
                }, {});

                return {
                    dataTime: time.dataTime,
                    sunrise,
                    sunset
                };
        });
        return {
            locationName: location.locationName,
            time,
        };
});

fs.writeFile('sunrise-sunset.json', JSON.stringify(newData, null, 2), (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });