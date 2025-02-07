import React from 'react';
import { Avatar } from '@mui/material';

const UserAvatar = ({ user, size = 40, ...props }) => {
  if (!user) return null;

  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        bgcolor: user.avatar?.color || 'primary.main',
        fontSize: `${size * 0.4}px`,
        ...props.sx
      }}
      {...props}
    >
      {user.avatar?.initials || user.name.charAt(0).toUpperCase()}
    </Avatar>
  );
};

export default UserAvatar; 