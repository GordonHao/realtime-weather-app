import { useEffect, useState, useCallback }  from 'react';
import _ from 'lodash';

const fetchCurrentWeather = async (locationName) => {
    return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-625EF48B-0206-4725-8566-A9F6D80840FD&locationName=${locationName}`)                  // 向 requestURL 發送請求
        .then((response) => response.json())    // 取得伺服器回傳的資料並以 JSON 解析
        .then((data) => { 
            const locationData = data.records.location[0]; 
            const weatherElements = _.reduce(locationData.weatherElement, (neededElements, item) => {
                if(_.includes(['WDSD', 'TEMP', 'HUMD'], item.elementName)) {
                    neededElements[item.elementName] = item.elementValue;
                }
                return neededElements;
            }, {});

           return {
               observationTime: locationData.time.obsTime,
               locationName: locationData.locationName,
               temperature: weatherElements.TEMP,
               windSpeed: weatherElements.WDSD,
               humid: weatherElements.HUMD,
           }
        });  // 取得解析後的 JSON 資料
}; 

const fetchWeatherForecast = async (cityName) => {
    return fetch(
        `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-625EF48B-0206-4725-8566-A9F6D80840FD&locationName=${cityName}`
      )
        .then((response) => response.json())
        .then((data) => {
            const locationData = data.records.location[0];
            const weatherElements = _.reduce(locationData.weatherElement, (neededElements, item) => {
                if(_.includes(['Wx', 'PoP', 'CI'], item.elementName)) {
                    neededElements[item.elementName] = item.time[0].parameter;
                }
                return neededElements;
            }, {});
            return {
                description: weatherElements.Wx.parameterName,
                weatherCode: weatherElements.Wx.parameterValue,
                rainPossibility: weatherElements.PoP.parameterName,
                comfortability: weatherElements.CI.parameterName,
            }
        });
};

const useWeatherApi = (currentLocation) => {
    const {locationName, cityName} = currentLocation;
    const [ weatherElement, setWeatherElement ] = useState({
        observationTime: new Date(),
        locationName: '',
        description: '',
        temperature: 0,
        windSpeed: 0,
        humid: 0,
        weatherCode: 0,
        rainPossibility: 0,
        comfortability: '',
        isLoading: true,
    });

    const fetchData = useCallback(() => {
        const fetchingData = async () => {
            const [ currentWeather, weatherForecast ] = await Promise.all([
                fetchCurrentWeather(locationName),
                fetchWeatherForecast(cityName)
            ]);
    
            setWeatherElement({
                ...currentWeather,
                ...weatherForecast,
                isLoading: false,
            });
        };

        setWeatherElement(prevState => ({
            ...prevState,
            isLoading: true,
        }));

        fetchingData();
    }, [locationName, cityName]);
    
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return [ weatherElement, fetchData ]
};

export { useWeatherApi };