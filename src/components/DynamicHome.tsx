import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

const DynamicHome: ComponentType = dynamic(() => import('./DynamicHome'), { ssr: false });

export default DynamicHome;
