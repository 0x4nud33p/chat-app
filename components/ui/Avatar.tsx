'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

type AvatarProps = {
  src: string | null;
  name: string | null;
  isOnline?: boolean;
};

export default function Avatar({ src, name, isOnline = false }: AvatarProps) {
  const initials = name
    ? name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : '?';

  return (
    <div className="relative">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="h-10 w-10 rounded-full overflow-hidden bg-gray-300 dark:bg-gray-700 flex items-center justify-center"
      >
        {/* {src ? (
          <Image src={src} alt={name || 'User'} width={40} height={40} className="object-cover" />
        ) : (
          <span className="text-sm font-semibold">{initials}</span>
        )} */}
      </motion.div>
      {isOnline && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-900"></span>
      )}
    </div>
  );
}