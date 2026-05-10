import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudSun, Droplets, Wind, CloudRain, Cloud, Sun, MapPin, RefreshCw, AlertCircle } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { useFarmerContext } from '../../context/FarmerContext';
import { useNavigate } from 'react-router-dom';

export const WeatherWidget = () => {
  const navigate = useNavigate();
  const { currentUser } = useFarmerContext();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pincode, setPincode] = useState(null);

  const fetchWeather = async (targetPincode) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await apiService.getWeather(targetPincode, token);
      
      if (response.success) {
        setWeather(response.data);
        // Cache weather for 15 minutes
        localStorage.setItem('cached_weather', JSON.stringify({
          data: response.data,
          timestamp: Date.now(),
          pincode: targetPincode
        }));
      } else {
        setError(response.message || 'Failed to fetch weather');
      }
    } catch (err) {
      setError('Connection error. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Determine the pincode to use
    const userPincode = currentUser?.pincode;
    setPincode(userPincode);

    if (!userPincode) {
      setLoading(false);
      return;
    }

    // Check cache
    const cached = localStorage.getItem('cached_weather');
    if (cached) {
      const { data, timestamp, pincode: cachedPincode } = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > 15 * 60 * 1000;
      
      if (!isExpired && cachedPincode === userPincode) {
        setWeather(data);
        setLoading(false);
        return;
      }
    }

    fetchWeather(userPincode);
  }, [currentUser?.pincode]);

  const getWeatherIcon = (condition, className = "w-6 h-6") => {
    const c = condition?.toLowerCase() || '';
    if (c.includes('rain')) return <CloudRain className={className} />;
    if (c.includes('cloud')) return <CloudSun className={className} />;
    if (c.includes('clear') || c.includes('sun')) return <Sun className={className} />;
    return <Cloud className={className} />;
  };

  if (!pincode) {
    return (
      <WeatherCardWrapper title="Weather">
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-6">
          <div className="p-4 bg-white/5 rounded-full border border-dashed border-white/10">
            <MapPin className="w-8 h-8 text-white/20" />
          </div>
          <div>
            <p className="text-sm font-bold text-white/60">No Pincode Found</p>
            <p className="text-[10px] text-white/20 mt-1 max-w-[200px]">Add your farm pincode in settings to view live weather updates.</p>
          </div>
          <button 
            onClick={() => navigate('/profile')}
            className="text-[10px] font-black uppercase tracking-widest text-green-400 hover:text-green-300 transition-colors"
          >
            Update Profile
          </button>
        </div>
      </WeatherCardWrapper>
    );
  }

  if (loading && !weather) {
    return (
      <WeatherCardWrapper title="Weather">
        <div className="flex flex-col gap-6 py-4">
          <div className="flex items-center gap-4 animate-pulse">
            <div className="w-16 h-16 bg-white/5 rounded-2xl" />
            <div className="space-y-2">
              <div className="w-24 h-8 bg-white/5 rounded-lg" />
              <div className="w-16 h-3 bg-white/5 rounded-md" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-4 bg-white/5 rounded-md animate-pulse" />
            <div className="h-4 bg-white/5 rounded-md animate-pulse" />
          </div>
          <div className="flex justify-between gap-2 pt-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-10 h-16 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </WeatherCardWrapper>
    );
  }

  if (error && !weather) {
    return (
      <WeatherCardWrapper title="Weather">
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-6">
          <AlertCircle className="w-10 h-10 text-red-500/40" />
          <p className="text-xs font-bold text-white/40">{error}</p>
          <button 
            onClick={() => fetchWeather(pincode)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:bg-white/10"
          >
            <RefreshCw className="w-3 h-3" />
            Retry
          </button>
        </div>
      </WeatherCardWrapper>
    );
  }

  return (
    <WeatherCardWrapper title={`Weather • ${(weather?.location || pincode)?.toString().replace(/\s*\(demo\)/gi, '')}`}>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col h-full"
      >
        <div className="flex items-center gap-4 mb-4 shrink-0">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="p-3 lg:p-4 bg-green-500/10 rounded-2xl border border-green-500/10"
          >
            {getWeatherIcon(weather?.condition, "w-8 h-8 text-green-400")}
          </motion.div>
          <div>
            <p className="text-3xl lg:text-4xl font-black">{weather?.temperature}°C</p>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{weather?.condition}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-6 shrink-0">
          <WeatherDetail icon={<Droplets className="w-3 h-3 text-green-400/40" />} label="Humidity" value={`${weather?.humidity}%`} />
          <WeatherDetail icon={<Wind className="w-3 h-3 text-green-400/40" />} label="Wind" value={`${weather?.wind} km/h`} />
        </div>

        <div className="flex justify-between items-end gap-1 flex-1 min-h-0 pt-2">
          {weather?.forecast?.map((day, idx) => (
            <ForecastDay 
              key={idx}
              day={day.day} 
              icon={getWeatherIcon(day.condition, `w-4 h-4 ${idx === 0 ? 'text-green-400' : 'text-white/20'}`)} 
              temp={day.temp} 
              active={idx === 0} 
            />
          ))}
        </div>
      </motion.div>
    </WeatherCardWrapper>
  );
};

const WeatherCardWrapper = ({ title, children }) => (
  <div className="xl:col-span-5 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl lg:rounded-[1.5rem] p-4 lg:p-6 shadow-xl flex flex-col min-h-[240px] lg:min-h-0 relative overflow-hidden group">
    {/* Subtle animated background based on group hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    <h3 className="text-xs lg:text-lg font-bold uppercase tracking-wider text-white/60 mb-4 shrink-0 relative z-10">{title}</h3>
    <div className="flex-1 flex flex-col relative z-10">
      {children}
    </div>
  </div>
);

const WeatherDetail = ({ icon, label, value }) => (
  <div className="flex items-center gap-2">
    <div className="shrink-0">{icon}</div>
    <div className="flex justify-between items-center w-full min-w-0 border-b border-white/5 pb-1">
      <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest truncate mr-2">{label}</span>
      <span className="text-[11px] font-black text-white/80 shrink-0">{value}</span>
    </div>
  </div>
);

const ForecastDay = ({ day, icon, temp, active }) => (
  <div className={`flex flex-col items-center gap-3 p-2.5 rounded-2xl transition-all flex-1 min-w-0 ${active ? 'bg-green-500/10 border border-green-500/20' : 'hover:bg-white/5 border border-transparent'}`}>
    <span className={`text-[9px] font-black uppercase tracking-widest ${active ? 'text-green-400' : 'text-white/20'}`}>{day}</span>
    <motion.div
      animate={active ? { y: [0, -2, 0] } : {}}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      {icon}
    </motion.div>
    <span className="text-[9px] font-black text-white/60">{temp}</span>
  </div>
);
