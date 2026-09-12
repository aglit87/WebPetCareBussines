import type { ReactNode } from 'react';

export interface WidgetSkeletonProps {
  children: ReactNode;
}

// Прозрачный фрейм для загрузочных состояний виджетов: содержимое —
// специфичный для виджета набор Skeleton-блоков, а контейнер единый.
export const WidgetSkeleton = ({ children }: WidgetSkeletonProps) => {
  return <>{children}</>;
};