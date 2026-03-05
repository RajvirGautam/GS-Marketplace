import React from 'react';

const Avatar = ({ src, name = 'User', size = 40, className = '', style = {} }) => {
    const isNumberSize = typeof size === 'number';
    const computedSize = isNumberSize ? `${size}px` : size;
    const computedFontSize = isNumberSize ? `${size * 0.4}px` : '1rem';

    const baseStyle = {
        width: computedSize,
        height: computedSize,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0,
        ...style
    };

    if (src) {
        return (
            <div className={className} style={baseStyle}>
                <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
        );
    }

    // Default to the first character of the name string
    const initial = typeof name === 'string' && name.trim().length > 0
        ? name.trim().charAt(0).toUpperCase()
        : '?';

    // A nice fallback background color, you can tweak this
    baseStyle.background = 'linear-gradient(135deg, #00D9FF 0%, #0088FF 100%)';
    baseStyle.color = '#fff';
    baseStyle.fontWeight = '600';
    baseStyle.fontSize = computedFontSize;
    baseStyle.userSelect = 'none';

    return (
        <div className={className} style={baseStyle} title={name}>
            {initial}
        </div>
    );
};

export default Avatar;
