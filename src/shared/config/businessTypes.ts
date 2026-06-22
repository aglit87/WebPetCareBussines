// ── Business types — single source of truth for the adaptive cabinet ──
// Choosing a type at registration drives: theme color, nav, label set, services.

export type BusinessType = 'vet' | 'grooming' | 'boarding' | 'taxi';

export interface NavItem {
  id: string;
  label: string;
  icon: string; // Material Symbols name
  badge?: number;
}

export interface BusinessTheme {
  accent: string;
  accentLight: string;
  accentDark: string;
  accentTint: string;
  gradient: string;
  cabinetBg: string;
  sidebarBorder: string;
}

export interface BusinessConfig {
  type: BusinessType;
  label: string; // "Ветеринария"
  noun: string; // "ветклиника"
  tagline: string; // short subtitle on the picker card
  icon: string; // Material Symbols name
  theme: BusinessTheme;
  nav: NavItem[];
  services: string[];
}

const baseNavTail: NavItem[] = [
  { id: 'clients', label: 'Клиенты', icon: 'group' },
  { id: 'income', label: 'Доходы', icon: 'payments' },
  { id: 'reviews', label: 'Отзывы', icon: 'reviews' },
];

export const BUSINESS_CONFIGS: Record<BusinessType, BusinessConfig> = {
  vet: {
    type: 'vet',
    label: 'Ветеринария',
    noun: 'ветклиника',
    tagline: 'Приём, вакцинация, УЗИ, анализы',
    icon: 'stethoscope',
    theme: {
      accent: '#2F58B0',
      accentLight: '#3D6FD6',
      accentDark: '#24407A',
      accentTint: '#E7EEFB',
      gradient: 'linear-gradient(135deg, #3D6FD6, #2F58B0)',
      cabinetBg: '#EEF3FA',
      sidebarBorder: '#E2E9F2',
    },
    nav: [
      { id: 'overview', label: 'Обзор', icon: 'space_dashboard' },
      { id: 'records', label: 'Записи', icon: 'event_note', badge: 2 },
      { id: 'schedule', label: 'Расписание', icon: 'calendar_month' },
      ...baseNavTail.slice(0, 1),
      { id: 'services', label: 'Услуги', icon: 'medical_services' },
      ...baseNavTail.slice(1),
    ],
    services: ['Осмотр терапевта', 'Вакцинация', 'УЗИ', 'Чипирование', 'Чистка зубов'],
  },
  grooming: {
    type: 'grooming',
    label: 'Груминг-салон',
    noun: 'груминг-салон',
    tagline: 'Стрижка, мытьё, тримминг',
    icon: 'content_cut',
    theme: {
      accent: '#E5356A',
      accentLight: '#F76095',
      accentDark: '#B5235A',
      accentTint: '#FCE4EC',
      gradient: 'linear-gradient(135deg, #F76095, #E5356A)',
      cabinetBg: '#F6EEF2',
      sidebarBorder: '#EFE2E9',
    },
    nav: [
      { id: 'overview', label: 'Обзор', icon: 'space_dashboard' },
      { id: 'records', label: 'Записи', icon: 'event_note', badge: 3 },
      { id: 'schedule', label: 'Расписание', icon: 'calendar_month' },
      ...baseNavTail.slice(0, 1),
      { id: 'services', label: 'Услуги', icon: 'content_cut' },
      ...baseNavTail.slice(1),
    ],
    services: ['Комплексный груминг', 'Гигиеническая стрижка', 'Мытьё и сушка', 'Тримминг'],
  },
  boarding: {
    type: 'boarding',
    label: 'Передержка',
    noun: 'зоогостиница',
    tagline: 'Размещение и присмотр',
    icon: 'cottage',
    theme: {
      accent: '#3E8C42',
      accentLight: '#5CB85F',
      accentDark: '#2E6B32',
      accentTint: '#E8F3E6',
      gradient: 'linear-gradient(135deg, #5CB85F, #3E8C42)',
      cabinetBg: '#EAF3EC',
      sidebarBorder: '#DDEDE0',
    },
    nav: [
      { id: 'overview', label: 'Обзор', icon: 'space_dashboard' },
      { id: 'records', label: 'Заявки', icon: 'event_note', badge: 2 },
      { id: 'rooms', label: 'Номера', icon: 'meeting_room' },
      ...baseNavTail.slice(0, 1),
      { id: 'services', label: 'Услуги', icon: 'room_service' },
      ...baseNavTail.slice(1),
    ],
    services: ['Стандартный номер', 'Номер «люкс»', 'Выгул премиум', 'Доп. кормление'],
  },
  taxi: {
    type: 'taxi',
    label: 'Зоотакси',
    noun: 'служба зоотакси',
    tagline: 'Перевозка питомцев',
    icon: 'local_taxi',
    theme: {
      accent: '#E07B1E',
      accentLight: '#F0A93E',
      accentDark: '#B5611A',
      accentTint: '#FFF0DB',
      gradient: 'linear-gradient(135deg, #F0A93E, #E07B1E)',
      cabinetBg: '#FBF1E6',
      sidebarBorder: '#F2E6D2',
    },
    nav: [
      { id: 'overview', label: 'Обзор', icon: 'space_dashboard' },
      { id: 'trips', label: 'Поездки', icon: 'route', badge: 4 },
      { id: 'map', label: 'Карта', icon: 'map' },
      { id: 'drivers', label: 'Водители', icon: 'directions_car' },
      ...baseNavTail,
    ],
    services: ['Разовая поездка', 'Поездка туда-обратно', 'Сопровождение', 'Межгород'],
  },
};

export const BUSINESS_ORDER: BusinessType[] = ['vet', 'grooming', 'boarding', 'taxi'];

export const getBusinessConfig = (type: BusinessType): BusinessConfig => BUSINESS_CONFIGS[type];
