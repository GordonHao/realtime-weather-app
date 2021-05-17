import './WeatherApp.css';
import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';
import { useState, useEffect, useMemo } from 'react';
import { getMoment } from './sunRiseSet.js';
import WeatherCard from './WeatherCard.js';
import { useWeatherApi } from './useWeatherApi.js';
import { WeatherSetting } from './WeatherSetting.js';
import { findLocation } from './utils.js';

const Container = styled.div`
    background-color: ${({theme}) => theme.backgroundColor };
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const theme = {
    light: {
      backgroundColor: '#ededed',
      foregroundColor: '#f9f9f9',
      boxShadow: '0 1px 3px 0 #999999',
      titleColor: '#212121',
      temperatureColor: '#757575',
      textColor: '#828282',
    },
    dark: {
      backgroundColor: '#1F2022',
      foregroundColor: '#121416',
      boxShadow:
        '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
      titleColor: '#f9f9fa',
      temperatureColor: '#dddddd',
      textColor: '#cccccc',
    },
  };

const WeatherApp = () => {
    console.log('--- invoke function component ---');
    const storageCity = localStorage.getItem('cityName');
    const [ currentCity, setCurrentCity ] = useState(storageCity || '臺北市');
    const [ currentPage, setCurrentPage ] = useState('WeatherCard');
    const currentLocation = findLocation(currentCity) || {};
    const [ weatherElement, fetchData ] = useWeatherApi(currentLocation);
    const [ currentTheme, setCurrentTheme ] = useState('light');
    const moment = useMemo(() => getMoment(currentLocation.sunriseCityName), [currentLocation.sunriseCityName]);

    useEffect(() => {
        setCurrentTheme(moment === 'day' ? 'light' : 'dark' );
    }, [moment]);

    useEffect(() => {
        localStorage.setItem('cityName', currentCity);
    }, [currentCity]);

    return (
        <ThemeProvider theme={theme[currentTheme]}>
            <Container >
                {currentPage === 'WeatherCard' && (
                    <WeatherCard 
                        cityName = {currentLocation.cityName}
                        weatherElement={weatherElement}
                        moment={moment}
                        fetchData={fetchData}
                        setCurrentPage={setCurrentPage}
                    />
                )}
                {currentPage === 'WeatherSetting' && (
                    <WeatherSetting 
                    setCurrentPage={setCurrentPage} 
                    cityName = {currentLocation.cityName} 
                    setCurrentCity = {setCurrentCity}/>
                )}
            </Container>
        </ThemeProvider>
    )
};

export default WeatherApp