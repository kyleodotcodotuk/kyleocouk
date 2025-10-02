import React from 'react';

export default function Avatar({ name, size = 'medium', image = null }) {
  // Extract initials from name
  const getInitials = (fullName) => {
    if (!fullName) return 'U'; // Default to 'U' for User
    
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const initials = getInitials(name);
  
  const sizeClasses = {
    small: 'avatar-small',
    medium: 'avatar-medium', 
    large: 'avatar-large'
  };

  if (image) {
    return (
      <div className={`avatar ${sizeClasses[size]}`}>
        <img src={image} alt={`${name}'s avatar`} className="avatar-image" />
      </div>
    );
  }

  return (
    <div className={`avatar avatar-initials ${sizeClasses[size]}`} title={name}>
      <span className="avatar-text">{initials}</span>
    </div>
  );
}