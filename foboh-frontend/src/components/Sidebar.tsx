'use client';

import Logo from '../assets/icons/logo.svg';
import ChartDonut from '../assets/icons/ChartDonut.svg';
import ShoppingBagOpen from '../assets/icons/ShoppingBagOpen.svg';
import UserCircle from '../assets/icons/UserCircle.svg';
import Cube from '../assets/icons/Cube.svg';
import TagSimple from '../assets/icons/TagSimple.svg';
import Truck from '../assets/icons/Truck.svg';
import Circuitry from '../assets/icons/Circuitry.svg';
import GearSix from '../assets/icons/GearSix.svg';
import Image from 'next/image';
import { useState } from 'react';

const sidebarItems = [  
  { icon: ChartDonut, label: 'Dashboard' },
  { icon: ShoppingBagOpen, label: 'Orders' },
  { icon: UserCircle, label: 'Customers' },
  { icon: Cube, label: 'Products' },
  { icon: TagSimple, label: 'Pricing' },
  { icon: Truck, label: 'Freight' },
  { icon: Circuitry, label: 'Integrations' },
  { icon: GearSix, label: 'Settings' },
];


const Sidebar = () => {

 const [activeItem, setActiveItem] = useState<string>('Pricing');

  return (
    <aside className="fixed left-0 top-0 h-screen w-[200px] bg-gray-100 z-10 flex flex-col items-center pt-6">
    {/* Sidebar Items */}
    <nav className="flex flex-col w-full px-4">
      {sidebarItems.map((item, idx) => (
          <div key={idx} className={`flex items-center gap-3 py-3 px-3 hover:bg-gray-200 cursor-pointer ${activeItem === item.label ? 'bg-gray-200' : ''} ${item.label === 'Settings' ? 'border-t border-gray-300 rounded-b-md' : ''}`} onClick={() => setActiveItem(item.label)}>
            <Image src={item.icon} alt={item.label} width={20} height={20} />
          <span className="text-gray-800 text-lg font-medium">{item.label}</span>
        </div>
      ))}
    </nav>
    {/* Logo */}
    <div className="mt-auto mb-10 w-full flex justify-start items-start ml-10">
      <Image src={Logo} alt="Logo" width={120} />
    </div>
  </aside>
  )
}

export default Sidebar