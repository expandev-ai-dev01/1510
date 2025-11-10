import { clsx } from 'clsx';

export interface LoadingSpinnerVariantProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function getLoadingSpinnerClassName(props: LoadingSpinnerVariantProps): string {
  const { size = 'medium', className } = props;

  return clsx(
    'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
    {
      'h-4 w-4': size === 'small',
      'h-8 w-8': size === 'medium',
      'h-12 w-12': size === 'large',
    },
    className
  );
}
