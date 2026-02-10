'use client';

import { cn } from '@/lib/utils';

type PlatformName =
  | 'Codeforces'
  | 'LeetCode'
  | 'CodeChef'
  | 'AtCoder'
  | 'HackerRank'
  | 'HackerEarth'
  | 'GeeksforGeeks'
  | 'TopCoder'
  | string;

interface PlatformBadgeProps {
  platform: PlatformName;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface PlatformConfig {
  name: string;
  color: string;
  bgColor: string;
  textColor: string;
  icon: string;
}

const platformConfigs: Record<string, PlatformConfig> = {
  codeforces: {
    name: 'Codeforces',
    color: '#1890FF',
    bgColor: 'bg-[#1890FF]/10',
    textColor: 'text-[#1890FF]',
    icon: '/platforms/codeforces.svg',
  },
  leetcode: {
    name: 'LeetCode',
    color: '#FFA116',
    bgColor: 'bg-[#FFA116]/10',
    textColor: 'text-[#FFA116]',
    icon: '/platforms/leetcode.svg',
  },
  codechef: {
    name: 'CodeChef',
    color: '#5B4638',
    bgColor: 'bg-[#9B7653]/10',
    textColor: 'text-[#9B7653]',
    icon: '/platforms/codechef.svg',
  },
  atcoder: {
    name: 'AtCoder',
    color: '#222222',
    bgColor: 'bg-white/10',
    textColor: 'text-white',
    icon: '/platforms/atcoder.svg',
  },
  hackerrank: {
    name: 'HackerRank',
    color: '#00EA64',
    bgColor: 'bg-[#00EA64]/10',
    textColor: 'text-[#00EA64]',
    icon: '/platforms/hackerrank.svg',
  },
  hackerearth: {
    name: 'HackerEarth',
    color: '#2C3454',
    bgColor: 'bg-[#323754]/10',
    textColor: 'text-[#6B7FF2]',
    icon: '/platforms/hackerearth.svg',
  },
  geeksforgeeks: {
    name: 'GeeksforGeeks',
    color: '#2F8D46',
    bgColor: 'bg-[#2F8D46]/10',
    textColor: 'text-[#2F8D46]',
    icon: '/platforms/gfg.svg',
  },
  gfg: {
    name: 'GFG',
    color: '#2F8D46',
    bgColor: 'bg-[#2F8D46]/10',
    textColor: 'text-[#2F8D46]',
    icon: '/platforms/gfg.svg',
  },
  topcoder: {
    name: 'TopCoder',
    color: '#29A8E0',
    bgColor: 'bg-[#29A8E0]/10',
    textColor: 'text-[#29A8E0]',
    icon: '/platforms/topcoder.svg',
  },
};

const defaultConfig: PlatformConfig = {
  name: 'Unknown',
  color: '#888888',
  bgColor: 'bg-white/10',
  textColor: 'text-white/60',
  icon: '',
};

const sizeClasses = {
  sm: {
    container: 'h-6 gap-1.5 px-2 text-xs',
    icon: 'h-3 w-3',
  },
  md: {
    container: 'h-8 gap-2 px-3 text-sm',
    icon: 'h-4 w-4',
  },
  lg: {
    container: 'h-10 gap-2.5 px-4 text-base',
    icon: 'h-5 w-5',
  },
};

export function PlatformBadge({
  platform,
  showLabel = false,
  size = 'md',
  className,
}: PlatformBadgeProps) {
  const normalizedPlatform = platform.toLowerCase().replace(/\s+/g, '');
  const config = platformConfigs[normalizedPlatform] || {
    ...defaultConfig,
    name: platform,
  };
  const sizeConfig = sizeClasses[size];

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        config.bgColor,
        config.textColor,
        sizeConfig.container,
        className
      )}
    >
      {/* Platform icon or first letter */}
      <span
        className={cn(
          'flex items-center justify-center rounded-full',
          sizeConfig.icon
        )}
        style={{ backgroundColor: config.color }}
      >
        {config.icon ? (
          <span className="text-[8px] font-bold text-white">
            {config.name.charAt(0)}
          </span>
        ) : (
          <span className="text-[8px] font-bold text-white">
            {config.name.charAt(0)}
          </span>
        )}
      </span>

      {/* Label */}
      {showLabel && <span>{config.name}</span>}
    </div>
  );
}

// Platform icon only (for compact displays)
export function PlatformIcon({
  platform,
  size = 'md',
  className,
}: Omit<PlatformBadgeProps, 'showLabel'>) {
  const normalizedPlatform = platform.toLowerCase().replace(/\s+/g, '');
  const config = platformConfigs[normalizedPlatform] || {
    ...defaultConfig,
    name: platform,
  };

  const iconSizes = {
    sm: 'h-5 w-5 text-[10px]',
    md: 'h-6 w-6 text-xs',
    lg: 'h-8 w-8 text-sm',
  };

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-lg font-bold text-white',
        iconSizes[size],
        className
      )}
      style={{ backgroundColor: config.color }}
      title={config.name}
    >
      {config.name.charAt(0)}
    </div>
  );
}

// Get platform color (for dynamic styling)
export function getPlatformColor(platform: string): string {
  const normalizedPlatform = platform.toLowerCase().replace(/\s+/g, '');
  return platformConfigs[normalizedPlatform]?.color || defaultConfig.color;
}