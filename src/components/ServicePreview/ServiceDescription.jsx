import  { useState } from 'react';

const ServiceDescription = ({ description }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const descriptionLimit = 200; // Adjust this limit as needed

  const toggleShowMore = () => {
    setShowFullDescription(!showFullDescription);
  };

  const shouldShowButton = description && description.length > descriptionLimit;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Descripción del tour</h3>
      <p className={`text-gray-700 ${!showFullDescription && shouldShowButton ? 'line-clamp-4' : ''}`}>
        {description}
      </p>
      {shouldShowButton && (
        <button
          onClick={toggleShowMore}
          className="text-blue-600 hover:underline mt-2"
        >
          {showFullDescription ? 'Mostrar menos' : 'Mostrar más'}
        </button>
      )}
    </div>
  );
};

export default ServiceDescription;