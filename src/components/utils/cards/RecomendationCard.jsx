import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

function RecomendationCard(user) {
  const router = useRouter()
  console.log('el user', user)
  function getRandomSubServiceName(user) {
    // Obtén todos los subServices
    const allSubServices = user.workerData.services.flatMap(
      (service) => service.subServices
    )

    // Si no hay subServices, devuelve null
    if (allSubServices.length === 0) {
      return null
    }

    // Obtén un índice aleatorio
    const randomIndex = Math.floor(Math.random() * allSubServices.length)

    // Devuelve el nombre del subService en el índice aleatorio
    return allSubServices[randomIndex].name
  }
  const setFavorite = (id) => {
    localStorage.setItem('fromFavorite', true)
    router.push('/worker/' + id)
  }
  return (
    <div
      onClick={() => setFavorite(user?.user._id)}
      className='text-black flex flex-col bg-white w-40 h-60 mx-2 rounded-2xl border-r-2 border-blueBorder cursor-pointer'
    >
      <div className='w-full h-40 rounded-tr-2xl rounded-tl-2xl relative'>
        <Image
          src={user?.user?.img?.imgUrl || '/assets/service.png'}
          fill
          alt='casa'
          className='object-cover rounded-tr-2xl rounded-tl-2xl'
        />
      </div>
      <div className='px-1 sm:px-2'>
        <h1 className='font-semibold mt-2'>
          {getRandomSubServiceName(user.user)}
        </h1>
        <p className='text-blackText text-sm'>
          {user?.user?.personalData?.name?.first +
            ' ' +
            user?.user?.personalData?.name?.last}
        </p>
      </div>
    </div>
  )
}

export default RecomendationCard
