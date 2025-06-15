import { useState } from 'react';
import { useStore } from '@/store'
import { MdFavoriteBorder } from "react-icons/md";
import { MdFavorite } from "react-icons/md";


/* {
  "id": 3,
  "name": "Join a conservation mission",
  "imageUrl": "https://via.placeholder.com/300x220?text=Service+3",
  "score": 4.8,
  "scoreCount": 30,
  "duration": "1 hour",
  "price": 75,
  "isFavorite": false
} */

const ServiceCardRecomendation = ({ service }) => {
  const {imageUrl, name, score, scoreCount, duration, price, isFavorite} = service
  console.log('this object i recive', service)
  const [isFavorited, setIsFavorited] = useState(isFavorite || false);
  const { language } = useStore()
  if (!service) {
    return null;
  }
  return (
    <div className="bg-white rounded-lg shadow-md w-[250px] min-w-[250px] relative">
      <div className='w-full h-[220px] overflow-hidden flex items-center justify-center'>
        <img
          className='h-full w-full object-cover'
          src={imageUrl}
          alt="Service"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center mb-2">
          <h3 className="text-base font-semibold text-gray-800">{name}</h3>
        </div>
        <div className='flex items-center'>
          <div className="flex items-center">
            <svg
              className="h-4 w-4 text-yellow-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M10 1l2.8 6.3 6.2.9-4.5 4.3 1.1 6-5.6-3.2L4.4 18.5l1.1-6-4.5-4.3 6.2-.9L10 1z"
              />
            </svg>
          </div>
          <span className="text-sm text-gray-600 ml-1">{score} ({scoreCount})</span>
        </div>
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className={`absolute top-2 right-2 p-1 z-10`}
        >
          {isFavorited ? <MdFavorite size={25} color='tomato' /> : <MdFavoriteBorder size={25} />}
        </button>
        <div className="flex justify-between items-start flex-col mt-2">
          <span className="text-sm text-gray-600"> {duration} · </span>
          <span className="text-sm font-medium text-gray-800">Desde {price} € por persona</span>
        </div>
      </div>
    </div>
  );
};

export default ServiceCardRecomendation;