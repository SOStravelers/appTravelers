import Image from 'next/image';

const ServiceCard = ({ service }) => {
  if (!service) {
    return null;
  }

  const { name, imageUrl, score, scoreCount, duration, price, isFavorite } = service;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-200 hover:scale-105 hover:shadow-lg cursor-pointer w-full max-w-md">
      <div className="relative w-full h-48">
        <Image
          src={imageUrl || '/placeholder-image.jpg'} 
          alt={name || 'Service image'}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
        {/* Optional: Favorite button overlay */}
        {/* <button className="absolute top-2 right-2 p-1 bg-white rounded-full shadow">
          {isFavorite ? '❤️' : '🤍'}
        </button> */}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{name}</h3>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          {score && (
            <>
              <span className="text-yellow-500 mr-1">★</span>
              <span>{score}</span>
            </>
          )}
          {scoreCount && (
            <span className="ml-2">({scoreCount})</span>
          )}
        </div>
        <div className="flex items-center text-sm text-gray-700 mt-2">
          <svg className="w-4 h-4 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-18C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm-.5 5H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
          </svg>
          <span>{duration}</span>
        </div>
        <div className="text-lg font-bold text-gray-900 mt-2">
          ${price}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;