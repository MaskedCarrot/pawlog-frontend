import { useState } from 'react';

export default function UserAvatar({ user, size = 'md' }) {
  const [imgError, setImgError] = useState(false);
  const showImage = user?.pictureUrl && !imgError;

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-10 h-10 text-sm',
  };
  const s = sizeClasses[size] || sizeClasses.md;

  if (showImage) {
    return (
      <img
        src={user.pictureUrl}
        alt=""
        className={`${s} rounded-full flex-shrink-0 object-cover`}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className={`${s} rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium flex-shrink-0`}
      aria-hidden
    >
      {user?.name?.charAt(0) || '?'}
    </div>
  );
}
