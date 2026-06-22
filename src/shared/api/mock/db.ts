import type { BusinessType } from '@/shared/config/businessTypes';
import type { DashboardDTO } from '@/entities/dashboard';
import type { RecordsDTO } from '@/entities/records';
import type { ClientsDTO } from '@/entities/clients';
import type { ScheduleDTO } from '@/entities/schedule';
import type { ServicesDTO } from '@/entities/services';
import type { IncomeDTO } from '@/entities/income';
import type { ReviewsDTO } from '@/entities/reviews';
import type { RoomsDTO } from '@/entities/rooms';
import type { DriversDTO } from '@/entities/drivers';
import { loadPersisted, savePersisted } from './persist';

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=120&q=75`;

// Per-type mock dashboards — this is what makes the cabinet "adapt" to the chosen business.
export const dashboardDb: Record<BusinessType, DashboardDTO> = {
  vet: {
    title: 'Обзор',
    subtitle: 'Клиника «ВетДоктор» · вторник, 24 июня',
    stats: [
      { id: 's1', icon: 'event_available', iconColor: '#2F58B0', iconTint: '#E7EEFB', value: '8', label: 'записей сегодня', delta: '+3' },
      { id: 's2', icon: 'payments', iconColor: '#4F9A52', iconTint: '#E8F3E6', value: '24 600 ₽', label: 'доход за день', delta: '+12%' },
      { id: 's3', icon: 'fiber_new', iconColor: '#E5356A', iconTint: '#FCE4EC', value: '2', label: 'новые заявки' },
      { id: 's4', icon: 'star', iconColor: '#E8902B', iconTint: '#FFF0DB', value: '4,9', label: 'рейтинг · 214 отзывов' },
    ],
    today: [
      { id: 't1', time: '14:00', pet: 'Мявра · осмотр', client: 'Анна Кузнецова', service: 'Осмотр терапевта', amount: '800 ₽', status: 'paid', avatar: img('photo-1605568427561-40dd23c2acea') },
      { id: 't2', time: '15:30', pet: 'Рекс · вакцинация', client: 'Игорь Петров', service: 'Вакцинация', amount: '1 200 ₽', status: 'onsite', avatar: img('photo-1561037404-61cd46aa615b') },
      { id: 't3', time: '16:30', pet: 'Барсик · УЗИ', client: 'Мария Соколова', service: 'УЗИ', amount: '1 500 ₽', status: 'onsite', avatar: img('photo-1574158622682-e40e69881006') },
    ],
    requests: [
      { id: 'r1', pet: 'Мявра · осмотр', client: 'Анна Кузнецова', when: 'Завтра 14:00', amount: '800 ₽', avatar: img('photo-1605568427561-40dd23c2acea') },
      { id: 'r2', pet: 'Рекс · вакцинация', client: 'Игорь Петров', when: '27 июня 11:30', amount: '1 200 ₽', avatar: img('photo-1561037404-61cd46aa615b') },
    ],
  },
  grooming: {
    title: 'Обзор',
    subtitle: 'Груминг-салон «Лапки и Хвост» · вторник, 24 июня',
    stats: [
      { id: 's1', icon: 'content_cut', iconColor: '#E5356A', iconTint: '#FCE4EC', value: '12', label: 'стрижек сегодня', delta: '+4' },
      { id: 's2', icon: 'payments', iconColor: '#4F9A52', iconTint: '#E8F3E6', value: '31 200 ₽', label: 'доход за день', delta: '+9%' },
      { id: 's3', icon: 'groups', iconColor: '#2F58B0', iconTint: '#E7EEFB', value: '3 / 4', label: 'мастера в работе' },
      { id: 's4', icon: 'star', iconColor: '#E8902B', iconTint: '#FFF0DB', value: '4,8', label: 'рейтинг · 168 отзывов' },
    ],
    today: [
      { id: 't1', time: '12:00', pet: 'Бьянка · комплекс', client: 'Мастер Ольга', service: 'Комплексный груминг', amount: '2 400 ₽', status: 'onsite', avatar: img('photo-1583512603805-3cc6b41f3edb') },
      { id: 't2', time: '13:30', pet: 'Рекс · гигиеническая', client: 'Мастер Дмитрий', service: 'Стрижка', amount: '1 100 ₽', status: 'paid', avatar: img('photo-1561037404-61cd46aa615b') },
      { id: 't3', time: '15:00', pet: 'Симба · тримминг', client: 'Мастер Ольга', service: 'Тримминг', amount: '1 800 ₽', status: 'onsite', avatar: img('photo-1574158622682-e40e69881006') },
    ],
    requests: [
      { id: 'r1', pet: 'Тоби · комплекс', client: 'Запись груминга', when: 'Завтра 11:00', amount: '2 400 ₽', avatar: img('photo-1543466835-00a7907e9de1') },
      { id: 'r2', pet: 'Луна · мытьё+сушка', client: 'Запись груминга', when: '28 июня 16:00', amount: '1 600 ₽', avatar: img('photo-1596492784531-6e6eb5ea9993') },
    ],
  },
  boarding: {
    title: 'Обзор',
    subtitle: 'Зоогостиница «ДогХолидей» · вторник, 24 июня',
    stats: [
      { id: 's1', icon: 'meeting_room', iconColor: '#3E8C42', iconTint: '#E8F3E6', value: '18 / 24', label: 'мест занято', delta: '75%', deltaPositive: false },
      { id: 's2', icon: 'login', iconColor: '#2F58B0', iconTint: '#E7EEFB', value: '3', label: 'заезда сегодня' },
      { id: 's3', icon: 'logout', iconColor: '#E8902B', iconTint: '#FFF0DB', value: '2', label: 'выезда сегодня' },
      { id: 's4', icon: 'payments', iconColor: '#4F9A52', iconTint: '#E8F3E6', value: '42 800 ₽', label: 'доход за день', delta: '+6%' },
    ],
    today: [
      { id: 't1', time: '14:00', pet: 'Гера · заезд', client: 'Олег Дроздов', service: 'Стандартный номер · до 30.06', amount: '12 000 ₽', status: 'paid', avatar: img('photo-1543466835-00a7907e9de1') },
      { id: 't2', time: '16:30', pet: 'Барсик · заезд', client: 'Мария Соколова', service: 'Номер «люкс» · до 27.06', amount: '9 000 ₽', status: 'onsite', avatar: img('photo-1574158622682-e40e69881006') },
      { id: 't3', time: '17:00', pet: 'Локи · выезд', client: 'Игорь Петров', service: 'Номер №3', amount: '—', status: 'later', avatar: img('photo-1561037404-61cd46aa615b') },
    ],
    requests: [
      { id: 'r1', pet: 'Чарли · 5 ночей', client: 'Заявка на бронь', when: '1–6 июля', amount: '6 000 ₽', avatar: img('photo-1633332755192-727a05c4013d') },
      { id: 'r2', pet: 'Ная · 3 ночи', client: 'Заявка на бронь', when: '3–6 июля', amount: '3 600 ₽', avatar: img('photo-1438761681033-6461ffad8d80') },
    ],
  },
  taxi: {
    title: 'Обзор',
    subtitle: 'Диспетчерская · смена 24 июня, 09:00–21:00',
    stats: [
      { id: 's1', icon: 'route', iconColor: '#E07B1E', iconTint: '#FFF0DB', value: '26', label: 'поездок за смену', delta: '+7' },
      { id: 's2', icon: 'payments', iconColor: '#4F9A52', iconTint: '#E8F3E6', value: '19 400 ₽', label: 'выручка смены', delta: '+11%' },
      { id: 's3', icon: 'hourglass_top', iconColor: '#E5356A', iconTint: '#FCE4EC', value: '4', label: 'заказа в очереди' },
      { id: 's4', icon: 'schedule', iconColor: '#2F58B0', iconTint: '#E7EEFB', value: '11 мин', label: 'среднее подача' },
    ],
    today: [
      { id: 't1', time: '13:40', pet: 'Рекс → ВетДоктор', client: 'Водитель Павел', service: 'Разовая поездка', amount: '650 ₽', status: 'onsite', avatar: img('photo-1633332755192-727a05c4013d') },
      { id: 't2', time: '14:10', pet: 'Мявра → Груминг', client: 'Водитель Ирина', service: 'Сопровождение', amount: '500 ₽', status: 'paid', avatar: img('photo-1494790108377-be9c29b29330') },
      { id: 't3', time: '15:00', pet: 'Барсик → Дом', client: 'Очередь', service: 'Туда-обратно', amount: '900 ₽', status: 'later', avatar: img('photo-1574158622682-e40e69881006') },
    ],
    requests: [
      { id: 'r1', pet: 'Гера → клиника', client: 'Новый заказ', when: 'Сейчас · 2.1 км', amount: '550 ₽', avatar: img('photo-1500648767791-00dcc994a43e') },
      { id: 'r2', pet: 'Симба → груминг', client: 'Новый заказ', when: 'Через 30 мин', amount: '480 ₽', avatar: img('photo-1568602471122-7832951cc4c5') },
    ],
  },
};

// Per-type record lists — backs the "Записи" / "Заявки" / "Поездки" section.
const recordsSeed: Record<BusinessType, RecordsDTO> = {
  vet: {
    records: [
      { id: 'rec1', date: 'Сегодня', time: '14:00', pet: 'Мявра', client: 'Анна Кузнецова', service: 'Осмотр терапевта', amount: '800 ₽', status: 'paid', avatar: img('photo-1605568427561-40dd23c2acea') },
      { id: 'rec2', date: 'Сегодня', time: '15:30', pet: 'Рекс', client: 'Игорь Петров', service: 'Вакцинация', amount: '1 200 ₽', status: 'onsite', avatar: img('photo-1561037404-61cd46aa615b') },
      { id: 'rec3', date: 'Сегодня', time: '16:30', pet: 'Барсик', client: 'Мария Соколова', service: 'УЗИ', amount: '1 500 ₽', status: 'onsite', avatar: img('photo-1574158622682-e40e69881006') },
      { id: 'rec4', date: 'Вчера', time: '11:00', pet: 'Тоби', client: 'Сергей Орлов', service: 'Чипирование', amount: '2 000 ₽', status: 'done', avatar: img('photo-1543466835-00a7907e9de1') },
      { id: 'rec5', date: 'Вчера', time: '17:20', pet: 'Луна', client: 'Елена Фомина', service: 'Чистка зубов', amount: '3 200 ₽', status: 'done', avatar: img('photo-1596492784531-6e6eb5ea9993') },
      { id: 'rec6', date: 'Завтра', time: '10:00', pet: 'Гера', client: 'Олег Дроздов', service: 'Анализы крови', amount: '1 100 ₽', status: 'later', avatar: img('photo-1633332755192-727a05c4013d') },
      { id: 'rec7', date: '20 июня', time: '09:30', pet: 'Чарли', client: 'Виктор Жуков', service: 'Осмотр терапевта', amount: '800 ₽', status: 'cancelled', avatar: img('photo-1438761681033-6461ffad8d80') },
    ],
  },
  grooming: {
    records: [
      { id: 'rec1', date: 'Сегодня', time: '12:00', pet: 'Бьянка', client: 'Мастер Ольга', service: 'Комплексный груминг', amount: '2 400 ₽', status: 'onsite', avatar: img('photo-1583512603805-3cc6b41f3edb') },
      { id: 'rec2', date: 'Сегодня', time: '13:30', pet: 'Рекс', client: 'Мастер Дмитрий', service: 'Гигиеническая стрижка', amount: '1 100 ₽', status: 'paid', avatar: img('photo-1561037404-61cd46aa615b') },
      { id: 'rec3', date: 'Сегодня', time: '15:00', pet: 'Симба', client: 'Мастер Ольга', service: 'Тримминг', amount: '1 800 ₽', status: 'onsite', avatar: img('photo-1574158622682-e40e69881006') },
      { id: 'rec4', date: 'Вчера', time: '14:40', pet: 'Тоби', client: 'Мастер Дмитрий', service: 'Мытьё и сушка', amount: '1 600 ₽', status: 'done', avatar: img('photo-1543466835-00a7907e9de1') },
      { id: 'rec5', date: 'Завтра', time: '11:00', pet: 'Луна', client: 'Мастер Ольга', service: 'Комплексный груминг', amount: '2 400 ₽', status: 'later', avatar: img('photo-1596492784531-6e6eb5ea9993') },
      { id: 'rec6', date: '28 июня', time: '16:00', pet: 'Барсик', client: 'Мастер Дмитрий', service: 'Тримминг', amount: '1 800 ₽', status: 'later', avatar: img('photo-1574158622682-e40e69881006') },
    ],
  },
  boarding: {
    records: [
      { id: 'rec1', date: 'Сегодня', time: '14:00', pet: 'Гера', client: 'Олег Дроздов', service: 'Стандартный номер · до 30.06', amount: '12 000 ₽', status: 'paid', avatar: img('photo-1543466835-00a7907e9de1') },
      { id: 'rec2', date: 'Сегодня', time: '16:30', pet: 'Барсик', client: 'Мария Соколова', service: 'Номер «люкс» · до 27.06', amount: '9 000 ₽', status: 'onsite', avatar: img('photo-1574158622682-e40e69881006') },
      { id: 'rec3', date: 'Сегодня', time: '17:00', pet: 'Локи', client: 'Игорь Петров', service: 'Номер №3 · выезд', amount: '—', status: 'later', avatar: img('photo-1561037404-61cd46aa615b') },
      { id: 'rec4', date: '1–6 июля', time: '12:00', pet: 'Чарли', client: 'Заявка на бронь', service: 'Стандартный номер · 5 ночей', amount: '6 000 ₽', status: 'later', avatar: img('photo-1633332755192-727a05c4013d') },
      { id: 'rec5', date: '3–6 июля', time: '12:00', pet: 'Ная', client: 'Заявка на бронь', service: 'Стандартный номер · 3 ночи', amount: '3 600 ₽', status: 'later', avatar: img('photo-1438761681033-6461ffad8d80') },
      { id: 'rec6', date: 'Вчера', time: '10:00', pet: 'Симба', client: 'Мария Соколова', service: 'Номер «люкс» · выезд', amount: '9 000 ₽', status: 'done', avatar: img('photo-1574158622682-e40e69881006') },
    ],
  },
  taxi: {
    records: [
      { id: 'rec1', date: 'Сегодня', time: '13:40', pet: 'Рекс → ВетДоктор', client: 'Водитель Павел', service: 'Разовая поездка', amount: '650 ₽', status: 'onsite', avatar: img('photo-1633332755192-727a05c4013d') },
      { id: 'rec2', date: 'Сегодня', time: '14:10', pet: 'Мявра → Груминг', client: 'Водитель Ирина', service: 'Сопровождение', amount: '500 ₽', status: 'paid', avatar: img('photo-1494790108377-be9c29b29330') },
      { id: 'rec3', date: 'Сегодня', time: '15:00', pet: 'Барсик → Дом', client: 'Очередь', service: 'Туда-обратно', amount: '900 ₽', status: 'later', avatar: img('photo-1574158622682-e40e69881006') },
      { id: 'rec4', date: 'Вчера', time: '18:20', pet: 'Гера → клиника', client: 'Водитель Павел', service: 'Разовая поездка', amount: '550 ₽', status: 'done', avatar: img('photo-1500648767791-00dcc994a43e') },
      { id: 'rec5', date: 'Вчера', time: '09:10', pet: 'Симба → груминг', client: 'Водитель Ирина', service: 'Разовая поездка', amount: '480 ₽', status: 'cancelled', avatar: img('photo-1568602471122-7832951cc4c5') },
    ],
  },
};

export let recordsDb: Record<BusinessType, RecordsDTO> = loadPersisted('records', recordsSeed);
export const setRecordsDb = (next: Record<BusinessType, RecordsDTO>) => {
  recordsDb = next;
  savePersisted('records', next);
};

// Per-type client lists — backs the "Клиенты" section.
const clientsSeed: Record<BusinessType, ClientsDTO> = {
  vet: {
    clients: [
      { id: 'cl1', name: 'Анна Кузнецова', avatar: img('photo-1500648767791-00dcc994a43e'), phone: '+7 916 220-14-02', pets: 'Мявра · кошка', visits: 11, lastVisit: 'Сегодня', totalSpent: '18 400 ₽' },
      { id: 'cl2', name: 'Игорь Петров', avatar: img('photo-1494790108377-be9c29b29330'), phone: '+7 903 558-67-21', pets: 'Рекс · пёс', visits: 7, lastVisit: 'Сегодня', totalSpent: '12 600 ₽' },
      { id: 'cl3', name: 'Мария Соколова', avatar: img('photo-1568602471122-7832951cc4c5'), phone: '+7 925 312-90-08', pets: 'Барсик · кот', visits: 14, lastVisit: 'Сегодня', totalSpent: '24 100 ₽' },
      { id: 'cl4', name: 'Сергей Орлов', avatar: img('photo-1500648767791-00dcc994a43e'), phone: '+7 977 401-55-13', pets: 'Тоби · пёс', visits: 3, lastVisit: 'Вчера', totalSpent: '5 200 ₽' },
      { id: 'cl5', name: 'Елена Фомина', avatar: img('photo-1494790108377-be9c29b29330'), phone: '+7 916 880-33-47', pets: 'Луна · кошка', visits: 9, lastVisit: 'Вчера', totalSpent: '16 700 ₽' },
      { id: 'cl6', name: 'Виктор Жуков', avatar: img('photo-1568602471122-7832951cc4c5'), phone: '+7 903 219-77-60', pets: 'Чарли · пёс', visits: 1, lastVisit: '20 июня', totalSpent: '800 ₽' },
    ],
  },
  grooming: {
    clients: [
      { id: 'cl1', name: 'Дарья Семёнова', avatar: img('photo-1500648767791-00dcc994a43e'), phone: '+7 916 442-08-19', pets: 'Бьянка · пудель', visits: 6, lastVisit: 'Сегодня', totalSpent: '14 400 ₽' },
      { id: 'cl2', name: 'Павел Кузьмин', avatar: img('photo-1494790108377-be9c29b29330'), phone: '+7 925 660-12-34', pets: 'Рекс · пёс', visits: 4, lastVisit: 'Сегодня', totalSpent: '4 400 ₽' },
      { id: 'cl3', name: 'Ольга Никитина', avatar: img('photo-1568602471122-7832951cc4c5'), phone: '+7 903 771-25-90', pets: 'Симба · кот', visits: 8, lastVisit: 'Сегодня', totalSpent: '14 400 ₽' },
      { id: 'cl4', name: 'Роман Власов', avatar: img('photo-1500648767791-00dcc994a43e'), phone: '+7 977 305-48-62', pets: 'Тоби · пёс', visits: 5, lastVisit: 'Вчера', totalSpent: '8 000 ₽' },
      { id: 'cl5', name: 'Ирина Беляева', avatar: img('photo-1494790108377-be9c29b29330'), phone: '+7 916 904-71-08', pets: 'Луна · кошка', visits: 2, lastVisit: 'Завтра', totalSpent: '3 200 ₽' },
    ],
  },
  boarding: {
    clients: [
      { id: 'cl1', name: 'Олег Дроздов', avatar: img('photo-1500648767791-00dcc994a43e'), phone: '+7 903 117-62-40', pets: 'Гера · пёс', visits: 2, lastVisit: 'Сегодня', totalSpent: '24 000 ₽' },
      { id: 'cl2', name: 'Мария Соколова', avatar: img('photo-1568602471122-7832951cc4c5'), phone: '+7 925 312-90-08', pets: 'Барсик · кот', visits: 3, lastVisit: 'Сегодня', totalSpent: '18 000 ₽' },
      { id: 'cl3', name: 'Игорь Петров', avatar: img('photo-1494790108377-be9c29b29330'), phone: '+7 903 558-67-21', pets: 'Локи · пёс', visits: 1, lastVisit: 'Сегодня', totalSpent: '9 000 ₽' },
      { id: 'cl4', name: 'Наталья Громова', avatar: img('photo-1500648767791-00dcc994a43e'), phone: '+7 916 230-91-77', pets: 'Чарли · пёс', visits: 1, lastVisit: '1 июля', totalSpent: '6 000 ₽' },
      { id: 'cl5', name: 'Денис Карпов', avatar: img('photo-1568602471122-7832951cc4c5'), phone: '+7 977 814-26-39', pets: 'Ная · кошка', visits: 1, lastVisit: '3 июля', totalSpent: '3 600 ₽' },
    ],
  },
  taxi: {
    clients: [
      { id: 'cl1', name: 'Анна Кузнецова', avatar: img('photo-1500648767791-00dcc994a43e'), phone: '+7 916 220-14-02', pets: 'Рекс · пёс', visits: 9, lastVisit: 'Сегодня', totalSpent: '5 850 ₽' },
      { id: 'cl2', name: 'Мария Соколова', avatar: img('photo-1568602471122-7832951cc4c5'), phone: '+7 925 312-90-08', pets: 'Барсик · кот', visits: 5, lastVisit: 'Сегодня', totalSpent: '4 500 ₽' },
      { id: 'cl3', name: 'Игорь Петров', avatar: img('photo-1494790108377-be9c29b29330'), phone: '+7 903 558-67-21', pets: 'Мявра · кошка', visits: 3, lastVisit: 'Вчера', totalSpent: '1 650 ₽' },
      { id: 'cl4', name: 'Олег Дроздов', avatar: img('photo-1500648767791-00dcc994a43e'), phone: '+7 903 117-62-40', pets: 'Гера · пёс', visits: 2, lastVisit: 'Вчера', totalSpent: '1 100 ₽' },
    ],
  },
};

export let clientsDb: Record<BusinessType, ClientsDTO> = loadPersisted('clients', clientsSeed);
export const setClientsDb = (next: Record<BusinessType, ClientsDTO>) => {
  clientsDb = next;
  savePersisted('clients', next);
};

// Per-type day schedule — backs the "Расписание" section (vet, grooming).
const freeSlot = (time: string): { time: string; status: 'free' } => ({ time, status: 'free' });
export const scheduleDb: Record<BusinessType, ScheduleDTO> = {
  vet: {
    date: 'Сегодня · вторник, 24 июня',
    slots: [
      freeSlot('09:00'), freeSlot('10:00'), freeSlot('11:00'), freeSlot('12:00'), freeSlot('13:00'),
      { time: '14:00', status: 'busy', pet: 'Мявра', client: 'Анна Кузнецова', service: 'Осмотр терапевта' },
      { time: '15:30', status: 'busy', pet: 'Рекс', client: 'Игорь Петров', service: 'Вакцинация' },
      { time: '16:30', status: 'busy', pet: 'Барсик', client: 'Мария Соколова', service: 'УЗИ' },
      freeSlot('18:00'), freeSlot('19:00'),
    ],
  },
  grooming: {
    date: 'Сегодня · вторник, 24 июня',
    slots: [
      freeSlot('09:00'), freeSlot('10:00'), freeSlot('11:00'),
      { time: '12:00', status: 'busy', pet: 'Бьянка', client: 'Дарья Семёнова', service: 'Комплексный груминг' },
      { time: '13:30', status: 'busy', pet: 'Рекс', client: 'Павел Кузьмин', service: 'Гигиеническая стрижка' },
      freeSlot('14:30'),
      { time: '15:00', status: 'busy', pet: 'Симба', client: 'Ольга Никитина', service: 'Тримминг' },
      freeSlot('16:30'), freeSlot('17:30'), freeSlot('19:00'),
    ],
  },
  boarding: {
    date: 'Сегодня · вторник, 24 июня',
    slots: [
      freeSlot('09:00'), freeSlot('11:00'),
      { time: '14:00', status: 'busy', pet: 'Гера', client: 'Олег Дроздов', service: 'Заезд · стандартный номер' },
      freeSlot('15:30'),
      { time: '16:30', status: 'busy', pet: 'Барсик', client: 'Мария Соколова', service: 'Заезд · номер «люкс»' },
      { time: '17:00', status: 'busy', pet: 'Локи', client: 'Игорь Петров', service: 'Выезд · номер №3' },
      freeSlot('19:00'),
    ],
  },
  taxi: {
    date: 'Сегодня · смена 09:00–21:00',
    slots: [
      freeSlot('09:00'), freeSlot('11:00'),
      { time: '13:40', status: 'busy', pet: 'Рекс → ВетДоктор', client: 'Водитель Павел', service: 'Разовая поездка' },
      { time: '14:10', status: 'busy', pet: 'Мявра → Груминг', client: 'Водитель Ирина', service: 'Сопровождение' },
      freeSlot('16:00'), freeSlot('18:00'),
    ],
  },
};

// Per-type services price list — backs the "Услуги" section (vet, grooming, boarding).
const servicesSeed: Record<BusinessType, ServicesDTO> = {
  vet: {
    services: [
      { id: 'sv1', name: 'Осмотр терапевта', icon: 'stethoscope', price: '800 ₽', durationMin: 20 },
      { id: 'sv2', name: 'Вакцинация', icon: 'vaccines', price: '1 200 ₽', durationMin: 15 },
      { id: 'sv3', name: 'УЗИ', icon: 'monitor_heart', price: '1 500 ₽', durationMin: 30 },
      { id: 'sv4', name: 'Чипирование', icon: 'memory', price: '2 000 ₽', durationMin: 10 },
      { id: 'sv5', name: 'Чистка зубов', icon: 'cleaning_services', price: '3 200 ₽', durationMin: 40 },
    ],
  },
  grooming: {
    services: [
      { id: 'sv1', name: 'Комплексный груминг', icon: 'content_cut', price: '2 400 ₽', durationMin: 90 },
      { id: 'sv2', name: 'Гигиеническая стрижка', icon: 'content_cut', price: '1 100 ₽', durationMin: 30 },
      { id: 'sv3', name: 'Мытьё и сушка', icon: 'shower', price: '1 600 ₽', durationMin: 40 },
      { id: 'sv4', name: 'Тримминг', icon: 'content_cut', price: '1 800 ₽', durationMin: 60 },
    ],
  },
  boarding: {
    services: [
      { id: 'sv1', name: 'Стандартный номер', icon: 'meeting_room', price: '2 000 ₽/ночь', durationMin: 1440 },
      { id: 'sv2', name: 'Номер «люкс»', icon: 'king_bed', price: '3 000 ₽/ночь', durationMin: 1440 },
      { id: 'sv3', name: 'Выгул премиум', icon: 'pets', price: '500 ₽', durationMin: 30 },
      { id: 'sv4', name: 'Доп. кормление', icon: 'restaurant', price: '300 ₽', durationMin: 15 },
    ],
  },
  taxi: {
    services: [
      { id: 'sv1', name: 'Разовая поездка', icon: 'route', price: 'от 450 ₽', durationMin: 30 },
      { id: 'sv2', name: 'Поездка туда-обратно', icon: 'sync_alt', price: 'от 850 ₽', durationMin: 60 },
      { id: 'sv3', name: 'Сопровождение', icon: 'shield_person', price: 'от 500 ₽', durationMin: 45 },
      { id: 'sv4', name: 'Межгород', icon: 'map', price: 'от 3 500 ₽', durationMin: 180 },
    ],
  },
};

export let servicesDb: Record<BusinessType, ServicesDTO> = loadPersisted('services', servicesSeed);
export const setServicesDb = (next: Record<BusinessType, ServicesDTO>) => {
  servicesDb = next;
  savePersisted('services', next);
};

// Per-type income breakdown — backs the "Доходы" section (all business types).
export const incomeDb: Record<BusinessType, IncomeDTO> = {
  vet: {
    stats: [
      { id: 'i1', icon: 'payments', iconColor: '#4F9A52', iconTint: '#E8F3E6', value: '24 600 ₽', label: 'доход за день', delta: '+12%' },
      { id: 'i2', icon: 'calendar_view_week', iconColor: '#2F58B0', iconTint: '#E7EEFB', value: '142 800 ₽', label: 'доход за неделю', delta: '+8%' },
      { id: 'i3', icon: 'receipt_long', iconColor: '#E8902B', iconTint: '#FFF0DB', value: '1 350 ₽', label: 'средний чек' },
      { id: 'i4', icon: 'event_available', iconColor: '#E5356A', iconTint: '#FCE4EC', value: '8', label: 'оплаченных записей' },
    ],
    days: [
      { id: 'd1', date: 'Пн · 23 июня', amount: '21 400 ₽', count: 9, share: 72 },
      { id: 'd2', date: 'Вт · 24 июня', amount: '24 600 ₽', count: 8, share: 82 },
      { id: 'd3', date: 'Ср · 25 июня', amount: '18 900 ₽', count: 7, share: 63 },
      { id: 'd4', date: 'Чт · 26 июня', amount: '29 800 ₽', count: 11, share: 100 },
      { id: 'd5', date: 'Пт · 27 июня', amount: '22 100 ₽', count: 8, share: 74 },
    ],
  },
  grooming: {
    stats: [
      { id: 'i1', icon: 'payments', iconColor: '#4F9A52', iconTint: '#E8F3E6', value: '31 200 ₽', label: 'доход за день', delta: '+9%' },
      { id: 'i2', icon: 'calendar_view_week', iconColor: '#2F58B0', iconTint: '#E7EEFB', value: '186 400 ₽', label: 'доход за неделю', delta: '+14%' },
      { id: 'i3', icon: 'receipt_long', iconColor: '#E8902B', iconTint: '#FFF0DB', value: '1 980 ₽', label: 'средний чек' },
      { id: 'i4', icon: 'content_cut', iconColor: '#E5356A', iconTint: '#FCE4EC', value: '12', label: 'стрижек сегодня' },
    ],
    days: [
      { id: 'd1', date: 'Пн · 23 июня', amount: '27 600 ₽', count: 13, share: 78 },
      { id: 'd2', date: 'Вт · 24 июня', amount: '31 200 ₽', count: 12, share: 89 },
      { id: 'd3', date: 'Ср · 25 июня', amount: '24 300 ₽', count: 10, share: 69 },
      { id: 'd4', date: 'Чт · 26 июня', amount: '35 100 ₽', count: 15, share: 100 },
      { id: 'd5', date: 'Пт · 27 июня', amount: '28 700 ₽', count: 11, share: 82 },
    ],
  },
  boarding: {
    stats: [
      { id: 'i1', icon: 'payments', iconColor: '#4F9A52', iconTint: '#E8F3E6', value: '42 800 ₽', label: 'доход за день', delta: '+6%' },
      { id: 'i2', icon: 'calendar_view_week', iconColor: '#2F58B0', iconTint: '#E7EEFB', value: '268 000 ₽', label: 'доход за неделю', delta: '+5%' },
      { id: 'i3', icon: 'meeting_room', iconColor: '#E8902B', iconTint: '#FFF0DB', value: '18 / 24', label: 'мест занято' },
      { id: 'i4', icon: 'receipt_long', iconColor: '#E5356A', iconTint: '#FCE4EC', value: '7 100 ₽', label: 'средний чек' },
    ],
    days: [
      { id: 'd1', date: 'Пн · 23 июня', amount: '38 200 ₽', count: 6, share: 80 },
      { id: 'd2', date: 'Вт · 24 июня', amount: '42 800 ₽', count: 5, share: 89 },
      { id: 'd3', date: 'Ср · 25 июня', amount: '31 600 ₽', count: 5, share: 66 },
      { id: 'd4', date: 'Чт · 26 июня', amount: '47 900 ₽', count: 7, share: 100 },
      { id: 'd5', date: 'Пт · 27 июня', amount: '36 400 ₽', count: 6, share: 76 },
    ],
  },
  taxi: {
    stats: [
      { id: 'i1', icon: 'payments', iconColor: '#4F9A52', iconTint: '#E8F3E6', value: '19 400 ₽', label: 'выручка смены', delta: '+11%' },
      { id: 'i2', icon: 'calendar_view_week', iconColor: '#2F58B0', iconTint: '#E7EEFB', value: '118 600 ₽', label: 'доход за неделю', delta: '+7%' },
      { id: 'i3', icon: 'receipt_long', iconColor: '#E8902B', iconTint: '#FFF0DB', value: '746 ₽', label: 'средний чек' },
      { id: 'i4', icon: 'route', iconColor: '#E5356A', iconTint: '#FCE4EC', value: '26', label: 'поездок за смену' },
    ],
    days: [
      { id: 'd1', date: 'Пн · 23 июня', amount: '16 800 ₽', count: 22, share: 75 },
      { id: 'd2', date: 'Вт · 24 июня', amount: '19 400 ₽', count: 26, share: 87 },
      { id: 'd3', date: 'Ср · 25 июня', amount: '14 200 ₽', count: 19, share: 63 },
      { id: 'd4', date: 'Чт · 26 июня', amount: '22 300 ₽', count: 29, share: 100 },
      { id: 'd5', date: 'Пт · 27 июня', amount: '18 100 ₽', count: 24, share: 81 },
    ],
  },
};

// Per-type reviews — backs the "Отзывы" section (all business types).
const reviewsSeed: Record<BusinessType, ReviewsDTO> = {
  vet: {
    avgRating: 4.9,
    count: 214,
    reviews: [
      { id: 'rv1', name: 'Анна Кузнецова', avatar: img('photo-1500648767791-00dcc994a43e'), rating: 5, text: 'Очень внимательный врач, всё подробно объяснили про лечение Мявры.', date: '23 июня' },
      { id: 'rv2', name: 'Игорь Петров', avatar: img('photo-1494790108377-be9c29b29330'), rating: 5, text: 'Быстро приняли без записи, вакцинацию сделали аккуратно.', date: '21 июня' },
      { id: 'rv3', name: 'Сергей Орлов', avatar: img('photo-1500648767791-00dcc994a43e'), rating: 4, text: 'Хорошая клиника, но пришлось немного подождать своей очереди.', date: '18 июня', reply: 'Спасибо за отзыв! Учли пожелание, расширили слоты записи.' },
    ],
  },
  grooming: {
    avgRating: 4.8,
    count: 168,
    reviews: [
      { id: 'rv1', name: 'Дарья Семёнова', avatar: img('photo-1500648767791-00dcc994a43e'), rating: 5, text: 'Бьянку постригли просто отлично, мастер Ольга — золотые руки!', date: '24 июня' },
      { id: 'rv2', name: 'Ольга Никитина', avatar: img('photo-1568602471122-7832951cc4c5'), rating: 5, text: 'Симба теперь пушистый и довольный, спасибо за заботу.', date: '20 июня' },
      { id: 'rv3', name: 'Роман Власов', avatar: img('photo-1500648767791-00dcc994a43e'), rating: 4, text: 'Хорошо, но хотелось бы больше свободных слотов на выходных.', date: '17 июня' },
    ],
  },
  boarding: {
    avgRating: 4.7,
    count: 96,
    reviews: [
      { id: 'rv1', name: 'Олег Дроздов', avatar: img('photo-1500648767791-00dcc994a43e'), rating: 5, text: 'Гера прекрасно провёл время, присылали фото каждый день.', date: '22 июня' },
      { id: 'rv2', name: 'Мария Соколова', avatar: img('photo-1568602471122-7832951cc4c5'), rating: 5, text: 'Номер «люкс» очень чистый и просторный, Барсик не хотел уезжать.', date: '19 июня' },
      { id: 'rv3', name: 'Наталья Громова', avatar: img('photo-1500648767791-00dcc994a43e'), rating: 4, text: 'Всё хорошо, но заселение задержали на полчаса.', date: '15 июня' },
    ],
  },
  taxi: {
    avgRating: 4.9,
    count: 312,
    reviews: [
      { id: 'rv1', name: 'Анна Кузнецова', avatar: img('photo-1500648767791-00dcc994a43e'), rating: 5, text: 'Водитель Павел очень аккуратно довёз Рекса до клиники, всё вовремя.', date: '24 июня' },
      { id: 'rv2', name: 'Игорь Петров', avatar: img('photo-1494790108377-be9c29b29330'), rating: 5, text: 'Удобно вызывать такси для питомца, машина чистая и с переноской.', date: '23 июня' },
      { id: 'rv3', name: 'Олег Дроздов', avatar: img('photo-1500648767791-00dcc994a43e'), rating: 4, text: 'Подача была дольше обычного, но водитель предупредил заранее.', date: '20 июня' },
    ],
  },
};

export let reviewsDb: Record<BusinessType, ReviewsDTO> = loadPersisted('reviews', reviewsSeed);
export const setReviewsDb = (next: Record<BusinessType, ReviewsDTO>) => {
  reviewsDb = next;
  savePersisted('reviews', next);
};

// Boarding rooms — backs the "Номера" section (boarding only; other types kept minimal).
const roomsSeed: Record<BusinessType, RoomsDTO> = {
  vet: { rooms: [] },
  grooming: { rooms: [] },
  boarding: {
    rooms: [
      { id: 'rm1', number: '№1', kind: 'Стандартный', status: 'occupied', pet: 'Гера', client: 'Олег Дроздов', checkout: '30 июня' },
      { id: 'rm2', number: '№2', kind: 'Стандартный', status: 'free' },
      { id: 'rm3', number: '№3', kind: 'Стандартный', status: 'cleaning' },
      { id: 'rm4', number: '№4', kind: 'Люкс', status: 'occupied', pet: 'Барсик', client: 'Мария Соколова', checkout: '27 июня' },
      { id: 'rm5', number: '№5', kind: 'Люкс', status: 'free' },
      { id: 'rm6', number: '№6', kind: 'Стандартный', status: 'occupied', pet: 'Чарли', client: 'Заявка на бронь', checkout: '6 июля' },
      { id: 'rm7', number: '№7', kind: 'Стандартный', status: 'free' },
      { id: 'rm8', number: '№8', kind: 'Люкс', status: 'cleaning' },
    ],
  },
  taxi: { rooms: [] },
};

export let roomsDb: Record<BusinessType, RoomsDTO> = loadPersisted('rooms', roomsSeed);
export const setRoomsDb = (next: Record<BusinessType, RoomsDTO>) => {
  roomsDb = next;
  savePersisted('rooms', next);
};

// Taxi drivers — backs the "Водители" / "Карта" sections (taxi only; other types kept minimal).
const driversSeed: Record<BusinessType, DriversDTO> = {
  vet: { drivers: [] },
  grooming: { drivers: [] },
  boarding: { drivers: [] },
  taxi: {
    drivers: [
      { id: 'dr1', name: 'Павел Морозов', avatar: img('photo-1500648767791-00dcc994a43e'), phone: '+7 916 220-91-04', status: 'busy', tripsToday: 9, rating: 4.9, x: 32, y: 38 },
      { id: 'dr2', name: 'Ирина Соболева', avatar: img('photo-1568602471122-7832951cc4c5'), phone: '+7 925 441-08-77', status: 'busy', tripsToday: 7, rating: 4.8, x: 58, y: 64 },
      { id: 'dr3', name: 'Артём Волков', avatar: img('photo-1494790108377-be9c29b29330'), phone: '+7 903 117-26-30', status: 'online', tripsToday: 5, rating: 4.7, x: 74, y: 28 },
      { id: 'dr4', name: 'Светлана Орлова', avatar: img('photo-1500648767791-00dcc994a43e'), phone: '+7 977 305-90-12', status: 'offline', tripsToday: 0, rating: 4.6, x: 20, y: 72 },
    ],
  },
};

export let driversDb: Record<BusinessType, DriversDTO> = loadPersisted('drivers', driversSeed);
export const setDriversDb = (next: Record<BusinessType, DriversDTO>) => {
  driversDb = next;
  savePersisted('drivers', next);
};
