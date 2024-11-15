import { IconProps } from '@/types/icon'
import React from 'react'
import { colors } from '../colors'

export const Logo: React.FC<IconProps> = ({ size = "1em", color = colors.primary600 }) => {
  return (
    <div 
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        color: 'white',
        fontSize: `calc(${size} * 0.6)`,
        fontFamily: 'Arial, sans-serif',
        lineHeight: 1,
      }}
    >
      D
    </div>
  )
}
