export const saveToLocalStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Ошибка при сохранении данных в localStorage:', error);
    }
  };
  
  export const loadFromLocalStorage = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.error('Ошибка при загрузки данных из localStorage:', error);
      return defaultValue;
    }
  };