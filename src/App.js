import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';

// 載入圖示
import { ReactComponent as DayCloudyIcon } from './images/day-cloudy.svg'
import { ReactComponent as AirFlowIcon } from './images/airFlow.svg'
import { ReactComponent as RainIcon } from './images/rain.svg'
import { ReactComponent as RefreshIcon } from './images/refresh.svg'

// Step1: 載入 emotion 的 styled 套件
import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';

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

// Step2: 定義帶有 styled 的 component
const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherCard = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 30px 15px;
`;

const Location = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 20px;
`;

const Description = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: ${({ theme }) => theme.temperatureColor};
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 20px;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Refresh = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: ${({ theme }) => theme.textColor};

  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
  }
`;

const DayCloudy = styled(DayCloudyIcon)`
  flex-basis: 30%;
`;

const AUTHORIZATION_KEY = process.env.REACT_APP_CWB_API_KEY;
const LOCATION_NAME = '臺北';

const App = () => {
  console.log('invoke function component')
  const [currentTheme, setCurrentTheme] = useState('light');

  // 定義會使用到的資料狀態
  const [currentWeather, setCurrentWeather] = useState({
    locationName: '臺北市',
    description: '多雲時晴',
    windSpeed: 1.1,
    temperature: 22.9,
    rainPossibility: 48.3,
    observationTime: '2020-12-22 22:10:00',
  });

  // 加入 useEffect 方法，參數是需要放入函式
  useEffect(() => {
    console.log('execute function in useEffect');
    fetchCurrentWeather();
  }, []);

  const fetchCurrentWeather = () => {
    fetch(
      `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${AUTHORIZATION_KEY}&format=JSON&locationName=${LOCATION_NAME}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log('data', data)
        const locationData = data.records.location[0];
        const weatherElements = locationData.weatherElement.reduce(
          (neededElements, item) => {
            if (['WDSD', 'TEMP'].includes(item.elementName)) {
              neededElements[item.elementName] = item.elementValue;
            }

            return neededElements;
          }, {}
        ); // => { WDSD: 1.10, TEMP: 33.20 }
        setCurrentWeather({
          observationTime: locationData.time.obsTime,
          locationName: locationData.locationName,
          temperature: weatherElements.TEMP,
          windSpeed: weatherElements.WDSD,
          description: '多雲時晴',
          rainPossibility: 60,
        });
      });
  };
  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {console.log('render')}
        <WeatherCard>
          <Location>{currentWeather.locationName}</Location>
          <Description>{currentWeather.description}</Description>
          <CurrentWeather>
            <Temperature>
              {Math.round(currentWeather.temperature)} <Celsius>°C</Celsius>
            </Temperature>
            <DayCloudy />
          </CurrentWeather>
          <AirFlow>
            <AirFlowIcon /> {currentWeather.windSpeed} m/h
        </AirFlow>
          <Rain>
            <RainIcon /> {currentWeather.rainPossibility}%
        </Rain>
          <Refresh onClick={fetchCurrentWeather}>
            最後觀察時間：{
              // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
              new Intl.DateTimeFormat('zh-TW', {
                hour: 'numeric',
                minute: 'numeric',
              }).format(dayjs(currentWeather.observationTime))}
            {' '} {/* 最後在頁面上元件與元件間保留空格 */}
            <RefreshIcon />
          </Refresh>
        </WeatherCard>
      </Container>
    </ThemeProvider>
  );
};

export default App;
