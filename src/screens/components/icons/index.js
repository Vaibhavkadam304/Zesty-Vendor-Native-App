import React from 'react';
import Svg, { Path, Rect, Circle } from 'react-native-svg';


export const StoreIcon = ({ size = 28, color = '#33006F' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 9L12 3l9 6v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9z" stroke={color} strokeWidth={2} />
    <Path d="M9 22V12h6v10" stroke={color} strokeWidth={2} />
  </Svg>
);


export const OrdersIcon = ({ size = 28, color = '#33006F' }) => (
 <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 3h16v18l-3-2-2 2-2-2-2 2-2-2-3 2V3z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 7h8M8 11h8M8 15h4"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

export const DeliveryIcon = ({ size = 28, color = '#33006F' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path d="M12 6v6l4 2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const GalleryIcon = ({ size = 28, color = '#33006F' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth={2} />
    <Path d="M3 16l5-5 4 4 5-6 4 5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const PaymentIcon = ({ size = 28, color = '#33006F' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="5" width="20" height="14" rx="2" stroke={color} strokeWidth={2} />
    <Path d="M2 10h20" stroke={color} strokeWidth={2} />
    <Path d="M6 15h2" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

export const SupportIcon = ({ size = 28, color = '#33006F' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2z" stroke={color} strokeWidth={2} />
    <Path d="M9.09 9a3 3 0 1 1 5.82 0c0 1.5-2 2-2 4" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Circle cx="12" cy="17" r="1" fill={color} />
  </Svg>
);
