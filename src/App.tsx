import React, { useState, useEffect, useRef } from 'react';
import { Camera, MessageCircle, Users, Home, User, Send, Heart, Leaf, Map, Trophy, Zap, MapPin, Gift, Target, Star, Crown, Sparkles, Navigation } from 'lucide-react';
import './App.css';

const DosthApp = () => {
  // Add Leaflet CSS and JS for real mapping
  useEffect(() => {
    const leafletCSS = document.createElement('link');
    leafletCSS.rel = 'stylesheet';
    leafletCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
    document.head.appendChild(leafletCSS);

    const leafletJS = document.createElement('script');
    leafletJS.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
    leafletJS.onload = () => {
      console.log('Leaflet loaded successfully!');
      setLeafletLoaded(true);
    };
    leafletJS.onerror = () => {
      console.error('Failed to load Leaflet');
      setTimeout(() => setLeafletLoaded(true), 3000);
    };
    document.head.appendChild(leafletJS);

    return () => {
      if (document.head.contains(leafletCSS)) document.head.removeChild(leafletCSS);
      if (document.head.contains(leafletJS)) document.head.removeChild(leafletJS);
    };
  }, []);

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [mapType, setMapType] = useState('street');
  const [activeTab, setActiveTab] = useState('home');
  const [currentUser] = useState('Aditya');
  const [userLocation] = useState({ lat: 28.6139, lng: 77.2090, name: 'New Delhi' });
  
  const [friends, setFriends] = useState([
    {
      id: 1, name: 'Meera', avatar: '👩‍💻', treeLevel: 3, dayStreak: 8, lastActive: '2 min ago',
      isOnline: true, location: { lat: 28.6289, lng: 77.2065, name: 'Connaught Place' }, distance: '2.1 km',
      treeType: 'cherry', stories: [{ id: 1, image: '🌅', caption: 'Morning vibes!', timestamp: '8:30 AM', reactions: { heart: 2, fire: 1 } }],
      achievements: ['First Sprout', 'Speed Grower'], friendshipType: 'Study Buddy', mutualInterests: ['coding', 'coffee']
    },
    {
      id: 2, name: 'Rahul', avatar: '👨‍🎨', treeLevel: 1, dayStreak: 2, lastActive: '1 hr ago',
      isOnline: false, location: { lat: 28.5355, lng: 77.3910, name: 'Noida' }, distance: '18.5 km',
      treeType: 'palm', stories: [{ id: 2, image: '☕', caption: 'Coffee break', timestamp: '10:15 AM', reactions: { heart: 1 } }],
      achievements: ['First Sprout'], friendshipType: 'Creative Partner', mutualInterests: ['art', 'music']
    },
    {
      id: 3, name: 'Priya', avatar: '👩‍🔬', treeLevel: 4, dayStreak: 15, lastActive: '30 min ago',
      isOnline: true, location: { lat: 28.4595, lng: 77.0266, name: 'Gurgaon' }, distance: '24.3 km',
      treeType: 'pine', stories: [], achievements: ['First Sprout', 'Tree Grower'], friendshipType: 'Adventure Buddy', mutualInterests: ['hiking', 'science']
    }
  ]);

  const [challenges, setChallenges] = useState([
    { id: 1, title: 'Morning Sunrise', description: 'Share a sunrise photo', reward: '2x Growth', type: 'photo', progress: 0, total: 1, completed: false, emoji: '🌅' },
    { id: 2, title: 'Coffee Connection', description: 'Have a 5-message conversation', reward: 'Golden Leaf', type: 'chat', progress: 2, total: 5, completed: false, emoji: '☕' }
  ]);

  const [messages, setMessages] = useState({
    1: [{ sender: 'Meera', text: 'Hey! Love the sunrise pic 🌅', time: '9:00 AM' }]
  });

  const [newMessage, setNewMessage] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [mapView, setMapView] = useState('map');
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'growth', title: 'Tree Growing! 🌱', message: 'Your tree with Meera leveled up!', time: '2 min ago', read: false }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Initialize map
  const initializeMap = () => {
    if (!leafletLoaded || !mapRef.current || mapInstanceRef.current || !window.L) return;

    try {
      const map = window.L.map(mapRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 12,
        zoomControl: false
      });

      const tileLayer = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Add user marker
      const userIcon = window.L.divIcon({
        className: 'custom-marker',
        html: '<div style="width: 40px; height: 40px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; color: white; border: 3px solid white;">📍</div>',
        iconSize: [40, 40], iconAnchor: [20, 20]
      });

      window.L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup(`<div style="text-align: center; padding: 8px;"><div style="font-size: 24px;">👨‍💻</div><div style="font-weight: bold;">${currentUser}</div></div>`);

      // Add friend markers
      friends.forEach(friend => {
        const friendIcon = window.L.divIcon({
          className: 'custom-marker',
          html: `<div style="width: 32px; height: 32px; background: ${friend.isOnline ? '#10b981' : '#6b7280'}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; color: white; border: 2px solid white;">${friend.avatar}</div>`,
          iconSize: [32, 32], iconAnchor: [16, 16]
        });

        window.L.marker([friend.location.lat, friend.location.lng], { icon: friendIcon })
          .addTo(map)
          .bindPopup(`<div style="text-align: center; padding: 12px;"><div style="font-size: 24px;">${friend.avatar}</div><div style="font-weight: bold;">${friend.name}</div><div style="font-size: 12px;">${friend.location.name}</div></div>`);
      });

      mapInstanceRef.current = { map, tileLayer };
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  useEffect(() => {
    if (leafletLoaded && mapView === 'map' && activeTab === 'map') {
      setTimeout(initializeMap, 500);
    }
  }, [leafletLoaded, mapView, activeTab]);

  useEffect(() => {
    if (activeTab === 'map' && mapView === 'list') {
      setMapView('map');
    }
  }, [activeTab]);

  // Helper functions
  const getTreeEmoji = (level, streak, type = 'default') => {
    if (streak >= 30) return '🌲';
    if (streak >= 14) return '🌴';
    if (streak >= 7) return '🌳';
    if (streak >= 4) return '🌿';
    return '🌱';
  };

  const getTreeName = (streak) => {
    if (streak >= 30) return 'Legendary Tree';
    if (streak >= 14) return 'Majestic Tree';
    if (streak >= 7) return 'Growing Tree';
    if (streak >= 4) return 'Young Plant';
    return 'Fresh Sprout';
  };

  const getGrowthMultiplier = () => {
    const hour = new Date().getHours();
    const isWeekend = [0, 6].includes(new Date().getDay());
    if (isWeekend) return '3x';
    if (hour >= 6 && hour <= 9) return '2x';
    return '1x';
  };

  const addStory = (content) => {
    const multiplier = getGrowthMultiplier();
    const actualGrowth = multiplier === '3x' ? 3 : multiplier === '2x' ? 2 : 1;
    
    setFriends(friends.map(friend => ({
      ...friend,
      dayStreak: friend.dayStreak + actualGrowth
    })));

    setNotifications([{
      id: Date.now(),
      type: 'growth',
      title: `${multiplier} Growth Boost! 🌱`,
      message: `Your trees grew ${multiplier} faster!`,
      time: 'Just now',
      read: false
    }, ...notifications]);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedFriend) return;
    
    const updatedMessages = {
      ...messages,
      [selectedFriend.id]: [
        ...(messages[selectedFriend.id] || []),
        { sender: 'Aditya', text: newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]
    };
    setMessages(updatedMessages);
    setNewMessage('');

    setFriends(friends.map(friend => 
      friend.id === selectedFriend.id 
        ? { ...friend, dayStreak: friend.dayStreak + 1 }
        : friend
    ));
  };

  // Render functions
  const renderHome = () => (
    <div className="p-4 space-y-6">
      <div className={`${getGrowthMultiplier() === '3x' ? 'bg-gradient-to-r from-purple-400 to-pink-500' : getGrowthMultiplier() === '2x' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-green-400 to-blue-500'} rounded-2xl p-4`}>
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="text-3xl animate-bounce">
              {getGrowthMultiplier() === '3x' ? '🎉' : getGrowthMultiplier() === '2x' ? '🌅' : '🌱'}
            </div>
            <div>
              <p className="font-bold text-lg">{getGrowthMultiplier()} Growth Active!</p>
              <p className="text-sm opacity-90">
                {getGrowthMultiplier() === '3x' ? 'Weekend vibes!' : getGrowthMultiplier() === '2x' ? 'Morning magic!' : 'Keep growing!'}
              </p>
            </div>
          </div>
          <Zap size={24} className="animate-pulse" />
        </div>
      </div>

      <div>
        <h3 className="font-bold text-lg mb-3 text-gray-800 flex items-center gap-2">
          🌳 Your Friendship Forest
        </h3>
        <div className="space-y-3">
          {friends.map(friend => (
            <div key={friend.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="text-3xl">{friend.avatar}</div>
                    {friend.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-ping"></div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{friend.name}</p>
                    <p className="text-sm text-gray-500">{friend.distance} away • {friend.lastActive}</p>
                  </div>
                </div>
                <div className="text-4xl">
                  {getTreeEmoji(friend.treeLevel, friend.dayStreak, friend.treeType)}
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{getTreeName(friend.dayStreak)}</p>
                    <p className="text-xs text-gray-500">{friend.dayStreak} days of growth</p>
                  </div>
                  <button 
                    onClick={() => { setSelectedFriend(friend); setActiveTab('chat'); }}
                    className="p-2 bg-white rounded-full shadow-sm hover:bg-blue-50"
                  >
                    <MessageCircle size={16} className="text-blue-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCamera = () => (
    <div className="p-6 text-center space-y-6">
      <div className="bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 rounded-3xl p-8 relative overflow-hidden">
        <div className="relative z-10">
          <Camera size={64} className="mx-auto text-white mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold text-white mb-2">Capture & Grow! 📸</h2>
          <p className="text-pink-100">Share moments, grow friendships!</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {['🌅', '☕', '🍕', '🎵', '💫', '🌈', '📚', '🎯', '⚡'].map((emoji, i) => (
          <button
            key={i}
            onClick={() => addStory(emoji)}
            className="bg-white rounded-2xl p-6 text-4xl hover:bg-gray-50 border-2 border-gray-100 transition-all hover:scale-110"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );

  const renderMap = () => (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Friend Finder 🗺️</h2>
          <p className="text-sm text-gray-500">Discover nearby friends</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
            <MapPin size={24} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">You're in {userLocation.name}</p>
            <p className="text-sm text-gray-500">📍 Ready to connect with nearby friends</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <h3 className="font-bold text-lg text-gray-800 mb-3">🗺️ Live Friend Map</h3>
        
        {!leafletLoaded ? (
          <div className="w-full h-80 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <div className="text-4xl mb-2 animate-bounce">🗺️</div>
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading interactive map...</p>
            </div>
          </div>
        ) : (
          <div>
            <div ref={mapRef} className="w-full h-80 bg-gray-100 rounded-xl" style={{ minHeight: '320px' }}></div>
            <div className="mt-2 text-center">
              <p className="text-xs text-green-600 font-medium">✅ Interactive map loaded!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderChat = () => (
    <div className="flex flex-col h-full">
      {!selectedFriend ? (
        <div className="p-4 space-y-4">
          <h3 className="font-bold text-lg text-gray-800">Your Friends</h3>
          <div className="space-y-2">
            {friends.map(friend => (
              <button
                key={friend.id}
                onClick={() => setSelectedFriend(friend)}
                className="w-full bg-white rounded-2xl p-4 border hover:bg-gray-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{friend.avatar}</div>
                  <div className="text-left">
                    <p className="font-semibold">{friend.name}</p>
                    <p className="text-sm text-gray-500">{friend.lastActive}</p>
                  </div>
                  <div className="ml-auto text-2xl">{getTreeEmoji(friend.treeLevel, friend.dayStreak)}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="bg-gray-50 border-b p-4 flex items-center gap-3">
            <button onClick={() => setSelectedFriend(null)} className="text-blue-500">← Back</button>
            <div className="text-xl">{selectedFriend.avatar}</div>
            <div>
              <p className="font-semibold">{selectedFriend.name}</p>
              <p className="text-sm text-gray-500">{selectedFriend.dayStreak} day friendship</p>
            </div>
          </div>

          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {(messages[selectedFriend.id] || []).map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'Aditya' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs p-3 rounded-2xl ${msg.sender === 'Aditya' ? 'bg-blue-500 text-white' : 'bg-white border'}`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'Aditya' ? 'text-blue-200' : 'text-gray-500'}`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border-t p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message ${selectedFriend.name}...`}
                className="flex-1 p-3 border rounded-full focus:outline-none focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="p-4 space-y-6">
      <div className="bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-3xl p-6 text-white text-center">
        <div className="text-6xl mb-3">👨‍💻</div>
        <h2 className="text-2xl font-bold mb-2">{currentUser}</h2>
        <p className="text-purple-100">Tree Tender • Growth Guru</p>
      </div>

      <div className="bg-white rounded-2xl p-4 border">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Leaf size={20} className="text-green-500" />
          Friendship Stats
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center bg-green-50 rounded-xl p-3">
            <p className="text-3xl font-bold text-green-600">{friends.length}</p>
            <p className="text-sm text-green-700">Active Friends</p>
          </div>
          <div className="text-center bg-blue-50 rounded-xl p-3">
            <p className="text-3xl font-bold text-blue-600">{friends.filter(f => f.dayStreak >= 7).length}</p>
            <p className="text-sm text-blue-700">Growing Trees</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen flex flex-col">
      <div className="bg-white shadow-sm p-4 flex items-center justify-center border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <Leaf size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
            Dosth
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'home' && renderHome()}
        {activeTab === 'camera' && renderCamera()}
        {activeTab === 'map' && renderMap()}
        {activeTab === 'chat' && renderChat()}
        {activeTab === 'profile' && renderProfile()}
      </div>

      {showNotifications && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50" onClick={() => setShowNotifications(false)}>
          <div className="bg-white rounded-t-3xl p-4 w-full max-h-96 overflow-y-auto">
            <h3 className="font-bold text-lg mb-4">Notifications</h3>
            <div className="space-y-3">
              {notifications.map(notification => (
                <div key={notification.id} className="p-3 rounded-xl bg-blue-50">
                  <p className="font-medium text-sm">{notification.title}</p>
                  <p className="text-xs text-gray-600">{notification.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border-t px-4 py-2 shadow-lg">
        <div className="flex justify-around">
          {[
            { id: 'home', icon: Home, label: 'Home', color: 'from-green-400 to-blue-500' },
            { id: 'camera', icon: Camera, label: 'Snap', color: 'from-purple-400 to-pink-500' },
            { id: 'map', icon: Map, label: 'Friends', color: 'from-blue-400 to-indigo-500' },
            { id: 'chat', icon: MessageCircle, label: 'Chat', color: 'from-teal-400 to-green-500' },
            { id: 'profile', icon: User, label: 'Profile', color: 'from-orange-400 to-red-500' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${activeTab === tab.id ? `bg-gradient-to-br ${tab.color} text-white shadow-lg` : 'text-gray-400 hover:text-gray-600'}`}
            >
              <tab.icon size={20} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DosthApp;
