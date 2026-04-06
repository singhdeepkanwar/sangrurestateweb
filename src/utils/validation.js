const RESTRICTED_WORDS = [
  'abuse', 'scam', 'fraud', 'hate', 'stupid', 'idiot', 'sex', 'adult', 'kill',
];

export function containsRestrictedContent(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return RESTRICTED_WORDS.some((word) => lower.includes(word));
}

export function validateField(value, fieldName) {
  if (containsRestrictedContent(value)) {
    return `${fieldName} contains inappropriate content.`;
  }
  return null;
}

export function validatePhone(phone) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10) return 'Enter a valid 10-digit phone number.';
  return null;
}

export function validateOtp(otp) {
  if (!otp || otp.replace(/\D/g, '').length < 4) return 'Enter the complete OTP.';
  return null;
}
