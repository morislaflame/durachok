import React from 'react';
import styles from './styles/Avatar.module.css';

interface AvatarProps {
  imageUrl?: string;
  size?: 'small' | 'medium' | 'large';
  alt?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
  imageUrl, 
  size = 'medium',
  alt = 'User avatar'
}) => {
  return (
    <div className={`${styles.avatarContainer} ${styles[size]}`}>
      <img 
        src={imageUrl || '/default-avatar.png'} 
        alt={alt}
        className={styles.avatarImage}
      />
    </div>
  );
};

export default Avatar;