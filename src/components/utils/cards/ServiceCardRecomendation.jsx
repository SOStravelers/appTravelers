import {useState} from 'react';
import {useStore} from '@/store'


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

const ServiceCardRecomendation = ({service}) => {
  console.log('this object i recive',service)
  const [isFavorite, setIsFavorite] = useState(false);
  const {language} = useStore()
  return (
    <div className="bg-white rounded-lg shadow-md w-[250px] min-w-[250px] relative">
      <div className='w-full h-[220px] overflow-hidden flex items-center justify-center'>
          <img
            className='h-full w-full object-cover'
            src={service.imageUrl}
            alt="Service" 
          />
        </div>
      <div className="p-4">
        <div className="flex items-center mb-2">
          <h3 className="text-base font-semibold text-gray-800">{service.name}</h3>
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
          <span className="text-sm text-gray-600 ml-1">{service.score} ({service.scoreCount})</span>
        </div>
        <button className={`absolute top-2 right-2 p-1 rounded-full ${service.isFavorite ? 'bg-red-100' : 'bg-gray-100'}`}>
            <svg
              className={`h-5 w-5 ${service.isFavorite ? 'text-red-500' : 'text-gray-500'}`}
              fill={isFavorite ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        <div className="flex justify-between items-center mt-2">
 <span className="text-sm text-gray-600"> {service.duration} · </span>
          <span className="text-sm font-medium text-gray-800">Desde {service.price} € por persona</span>
        </div>   
      </div>   
    </div>
  );
};

export default ServiceCardRecomendation;