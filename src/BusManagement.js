// Обновленный компонент BusManagement.js с поддержкой localStorage
import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';

// Функции для работы с localStorage
const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Ошибка при сохранении данных в localStorage:', error);
  }
};

const loadFromLocalStorage = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error('Ошибка при загрузке данных из localStorage:', error);
    return defaultValue;
  }
};

// Компонент для управления рейсами
const BusManagement = ({ initialBuses, routes, t, onBusesChange }) => {
  // Локальное состояние для рейсов, инициализируем из localStorage
  const [localBuses, setLocalBuses] = useState(() => {
    return loadFromLocalStorage('buses', initialBuses);
  });
  
  const [showAddBusForm, setShowAddBusForm] = useState(false);
  const [newBusData, setNewBusData] = useState({
    routeId: '',
    date: '',
    departureTime: '',
    arrivalTime: '',
    busNumber: '',
    totalSeats: 51,
    vehicleType: 'автобус'
  });

  // Передаем изменения в родительский компонент и сохраняем в localStorage
  useEffect(() => {
    if (onBusesChange) {
      onBusesChange(localBuses);
    }
    // Сохраняем в localStorage
    saveToLocalStorage('buses', localBuses);
  }, [localBuses, onBusesChange]);

  // Добавление нового рейса
  const handleAddBus = () => {
    if (!newBusData.routeId || !newBusData.date || !newBusData.departureTime || !newBusData.arrivalTime || !newBusData.busNumber) {
      alert(t.fillAllFields);
      return;
    }

    const routeId = parseInt(newBusData.routeId);
    const route = routes.find(r => r.id === routeId);

    if (!route) {
      alert('Выбранный маршрут не существует');
      return;
    }

    // Создаем уникальный ID для нового рейса
    let maxBusId = 0;
    Object.values(localBuses).forEach(busesForDate => {
      busesForDate.forEach(bus => {
        if (bus.id > maxBusId) maxBusId = bus.id;
      });
    });
    const newBusId = maxBusId + 1;

    const newBus = {
      id: newBusId,
      routeId: routeId,
      departureTime: newBusData.departureTime,
      arrivalTime: newBusData.arrivalTime,
      busNumber: newBusData.busNumber,
      carrier: "ОсОО \"GOBUS\"",
      totalSeats: parseInt(newBusData.totalSeats),
      availableSeats: parseInt(newBusData.totalSeats),
      vehicleType: newBusData.vehicleType
    };

    // Используем функциональное обновление состояния
    setLocalBuses(prevBuses => {
      const newBuses = { ...prevBuses };
      
      if (!newBuses[newBusData.date]) {
        newBuses[newBusData.date] = [];
      }
      
      newBuses[newBusData.date] = [...newBuses[newBusData.date], newBus];
      
      // Сохраняем изменения в localStorage
      saveToLocalStorage('buses', newBuses);
      
      return newBuses;
    });

    // Очищаем форму
    setNewBusData({
      routeId: '',
      date: '',
      departureTime: '',
      arrivalTime: '',
      busNumber: '',
      totalSeats: 51,
      vehicleType: 'автобус'
    });
    
    setShowAddBusForm(false);
    alert('Рейс успешно добавлен!');
  };

  // Удаление рейса
  const handleDeleteBus = (date, busId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот рейс?')) {
      // Используем функциональное обновление состояния
      setLocalBuses(prevBuses => {
        // Создаем новый объект, чтобы не мутировать состояние
        const newBuses = { ...prevBuses };
        
        // Удаляем рейс
        if (newBuses[date] && Array.isArray(newBuses[date])) {
          newBuses[date] = newBuses[date].filter(bus => bus.id !== busId);
          
          // Если для даты не осталось рейсов, удаляем дату
          if (newBuses[date].length === 0) {
            delete newBuses[date];
          }
        }
        
        console.log('Обновленные рейсы после удаления:', newBuses);
        
        // Сохраняем изменения в localStorage
        saveToLocalStorage('buses', newBuses);
        
        return newBuses;
      });
      
      alert('Рейс успешно удален!');
    }
  };

  // Сброс всех рейсов к исходным значениям
  const resetBuses = () => {
    if (window.confirm('Вы уверены, что хотите сбросить все данные рейсов к начальным значениям?')) {
      setLocalBuses(initialBuses);
      saveToLocalStorage('buses', initialBuses);
      alert('Данные рейсов сброшены к исходным значениям.');
    }
  };

  // Форматирование даты для отображения
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;
  };

  // Форматирование даты для хранения
  const formatDateForStorage = (dateString) => {
    if (!dateString) return '';
    
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <button
          className="mb-4 bg-blue-500 text-white rounded-lg py-2 px-4 flex items-center"
          onClick={() => setShowAddBusForm(!showAddBusForm)}
        >
          <Plus size={20} className="mr-2" />
          {showAddBusForm ? t.cancel : t.addNewBus}
        </button>
        
        <button
          className="mb-4 bg-red-500 text-white rounded-lg py-2 px-4"
          onClick={resetBuses}
        >
          Сбросить данные рейсов
        </button>
      </div>

      {showAddBusForm && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-medium mb-4">{t.addingNewBus}</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.route}</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={newBusData.routeId}
                onChange={(e) => setNewBusData({ ...newBusData, routeId: e.target.value })}
              >
                <option value="">{t.selectRoute}</option>
                {routes.map(route => (
                  <option key={route.id} value={route.id}>
                    {route.from} - {route.to}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.date}</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={formatDateForInput(newBusData.date)}
                onChange={(e) => {
                  const newDate = formatDateForStorage(e.target.value);
                  setNewBusData({ ...newBusData, date: newDate });
                }}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.departureTime}</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="23:00"
                  value={newBusData.departureTime}
                  onChange={(e) => setNewBusData({ ...newBusData, departureTime: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.arrivalTime}</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="06:10"
                  value={newBusData.arrivalTime}
                  onChange={(e) => setNewBusData({ ...newBusData, arrivalTime: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.busNumber}</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="01KG123ABC"
                  value={newBusData.busNumber}
                  onChange={(e) => setNewBusData({ ...newBusData, busNumber: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.seatsCount}</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={newBusData.totalSeats}
                  onChange={(e) => setNewBusData({ ...newBusData, totalSeats: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.vehicleType}</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={newBusData.vehicleType}
                onChange={(e) => setNewBusData({ ...newBusData, vehicleType: e.target.value })}
              >
                <option value="автобус">Автобус</option>
                <option value="маршрутка">Маршрутка</option>
              </select>
            </div>

            <button
              className="w-full bg-blue-600 text-white rounded-lg py-2"
              onClick={handleAddBus}
            >
              {t.addBus}
            </button>
          </div>
        </div>
      )}

      <h2 className="font-bold text-lg mt-6 mb-3">Существующие рейсы</h2>
      <div className="space-y-4 pb-20">
        {Object.keys(localBuses).length > 0 ? (
          Object.keys(localBuses)
            .sort((a, b) => {
              // Сортировка дат от новых к старым
              const dateA = new Date(a.split('-').reverse().join('-'));
              const dateB = new Date(b.split('-').reverse().join('-'));
              return dateB - dateA;
            })
            .map(busDate => (
              localBuses[busDate].length > 0 && (
                <div key={busDate} className="mb-4">
                  <h3 className="font-medium border-b pb-2">{busDate}</h3>
                  <div className="space-y-2 mt-2">
                    {localBuses[busDate].map(bus => (
                      <div key={bus.id} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">
                              {routes.find(r => r.id === bus.routeId)?.from} - {routes.find(r => r.id === bus.routeId)?.to}
                            </div>
                            <div className="text-sm text-gray-500">{bus.departureTime} - {bus.arrivalTime}</div>
                          </div>
                          <div className="text-sm">
                            {t.busNumber}: {bus.busNumber}
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between">
                          <div className="text-sm">
                            {t.available}: {bus.availableSeats} / {bus.totalSeats}
                          </div>
                          <button
                            className="text-red-500 text-sm"
                            onClick={() => handleDeleteBus(busDate, bus.id)}
                          >
                            {t.delete}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))
        ) : (
          <div className="text-center p-8 text-gray-500">
            Пока нет добавленных рейсов
          </div>
        )}
      </div>
    </div>
  );
};

export default BusManagement;