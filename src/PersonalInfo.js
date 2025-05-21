// Создайте новый файл PersonalInfo.js и добавьте следующий компонент:
import React, { useState } from 'react';
import { Mail, Phone, Lock } from 'lucide-react';

const PersonalInfo = ({ initialInfo, t, onInfoChange, onSubmit }) => {
  const [personalInfo, setPersonalInfo] = useState(initialInfo || {
    firstName: '',
    lastName: '',
    phone: ''
  });

  // Валидация номера телефона
  const validatePhoneNumber = (phone) => {
    // Упрощенное выражение для формата +996 и минимум 9 цифр после
    return /^\+996\d{9,}$/.test(phone);
  };

  // Обработчик изменения информации
  const handleInfoChange = (field, value) => {
    // Специальная обработка телефона
    if (field === 'phone') {
      // Разрешаем ввод только цифр и символа + для телефона
      if (/^(\+996|)([0-9]*)$/.test(value)) {
        const newInfo = { ...personalInfo, [field]: value };
        setPersonalInfo(newInfo);
        onInfoChange && onInfoChange(newInfo);
      }
    } else {
      // Для других полей
      const newInfo = { ...personalInfo, [field]: value };
      setPersonalInfo(newInfo);
      onInfoChange && onInfoChange(newInfo);
    }
  };

  // Обработчик отправки формы
  const handleSubmit = () => {
    // Проверка заполнения всех полей
    if (!personalInfo.firstName || !personalInfo.lastName || !personalInfo.phone) {
      alert(t.fillAllFields);
      return;
    }

    // Проверка формата телефона
    if (!validatePhoneNumber(personalInfo.phone)) {
      alert(t.invalidPhone);
      return;
    }

    onSubmit && onSubmit(personalInfo);
  };

  return (
    <div className="space-y-4">
      <h2 className="font-medium">{t.personalData}</h2>
      
      <input
        type="text"
        placeholder={t.firstName}
        className="w-full p-3 border border-gray-300 rounded-lg"
        value={personalInfo.firstName}
        onChange={(e) => handleInfoChange('firstName', e.target.value)}
      />

      <input
        type="text"
        placeholder={t.lastName}
        className="w-full p-3 border border-gray-300 rounded-lg"
        value={personalInfo.lastName}
        onChange={(e) => handleInfoChange('lastName', e.target.value)}
      />

      <div className="relative">
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
          <Phone size={20} className="text-gray-400 mr-2" />
          <input
            type="tel"
            className="w-full focus:outline-none"
            placeholder="+996 XXX XXX XXX"
            value={personalInfo.phone}
            onChange={(e) => handleInfoChange('phone', e.target.value)}
          />
        </div>
        {!validatePhoneNumber(personalInfo.phone) && personalInfo.phone && (
          <div className="absolute -bottom-5 left-0 text-xs text-red-500">
            {t.invalidPhone}
          </div>
        )}
      </div>

      <button
        className="mt-6 w-full bg-blue-600 text-white rounded-lg py-3 font-medium"
        onClick={handleSubmit}
      >
        {t.continueButton}
      </button>
    </div>
  );
};

export default PersonalInfo;