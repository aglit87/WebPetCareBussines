export interface PasswordRule {
  id: string;
  label: string;
  test: (value: string) => boolean;
}

/** Правила пароля по best practice: длина + все классы символов. */
export const PASSWORD_RULES: PasswordRule[] = [
  { id: 'length', label: 'Минимум 8 символов', test: (v) => v.length >= 8 },
  { id: 'lower', label: 'Строчная буква (a-z)', test: (v) => /[a-z]/.test(v) },
  { id: 'upper', label: 'Заглавная буква (A-Z)', test: (v) => /[A-Z]/.test(v) },
  { id: 'digit', label: 'Цифра (0-9)', test: (v) => /\d/.test(v) },
  { id: 'special', label: 'Спецсимвол (!@#$%^&*…)', test: (v) => /[^A-Za-z0-9]/.test(v) },
];

export const isPasswordValid = (value: string): boolean => PASSWORD_RULES.every((rule) => rule.test(value));
