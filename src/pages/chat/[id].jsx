import { useState, useEffect } from 'react'
import WorkerProfileCardChat from '@/components/utils/cards/WorkerProfileCardChat'
import Chat from '@/components/chat/Chat'
import { useRouter } from 'next/router'

export default function PersonalChat() {
  const router = useRouter()
  const { name, avatar, services, score } = router.query

  return (
    <div className='bg-white w-screen py-20 px-5 md:pl-80 max-h-screen'>
      <WorkerProfileCardChat name={name} services={services} score={score} avatar={avatar} />
      <Chat />
    </div>
  )
}
