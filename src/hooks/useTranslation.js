import { useState, useEffect } from 'react';
import { translations, getTranslation } from '../utils/translations';
import storageService from '../services/storage';

export const useTranslation = () => {
  const [language, setLanguage] = useState('ru');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLang = await storageService.getItem('selectedLanguage', 'ru');
      setLanguage(savedLang);
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const changeLanguage = async (newLang) => {
    try {
      setLanguage(newLang);
      await storageService.setItem('selectedLanguage', newLang);
      console.log('Language changed to:', newLang);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const t = (key) => {
    return getTranslation(key, language);
  };

  return {
    language,
    changeLanguage,
    t,
    translations: translations[language] || translations.ru
  };
};