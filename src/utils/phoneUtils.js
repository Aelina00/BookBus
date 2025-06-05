export const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    
    if (cleaned.startsWith('996')) {
      return '+' + cleaned;
    } else if (cleaned.startsWith('0')) {
      return '+996' + cleaned.substring(1);
    } else if (cleaned.length <= 9) {
      return '+996' + cleaned;
    }
    
    return '+' + cleaned;
  };
  
  export const isValidPhone = (phone) => {
    const phoneRegex = /^\+996[0-9]{9}$/;
    return phoneRegex.test(phone);
  };
  
  export const maskPhoneNumber = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 12 && cleaned.startsWith('996')) {
      return `+996 ${cleaned.slice(3, 6)} *** ***`;
    }
    return phone;
  };