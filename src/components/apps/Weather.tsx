'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSun,
  Wind,
  Compass,
  Eye,
  Droplets,
  Thermometer,
  Gauge,
  Sunrise,
  Sunset,
  MapPin,
  Search,
  PanelLeft,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  X,
  AlertTriangle,
  Navigation,
  Calendar,
  Layers,
} from 'lucide-react'
import { useWindowContext } from '@/app/components/os/Window'
import { soundEngine } from '@/lib/sound/soundEngine'
import TrafficLights from '@/components/os/TrafficLights'
import {
  CITIES_WEATHER,
  CityWeather,
  DayForecast,
  HourlyForecast,
} from './weather/weatherData'

export default function Weather() {
  const windowContext = useWindowContext()

  // ── State ──────────────────────────────────────────────────────────────────
  const [selectedCityId, setSelectedCityId] = useState<string>('cupertino')
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true)
  const [tempUnit, setTempUnit] = useState<'F' | 'C'>('F')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isUVModalOpen, setIsUVModalOpen] = useState<boolean>(false)
  const [activeDateIndex, setActiveDateIndex] = useState<number>(1) // Tuesday Apr 1

  // Current active city object
  const activeCity: CityWeather = useMemo(() => {
    return CITIES_WEATHER.find((c) => c.id === selectedCityId) || CITIES_WEATHER[0]
  }, [selectedCityId])

  // Filtered cities in sidebar based on search query
  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return CITIES_WEATHER
    const q = searchQuery.toLowerCase()
    return CITIES_WEATHER.filter(
      (c) => c.name.toLowerCase().includes(q) || c.countryOrState.toLowerCase().includes(q)
    )
  }, [searchQuery])

  // Format temperature based on unit
  const formatTemp = (tempF: number, tempC: number) => {
    return tempUnit === 'F' ? `${Math.round(tempF)}°` : `${Math.round(tempC)}°`
  }

  // Weather icon helper
  const renderWeatherIcon = (
    condition: 'sunny' | 'cloudy' | 'rain' | 'night-rain' | 'partly-cloudy' | 'thunder',
    size = 18,
    color = '#FFB800'
  ) => {
    switch (condition) {
      case 'sunny':
        return <Sun size={size} color={color} />
      case 'cloudy':
        return <Cloud size={size} color="#8E8E93" />
      case 'rain':
        return <CloudRain size={size} color="#007AFF" />
      case 'night-rain':
        return <CloudRain size={size} color="#5856D6" />
      case 'partly-cloudy':
        return <CloudSun size={size} color={color} />
      default:
        return <Sun size={size} color={color} />
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        backgroundColor: '#2478B4',
        backgroundImage: 'linear-gradient(180deg, #1C6EA4 0%, #2A88C8 40%, #5BA4D8 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
        userSelect: 'none',
        overflow: 'hidden',
        position: 'relative',
        color: '#FFFFFF',
      }}
    >
      {/* ─── ATMOSPHERIC SUN FLARE BACKGROUND EFFECT ─────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: -120,
          left: '35%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 235, 170, 0.45) 0%, rgba(255, 255, 255, 0.15) 35%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(30px)',
          zIndex: 0,
        }}
      />

      {/* ─── 1. LEFT SIDEBAR: MULTI-CITY LIST (MATCHING REFERENCE 1) ─────────── */}
      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            style={{
              height: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.22)',
              backdropFilter: 'blur(40px) saturate(180%)',
              borderRight: '1px solid rgba(255, 255, 255, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 0,
              zIndex: 10,
              overflow: 'hidden',
            }}
          >
            {/* Sidebar Titlebar & Search */}
            <div
              onPointerDown={(e) => windowContext?.handleTitlePointerDown(e)}
              style={{
                padding: '12px 14px 8px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              {/* Traffic Lights */}
              <TrafficLights />

              {/* Search Cities Input */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  backgroundColor: 'rgba(0, 0, 0, 0.18)',
                  borderRadius: 8,
                  padding: '5px 10px',
                  fontSize: 12,
                }}
              >
                <Search size={13} color="rgba(255, 255, 255, 0.7)" />
                <input
                  type="text"
                  placeholder="Search for a city"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#FFFFFF',
                    fontSize: 12,
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{ border: 'none', background: 'transparent', color: '#FFF', cursor: 'pointer', padding: 0 }}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* City List (Matching Reference 1 exactly!) */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px 10px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filteredCities.map((city) => {
                const isSelected = selectedCityId === city.id
                return (
                  <div
                    key={city.id}
                    onClick={() => {
                      soundEngine.play('click')
                      setSelectedCityId(city.id)
                    }}
                    style={{
                      borderRadius: 12,
                      padding: '10px 12px',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.32)' : 'rgba(255, 255, 255, 0.12)',
                      border: isSelected ? '1px solid rgba(255, 255, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: isSelected ? '0 4px 16px rgba(0, 0, 0, 0.18)' : 'none',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontSize: 13.5, fontWeight: 600 }}>{city.name}</span>
                        {city.isCurrentLocation && <Navigation size={10} color="#FFFFFF" />}
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.75)', marginTop: 2 }}>
                        {city.condition}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ transform: 'scale(1.1)' }}>
                        {renderWeatherIcon(city.conditionType, 20)}
                      </div>
                      <div style={{ fontSize: 20, fontWeight: 600, minWidth: 42, textAlign: 'right' }}>
                        {formatTemp(city.currentTempF, city.currentTempC)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Sidebar Bottom Footer: Open Weather attribution */}
            <div
              style={{
                padding: '8px 14px',
                borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                fontSize: 11,
                color: 'rgba(255, 255, 255, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>Apple Weather Service</span>
              <span style={{ cursor: 'pointer', textDecoration: 'underline' }}>Open Weather</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 2. MAIN WEATHER CANVAS (MATCHING REFERENCE 2 FULL DASHBOARD) ────── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Top Navigation & Header Toolbar */}
        <div
          onPointerDown={(e) => windowContext?.handleTitlePointerDown(e)}
          style={{
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
            flexShrink: 0,
          }}
        >
          {/* Left: Sidebar Toggle + Location Arrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              title="Toggle City Sidebar"
              style={{
                width: 28,
                height: 26,
                borderRadius: 6,
                border: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PanelLeft size={15} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={14} color="#FFFFFF" />
              <span style={{ fontSize: 13, fontWeight: 600 }}>{activeCity.name}</span>
            </div>
          </div>

          {/* Right: Temperature Unit Switcher (°F / °C) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              borderRadius: 6,
              padding: '2px',
            }}
          >
            <button
              onClick={() => {
                soundEngine.play('click')
                setTempUnit('F')
              }}
              style={{
                border: 'none',
                backgroundColor: tempUnit === 'F' ? 'rgba(255, 255, 255, 0.35)' : 'transparent',
                color: '#FFFFFF',
                fontSize: 11.5,
                fontWeight: tempUnit === 'F' ? 700 : 400,
                padding: '2px 8px',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              °F
            </button>
            <button
              onClick={() => {
                soundEngine.play('click')
                setTempUnit('C')
              }}
              style={{
                border: 'none',
                backgroundColor: tempUnit === 'C' ? 'rgba(255, 255, 255, 0.35)' : 'transparent',
                color: '#FFFFFF',
                fontSize: 11.5,
                fontWeight: tempUnit === 'C' ? 700 : 400,
                padding: '2px 8px',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              °C
            </button>
          </div>
        </div>

        {/* Scrollable Weather Content Stage */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          {/* Main Hero Header: My Location, City, Temp, Condition, High/Low */}
          <div style={{ textAlign: 'center', margin: '4px 0 10px 0' }}>
            <div style={{ fontSize: 11.5, letterSpacing: '0.08em', fontWeight: 600, opacity: 0.85 }}>
              {activeCity.isCurrentLocation ? 'MY LOCATION' : activeCity.countryOrState.toUpperCase()}
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 700, margin: '2px 0 4px 0', letterSpacing: '-0.02em' }}>
              {activeCity.name}
            </h1>
            <div style={{ fontSize: 16, fontWeight: 500, opacity: 0.95 }}>
              {formatTemp(activeCity.currentTempF, activeCity.currentTempC)} | {activeCity.condition}
            </div>
            <div style={{ fontSize: 12.5, opacity: 0.8, marginTop: 4 }}>
              H:{formatTemp(activeCity.highF, activeCity.highC)} L:{formatTemp(activeCity.lowF, activeCity.lowC)}
            </div>
          </div>

          {/* Advisory Alert (Matching Reference 1!) */}
          {activeCity.advisory && (
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: 14,
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              <AlertTriangle size={16} color="#FFD60A" />
              <span>{activeCity.advisory}</span>
            </div>
          )}

          {/* Hourly Forecast Carousel (Matching Reference 1 & 2!) */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.18)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              borderRadius: 16,
              padding: '12px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div style={{ fontSize: 11.5, fontWeight: 600, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Sunny conditions will continue all afternoon.
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                overflowX: 'auto',
                gap: 16,
                paddingBottom: 4,
              }}
            >
              {activeCity.hourly.map((h, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    minWidth: 44,
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 500 }}>{h.time}</span>
                  <div>{renderWeatherIcon(h.condition, 20)}</div>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{formatTemp(h.tempF, h.tempC)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ─── 3. GRID OF DETAIL CARDS (10-DAY FORECAST, AIR QUALITY, UV, WIND, RADAR) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 16,
              alignItems: 'start',
            }}
          >
            {/* ── CARD A: 10-DAY FORECAST (MATCHING REFERENCE 2!) ── */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                borderRadius: 16,
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 700, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <Calendar size={13} />
                <span>10-Day Forecast</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {activeCity.forecast10Day.map((d, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '50px 24px 34px 1fr 34px',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 12.5,
                      fontWeight: 500,
                    }}
                  >
                    <span>{d.day}</span>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      {renderWeatherIcon(d.condition, 16)}
                    </div>
                    <span style={{ textAlign: 'right', opacity: 0.7 }}>
                      {formatTemp(d.minTempF, d.minTempC)}
                    </span>

                    {/* Horizontal Temperature Range Colored Bar */}
                    <div
                      style={{
                        height: 4,
                        borderRadius: 3,
                        backgroundColor: 'rgba(0, 0, 0, 0.25)',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          left: `${((d.minTempF - 50) / 50) * 100}%`,
                          right: `${100 - ((d.maxTempF - 50) / 50) * 100}%`,
                          top: 0,
                          bottom: 0,
                          background: 'linear-gradient(90deg, #30D158 0%, #FFD60A 50%, #FF9F0A 100%)',
                          borderRadius: 3,
                        }}
                      />
                      {idx === 0 && (
                        <div
                          style={{
                            position: 'absolute',
                            left: `${((activeCity.currentTempF - 50) / 50) * 100}%`,
                            top: -2,
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: '#FFFFFF',
                            boxShadow: '0 0 4px rgba(0,0,0,0.5)',
                          }}
                        />
                      )}
                    </div>

                    <span style={{ textAlign: 'right', fontWeight: 600 }}>
                      {formatTemp(d.maxTempF, d.maxTempC)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── CARD B: AIR QUALITY (MATCHING REFERENCE 2!) ── */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                borderRadius: 16,
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: 170,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 700, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <Wind size={13} />
                  <span>Air Quality</span>
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, marginTop: 6 }}>
                  {activeCity.airQualityIndex} · {activeCity.airQualityStatus}
                </div>
              </div>

              <div>
                {/* Rainbow Color Scale Bar */}
                <div
                  style={{
                    height: 5,
                    borderRadius: 3,
                    background: 'linear-gradient(90deg, #30D158 0%, #FFD60A 25%, #FF9F0A 50%, #FF453A 75%, #BF5AF2 100%)',
                    position: 'relative',
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: `${Math.min(100, (activeCity.airQualityIndex / 100) * 100)}%`,
                      top: -3,
                      width: 11,
                      height: 11,
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                    }}
                  />
                </div>
                <div style={{ fontSize: 11.5, opacity: 0.8, lineHeight: 1.4 }}>
                  {activeCity.airQualityDescription}
                </div>
              </div>
            </div>

            {/* ── CARD C: WIND WITH COMPASS ── */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                borderRadius: 16,
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: 170,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 700, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <Compass size={13} />
                <span>Wind</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700 }}>
                    {activeCity.windSpeedMph} <span style={{ fontSize: 14, fontWeight: 400 }}>mph</span>
                  </div>
                  <div style={{ fontSize: 11.5, opacity: 0.8, marginTop: 4 }}>
                    Gusts: {activeCity.windGustsMph} mph
                  </div>
                  <div style={{ fontSize: 11.5, opacity: 0.8 }}>
                    Direction: {activeCity.windDirectionText}
                  </div>
                </div>

                {/* Rotating Compass Indicator */}
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ position: 'absolute', top: 2, fontSize: 8, fontWeight: 700 }}>N</span>
                  <span style={{ position: 'absolute', bottom: 2, fontSize: 8, fontWeight: 700 }}>S</span>
                  <span style={{ position: 'absolute', left: 4, fontSize: 8, fontWeight: 700 }}>W</span>
                  <span style={{ position: 'absolute', right: 4, fontSize: 8, fontWeight: 700 }}>E</span>
                  <motion.div
                    animate={{ rotate: activeCity.windDirectionDeg }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    style={{
                      width: 2,
                      height: 38,
                      backgroundColor: '#FF453A',
                      borderRadius: 1,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ── CARD D: UV INDEX (CLICKABLE TO OPEN INTERACTIVE SPLINE POPOVER!) ── */}
            <div
              onClick={() => {
                soundEngine.play('pop')
                setIsUVModalOpen(true)
              }}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                borderRadius: 16,
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: 170,
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 700, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <Sun size={13} />
                    <span>UV Index</span>
                  </div>
                  <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.2)' }}>
                    Tap to expand
                  </span>
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, marginTop: 6 }}>
                  {activeCity.uvIndex} · {activeCity.uvStatus}
                </div>
              </div>

              <div>
                <div
                  style={{
                    height: 5,
                    borderRadius: 3,
                    background: 'linear-gradient(90deg, #30D158 0%, #FFD60A 35%, #FF9F0A 60%, #FF453A 85%, #BF5AF2 100%)',
                    position: 'relative',
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: `${Math.min(100, (activeCity.uvIndex / 12) * 100)}%`,
                      top: -3,
                      width: 11,
                      height: 11,
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                    }}
                  />
                </div>
                <div style={{ fontSize: 11.5, opacity: 0.8 }}>
                  {activeCity.uvDescription}
                </div>
              </div>
            </div>

            {/* ── CARD E: WEATHER RADAR / PRECIPITATION MAP ── */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                borderRadius: 16,
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: 170,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Radar Background Mockup */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0.35,
                  backgroundImage: 'radial-gradient(circle, rgba(0,122,255,0.6) 10%, transparent 60%)',
                  backgroundSize: '80px 80px',
                }}
              />
              <div style={{ zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 700, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <Layers size={13} />
                  <span>Precipitation Map</span>
                </div>
                <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.2)' }}>
                  Live Radar
                </span>
              </div>

              <div style={{ zIndex: 1 }}>
                <div style={{ fontSize: 20, fontWeight: 700 }}>
                  {activeCity.precipitationTodayInches}&quot;
                </div>
                <div style={{ fontSize: 11.5, opacity: 0.85, marginTop: 2 }}>
                  {activeCity.precipitation10DayDesc}
                </div>
              </div>
            </div>

            {/* ── CARD F: SUNSET & SUNRISE ── */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                borderRadius: 16,
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: 170,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 700, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <Sunset size={13} />
                <span>Sunset</span>
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700 }}>{activeCity.sunset}</div>
                <div style={{ fontSize: 11.5, opacity: 0.8, marginTop: 4 }}>
                  Sunrise: {activeCity.sunrise}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 4. INTERACTIVE UV INDEX POPOVER MODAL (MATCHING REFERENCE 2!) ───── */}
      <AnimatePresence>
        {isUVModalOpen && (
          <div
            onClick={() => setIsUVModalOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
              backdropFilter: 'blur(15px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              style={{
                width: 380,
                backgroundColor: '#122D4F',
                backgroundImage: 'linear-gradient(180deg, #153A66 0%, #0F223D 100%)',
                borderRadius: 20,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 24px 70px rgba(0, 0, 0, 0.65)',
                padding: '20px',
                color: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                position: 'relative',
              }}
            >
              {/* Popover Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}>
                  <Sun size={15} color="#FFD60A" />
                  <span>UV Index</span>
                </div>
                <button
                  onClick={() => setIsUVModalOpen(false)}
                  style={{
                    border: 'none',
                    background: 'rgba(255, 255, 255, 0.15)',
                    color: '#FFFFFF',
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={13} />
                </button>
              </div>

              {/* Day Scrubber: M T W T F S S M */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px', fontSize: 11, color: 'rgba(255, 255, 255, 0.6)' }}>
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M'].map((d, i) => (
                    <span key={i} style={{ width: 28, textAlign: 'center' }}>{d}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  {[31, 1, 2, 3, 4, 5, 6, 7].map((num, i) => {
                    const isSelected = activeDateIndex === i
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          soundEngine.play('click')
                          setActiveDateIndex(i)
                        }}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          border: 'none',
                          backgroundColor: isSelected ? '#007AFF' : 'transparent',
                          color: '#FFFFFF',
                          fontSize: 12,
                          fontWeight: isSelected ? 700 : 500,
                          cursor: 'pointer',
                        }}
                      >
                        {num}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Date Header with Arrow Controls */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  padding: '6px 12px',
                  borderRadius: 8,
                }}
              >
                <button
                  onClick={() => {
                    soundEngine.play('click')
                    setActiveDateIndex((prev) => Math.max(0, prev - 1))
                  }}
                  style={{ border: 'none', background: 'transparent', color: '#FFF', cursor: 'pointer' }}
                >
                  <ChevronLeft size={16} />
                </button>
                <span style={{ fontSize: 12.5, fontWeight: 600 }}>Tuesday, April 1, 2025</span>
                <button
                  onClick={() => {
                    soundEngine.play('click')
                    setActiveDateIndex((prev) => Math.min(7, prev + 1))
                  }}
                  style={{ border: 'none', background: 'transparent', color: '#FFF', cursor: 'pointer' }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Peak Reading: 12:00 PM / 9 Very High (Matching Reference 2!) */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.65)' }}>12:00 PM</div>
                <div style={{ fontSize: 28, fontWeight: 700, margin: '2px 0' }}>9 Very High</div>
              </div>

              {/* Beautiful Spline Bell Curve Chart (SVG) */}
              <div style={{ position: 'relative', width: '100%', height: 160 }}>
                <svg width="100%" height="160" viewBox="0 0 340 160" fill="none">
                  {/* Grid Lines */}
                  {[0, 30, 60, 90, 120, 150].map((y, i) => (
                    <line key={i} x1="0" y1={y} x2="340" y2={y} stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="3 3" />
                  ))}

                  {/* Gradient Fill under the Bell Curve */}
                  <defs>
                    <linearGradient id="uvGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FF2D55" stopOpacity="0.85" />
                      <stop offset="50%" stopColor="#FF9F0A" stopOpacity="0.65" />
                      <stop offset="85%" stopColor="#30D158" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#30D158" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Spline Path */}
                  <path
                    d="M 10 150 C 70 150, 100 130, 130 90 C 150 40, 160 20, 180 20 C 200 20, 210 40, 230 90 C 260 130, 290 150, 330 150 Z"
                    fill="url(#uvGradient)"
                  />
                  <path
                    d="M 10 150 C 70 150, 100 130, 130 90 C 150 40, 160 20, 180 20 C 200 20, 210 40, 230 90 C 260 130, 290 150, 330 150"
                    stroke="#FF453A"
                    strokeWidth="3"
                    fill="none"
                  />

                  {/* Vertical Scrubber Line & Dot at Peak (12 PM) */}
                  <line x1="180" y1="0" x2="180" y2="150" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="4 2" />
                  <circle cx="180" cy="20" r="5" fill="#FFFFFF" stroke="#FF2D55" strokeWidth="2" />
                </svg>

                {/* X Axis Time Labels */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255, 255, 255, 0.5)', marginTop: 2 }}>
                  <span>12 AM</span>
                  <span>6 AM</span>
                  <span style={{ color: '#FFF', fontWeight: 600 }}>12 PM</span>
                  <span>6 PM</span>
                  <span>12 AM</span>
                </div>
              </div>

              {/* Explanatory Summaries (Matching Reference 2!) */}
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: 12 }}>
                <div style={{ fontSize: 11.5, fontWeight: 600 }}>Today, 12:00 PM</div>
                <div style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.75)', marginTop: 3, lineHeight: 1.4 }}>
                  Sun protection strongly recommended. Levels of Moderate or higher are reached from 10AM to 6PM.
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11.5, fontWeight: 600 }}>Daily Comparison</div>
                <div style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.75)', marginTop: 3 }}>
                  The peak UV index today is similar to yesterday.
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
