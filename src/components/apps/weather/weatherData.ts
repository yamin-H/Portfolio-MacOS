export interface HourlyForecast {
  time: string
  tempF: number
  tempC: number
  condition: 'sunny' | 'cloudy' | 'rain' | 'night-rain' | 'partly-cloudy' | 'thunder'
  popPercent?: number
}

export interface DayForecast {
  day: string
  condition: 'sunny' | 'cloudy' | 'rain' | 'partly-cloudy' | 'thunder'
  minTempF: number
  maxTempF: number
  minTempC: number
  maxTempC: number
}

export interface CityWeather {
  id: string
  name: string
  countryOrState: string
  isCurrentLocation?: boolean
  currentTempF: number
  currentTempC: number
  condition: string
  conditionType: 'sunny' | 'cloudy' | 'rain' | 'night-rain' | 'partly-cloudy' | 'thunder'
  highF: number
  lowF: number
  highC: number
  lowC: number
  advisory?: string
  airQualityIndex: number
  airQualityStatus: 'Good' | 'Moderate' | 'Unhealthy'
  airQualityDescription: string
  windSpeedMph: number
  windGustsMph: number
  windDirectionDeg: number
  windDirectionText: string
  uvIndex: number
  uvStatus: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extreme'
  uvDescription: string
  uvPeakTime: string
  uvComparison: string
  precipitationTodayInches: number
  precipitation10DayDesc: string
  humidityPercent: number
  dewPointF: number
  dewPointC: number
  visibilityMiles: number
  pressureInHg: number
  sunrise: string
  sunset: string
  feelsLikeF: number
  feelsLikeC: number
  hourly: HourlyForecast[]
  forecast10Day: DayForecast[]
}

export const CITIES_WEATHER: CityWeather[] = [
  {
    id: 'cupertino',
    name: 'Cupertino',
    countryOrState: 'California, US',
    isCurrentLocation: true,
    currentTempF: 68,
    currentTempC: 20,
    condition: 'Sunny',
    conditionType: 'sunny',
    highF: 89,
    lowF: 55,
    highC: 32,
    lowC: 13,
    advisory: 'Heat Advisory in effect until 8:00 PM PDT',
    airQualityIndex: 24,
    airQualityStatus: 'Good',
    airQualityDescription: 'Air quality index is 24, which is about the same as yesterday at about this time.',
    windSpeedMph: 3,
    windGustsMph: 6,
    windDirectionDeg: 0,
    windDirectionText: '0° N',
    uvIndex: 4,
    uvStatus: 'Moderate',
    uvDescription: 'Use sun protection until 6PM. Levels of Moderate or higher are reached from 10AM to 6PM.',
    uvPeakTime: '12:00 PM',
    uvComparison: 'The peak UV index today is similar to yesterday.',
    precipitationTodayInches: 0,
    precipitation10DayDesc: 'None expected in next 10 days.',
    humidityPercent: 48,
    dewPointF: 48,
    dewPointC: 9,
    visibilityMiles: 10,
    pressureInHg: 29.98,
    sunrise: '6:48 AM',
    sunset: '7:32 PM',
    feelsLikeF: 68,
    feelsLikeC: 20,
    hourly: [
      { time: 'Now', tempF: 68, tempC: 20, condition: 'sunny' },
      { time: '10 AM', tempF: 69, tempC: 21, condition: 'sunny' },
      { time: '11 AM', tempF: 74, tempC: 23, condition: 'sunny' },
      { time: '12 PM', tempF: 79, tempC: 26, condition: 'sunny' },
      { time: '1 PM', tempF: 84, tempC: 29, condition: 'sunny' },
      { time: '2 PM', tempF: 88, tempC: 31, condition: 'sunny' },
      { time: '3 PM', tempF: 89, tempC: 32, condition: 'sunny' },
      { time: '4 PM', tempF: 87, tempC: 31, condition: 'sunny' },
      { time: '5 PM', tempF: 83, tempC: 28, condition: 'sunny' },
      { time: '6 PM', tempF: 78, tempC: 26, condition: 'sunny' },
      { time: '7 PM', tempF: 72, tempC: 22, condition: 'sunny' },
      { time: '8 PM', tempF: 66, tempC: 19, condition: 'sunny' },
    ],
    forecast10Day: [
      { day: 'Today', condition: 'sunny', minTempF: 55, maxTempF: 82, minTempC: 13, maxTempC: 28 },
      { day: 'Wed', condition: 'sunny', minTempF: 55, maxTempF: 87, minTempC: 13, maxTempC: 31 },
      { day: 'Thu', condition: 'partly-cloudy', minTempF: 59, maxTempF: 88, minTempC: 15, maxTempC: 31 },
      { day: 'Fri', condition: 'sunny', minTempF: 60, maxTempF: 85, minTempC: 16, maxTempC: 29 },
      { day: 'Sat', condition: 'sunny', minTempF: 60, maxTempF: 83, minTempC: 16, maxTempC: 28 },
      { day: 'Sun', condition: 'sunny', minTempF: 58, maxTempF: 80, minTempC: 14, maxTempC: 27 },
      { day: 'Mon', condition: 'sunny', minTempF: 57, maxTempF: 81, minTempC: 14, maxTempC: 27 },
      { day: 'Tue', condition: 'sunny', minTempF: 57, maxTempF: 80, minTempC: 14, maxTempC: 27 },
      { day: 'Wed', condition: 'sunny', minTempF: 57, maxTempF: 81, minTempC: 14, maxTempC: 27 },
      { day: 'Thu', condition: 'sunny', minTempF: 54, maxTempF: 80, minTempC: 12, maxTempC: 27 },
    ],
  },
  {
    id: 'rajshahi',
    name: 'Rajshahi',
    countryOrState: 'Bangladesh (Home)',
    isCurrentLocation: false,
    currentTempF: 84,
    currentTempC: 29,
    condition: 'Clear Sky',
    conditionType: 'sunny',
    highF: 92,
    lowF: 73,
    highC: 33,
    lowC: 23,
    advisory: 'Optimal weather for outdoor software development',
    airQualityIndex: 42,
    airQualityStatus: 'Good',
    airQualityDescription: 'Air quality is satisfactory and poses little or no risk.',
    windSpeedMph: 5,
    windGustsMph: 8,
    windDirectionDeg: 140,
    windDirectionText: '140° SE',
    uvIndex: 7,
    uvStatus: 'High',
    uvDescription: 'Protection against sun damage needed. Wear sunglasses and SPF 30+.',
    uvPeakTime: '1:00 PM',
    uvComparison: 'UV intensity is consistent with seasonal averages.',
    precipitationTodayInches: 0,
    precipitation10DayDesc: 'Isolated showers possible next Monday.',
    humidityPercent: 62,
    dewPointF: 68,
    dewPointC: 20,
    visibilityMiles: 9,
    pressureInHg: 29.89,
    sunrise: '5:54 AM',
    sunset: '6:02 PM',
    feelsLikeF: 88,
    feelsLikeC: 31,
    hourly: [
      { time: 'Now', tempF: 84, tempC: 29, condition: 'sunny' },
      { time: '1 PM', tempF: 88, tempC: 31, condition: 'sunny' },
      { time: '2 PM', tempF: 91, tempC: 33, condition: 'sunny' },
      { time: '3 PM', tempF: 92, tempC: 33, condition: 'sunny' },
      { time: '4 PM', tempF: 89, tempC: 32, condition: 'sunny' },
      { time: '5 PM', tempF: 85, tempC: 29, condition: 'sunny' },
      { time: '6 PM', tempF: 81, tempC: 27, condition: 'sunny' },
      { time: '7 PM', tempF: 78, tempC: 26, condition: 'sunny' },
      { time: '8 PM', tempF: 76, tempC: 24, condition: 'sunny' },
    ],
    forecast10Day: [
      { day: 'Today', condition: 'sunny', minTempF: 73, maxTempF: 92, minTempC: 23, maxTempC: 33 },
      { day: 'Thu', condition: 'sunny', minTempF: 74, maxTempF: 93, minTempC: 23, maxTempC: 34 },
      { day: 'Fri', condition: 'partly-cloudy', minTempF: 75, maxTempF: 91, minTempC: 24, maxTempC: 33 },
      { day: 'Sat', condition: 'sunny', minTempF: 74, maxTempF: 90, minTempC: 23, maxTempC: 32 },
      { day: 'Sun', condition: 'sunny', minTempF: 73, maxTempF: 89, minTempC: 23, maxTempC: 32 },
      { day: 'Mon', condition: 'rain', minTempF: 72, maxTempF: 86, minTempC: 22, maxTempC: 30 },
      { day: 'Tue', condition: 'partly-cloudy', minTempF: 73, maxTempF: 88, minTempC: 23, maxTempC: 31 },
      { day: 'Wed', condition: 'sunny', minTempF: 74, maxTempF: 90, minTempC: 23, maxTempC: 32 },
    ],
  },
  {
    id: 'new-york',
    name: 'New York',
    countryOrState: 'New York, US',
    currentTempF: 71,
    currentTempC: 22,
    condition: 'Passing Showers',
    conditionType: 'rain',
    highF: 75,
    lowF: 66,
    highC: 24,
    lowC: 19,
    airQualityIndex: 38,
    airQualityStatus: 'Good',
    airQualityDescription: 'Air quality is within normal healthy parameters.',
    windSpeedMph: 8,
    windGustsMph: 14,
    windDirectionDeg: 80,
    windDirectionText: '80° E',
    uvIndex: 2,
    uvStatus: 'Low',
    uvDescription: 'Minimal sun protection required under cloud cover.',
    uvPeakTime: '1:30 PM',
    uvComparison: 'Lower than yesterday due to rain clouds.',
    precipitationTodayInches: 0.35,
    precipitation10DayDesc: 'Rain continuing through tomorrow morning.',
    humidityPercent: 82,
    dewPointF: 65,
    dewPointC: 18,
    visibilityMiles: 6,
    pressureInHg: 30.04,
    sunrise: '6:42 AM',
    sunset: '6:58 PM',
    feelsLikeF: 72,
    feelsLikeC: 22,
    hourly: [
      { time: 'Now', tempF: 71, tempC: 22, condition: 'rain' },
      { time: '11 AM', tempF: 72, tempC: 22, condition: 'rain' },
      { time: '12 PM', tempF: 74, tempC: 23, condition: 'rain' },
      { time: '1 PM', tempF: 75, tempC: 24, condition: 'cloudy' },
      { time: '2 PM', tempF: 74, tempC: 23, condition: 'cloudy' },
      { time: '3 PM', tempF: 72, tempC: 22, condition: 'partly-cloudy' },
    ],
    forecast10Day: [
      { day: 'Today', condition: 'rain', minTempF: 66, maxTempF: 75, minTempC: 19, maxTempC: 24 },
      { day: 'Wed', condition: 'partly-cloudy', minTempF: 64, maxTempF: 78, minTempC: 18, maxTempC: 26 },
      { day: 'Thu', condition: 'sunny', minTempF: 62, maxTempF: 80, minTempC: 17, maxTempC: 27 },
      { day: 'Fri', condition: 'sunny', minTempF: 65, maxTempF: 82, minTempC: 18, maxTempC: 28 },
    ],
  },
  {
    id: 'london',
    name: 'London',
    countryOrState: 'United Kingdom',
    currentTempF: 70,
    currentTempC: 21,
    condition: 'Overcast',
    conditionType: 'cloudy',
    highF: 72,
    lowF: 58,
    highC: 22,
    lowC: 14,
    airQualityIndex: 28,
    airQualityStatus: 'Good',
    airQualityDescription: 'Air quality is good across central London.',
    windSpeedMph: 7,
    windGustsMph: 12,
    windDirectionDeg: 240,
    windDirectionText: '240° WSW',
    uvIndex: 3,
    uvStatus: 'Moderate',
    uvDescription: 'Moderate UV index during midday breaks.',
    uvPeakTime: '1:00 PM',
    uvComparison: 'Average for late spring.',
    precipitationTodayInches: 0.05,
    precipitation10DayDesc: 'Drizzle possible Thursday afternoon.',
    humidityPercent: 70,
    dewPointF: 56,
    dewPointC: 13,
    visibilityMiles: 8,
    pressureInHg: 30.12,
    sunrise: '6:51 AM',
    sunset: '7:02 PM',
    feelsLikeF: 70,
    feelsLikeC: 21,
    hourly: [
      { time: 'Now', tempF: 70, tempC: 21, condition: 'cloudy' },
      { time: '1 PM', tempF: 71, tempC: 22, condition: 'cloudy' },
      { time: '2 PM', tempF: 72, tempC: 22, condition: 'cloudy' },
      { time: '3 PM', tempF: 71, tempC: 22, condition: 'partly-cloudy' },
      { time: '4 PM', tempF: 69, tempC: 21, condition: 'cloudy' },
    ],
    forecast10Day: [
      { day: 'Today', condition: 'cloudy', minTempF: 58, maxTempF: 72, minTempC: 14, maxTempC: 22 },
      { day: 'Wed', condition: 'cloudy', minTempF: 56, maxTempF: 70, minTempC: 13, maxTempC: 21 },
      { day: 'Thu', condition: 'rain', minTempF: 54, maxTempF: 68, minTempC: 12, maxTempC: 20 },
    ],
  },
  {
    id: 'paris',
    name: 'Paris',
    countryOrState: 'France',
    currentTempF: 69,
    currentTempC: 21,
    condition: 'Partly Cloudy',
    conditionType: 'partly-cloudy',
    highF: 74,
    lowF: 56,
    highC: 23,
    lowC: 13,
    airQualityIndex: 30,
    airQualityStatus: 'Good',
    airQualityDescription: 'Air quality is good.',
    windSpeedMph: 4,
    windGustsMph: 9,
    windDirectionDeg: 190,
    windDirectionText: '190° S',
    uvIndex: 4,
    uvStatus: 'Moderate',
    uvDescription: 'Moderate sun intensity in open plazas.',
    uvPeakTime: '1:45 PM',
    uvComparison: 'Slightly higher than yesterday.',
    precipitationTodayInches: 0,
    precipitation10DayDesc: 'Dry conditions through the weekend.',
    humidityPercent: 58,
    dewPointF: 52,
    dewPointC: 11,
    visibilityMiles: 10,
    pressureInHg: 30.18,
    sunrise: '7:08 AM',
    sunset: '7:28 PM',
    feelsLikeF: 69,
    feelsLikeC: 21,
    hourly: [
      { time: 'Now', tempF: 69, tempC: 21, condition: 'partly-cloudy' },
      { time: '1 PM', tempF: 71, tempC: 22, condition: 'partly-cloudy' },
      { time: '2 PM', tempF: 73, tempC: 23, condition: 'sunny' },
      { time: '3 PM', tempF: 74, tempC: 23, condition: 'sunny' },
    ],
    forecast10Day: [
      { day: 'Today', condition: 'partly-cloudy', minTempF: 56, maxTempF: 74, minTempC: 13, maxTempC: 23 },
      { day: 'Wed', condition: 'sunny', minTempF: 58, maxTempF: 76, minTempC: 14, maxTempC: 24 },
    ],
  },
  {
    id: 'beijing',
    name: 'Beijing',
    countryOrState: 'China',
    currentTempF: 80,
    currentTempC: 27,
    condition: 'Night Showers',
    conditionType: 'night-rain',
    highF: 85,
    lowF: 72,
    highC: 29,
    lowC: 22,
    airQualityIndex: 58,
    airQualityStatus: 'Moderate',
    airQualityDescription: 'Air quality is acceptable for most people.',
    windSpeedMph: 6,
    windGustsMph: 11,
    windDirectionDeg: 40,
    windDirectionText: '40° NE',
    uvIndex: 0,
    uvStatus: 'Low',
    uvDescription: 'Night time UV level is 0.',
    uvPeakTime: '12:30 PM tomorrow',
    uvComparison: 'Night time.',
    precipitationTodayInches: 0.42,
    precipitation10DayDesc: 'Thunderstorms tapering off overnight.',
    humidityPercent: 78,
    dewPointF: 68,
    dewPointC: 20,
    visibilityMiles: 7,
    pressureInHg: 29.84,
    sunrise: '6:12 AM',
    sunset: '6:24 PM',
    feelsLikeF: 82,
    feelsLikeC: 28,
    hourly: [
      { time: 'Now', tempF: 80, tempC: 27, condition: 'night-rain' },
      { time: '10 PM', tempF: 79, tempC: 26, condition: 'night-rain' },
      { time: '11 PM', tempF: 78, tempC: 26, condition: 'night-rain' },
      { time: '12 AM', tempF: 76, tempC: 24, condition: 'cloudy' },
    ],
    forecast10Day: [
      { day: 'Today', condition: 'rain', minTempF: 72, maxTempF: 85, minTempC: 22, maxTempC: 29 },
      { day: 'Wed', condition: 'partly-cloudy', minTempF: 70, maxTempF: 88, minTempC: 21, maxTempC: 31 },
    ],
  },
]
