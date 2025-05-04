// src/pages/collections.jsx

import React from 'react';
import Layout from '../layouts/Layout';
import Image from 'next/legacy/image';

const Collections = () => {
  const services = [
    { name: 'Tour', icon: '/icons/tour.svg' },
    { name: 'Fiestas & Shows', icon: '/icons/fiestas.svg' },
    { name: 'Gastronomia', icon: '/icons/gastronomia.svg' },
    { name: 'Senderos', icon: '/icons/senderos.svg' },
    { name: 'Experiencias', icon: '/icons/experiencias.svg' },
    { name: 'Partidos de futbol', icon: '/icons/futbol.svg' },
    { name: 'Transfers', icon: '/icons/transfers.svg' },
  ];

  return (

    <div className="mx-auto pt-20 md:pt-32 md:max-w-6xl md:pl-72 md:pr-4">
      <h1 className="text-2xl font-bold mb-6 text-center ">Coleções</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 justify-center">
        {services.map((service, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-2 rounded-2xl border-2 border-black bg-white"
          >
            <div className="w-16 h-16 relative">
              <Image
                src={service.icon}
                alt={service.name}
                layout="fill"
              />
            </div>
            <span className="mt-3 text-sm font-medium text-center text-gray-700">{service.name}</span>

          </div>
        ))}
      </div>
    </div>

  );
};

export default Collections;
