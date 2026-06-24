'use client'
import { Leaf, ShoppingBasket, Smartphone, Truck } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'



const HeroSection = () => {
 

  const slides = [
    {
      id: 1,
      icon: (
        <Leaf className='w-20 h-20 sm:w-28 sm:h-28 text-green-400 drop-shadow-lg' />
      ),
      title: 'Fresh Organic Groceries 🌳',
      subtitle:
        'Farm-fresh fruits, vegetables, and daily essentials delivered to you.',
      btnText: 'Shop Now',
      bg: 'https://images.unsplash.com/photo-1634934044791-44efcd71ac04?q=80&w=2070&auto=format&fit=crop',
    },
    {
      id: 2,
      icon: (
        <Truck className='w-20 h-20 sm:w-28 sm:h-28 text-yellow-400 drop-shadow-lg' />
      ),
      title: 'Fast & Reliable Delivery 🚚',
      subtitle:
        'We ensure your groceries reach your doorstep in no time.',
      btnText: 'Order Now',
      bg: 'https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?q=80&w=2015&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: 3,
      icon: (
        <Smartphone className='w-20 h-20 sm:w-28 sm:h-28 text-blue-400 drop-shadow-lg' />
      ),
      title: 'Shop Anytime, Anywhere 📱',
      subtitle:
        'Easy and seamless online grocery shopping experience.',
      btnText: 'Get Started',
      bg: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1074&auto=format&fit=crop',
    },
  ]

  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <div className='relative w-[98%] mx-auto mt-32 h-[80vh] rounded-3xl overflow-hidden shadow-2xl bg-gray-900'>
      <AnimatePresence mode='wait'>
        <motion.div
          key={slides[current].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }} 
          className='absolute inset-0 w-full h-full'
        >
          <Image
            src={slides[current].bg}
            alt={slides[current].title}
            fill
            sizes='98vw'
            priority
            className='object-cover object-center pointer-events-none'
          />
          <div className='absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-6 z-10'>
            <div className='mb-6'>{slides[current].icon}</div>

            <h1 className='text-white text-4xl md:text-6xl font-extrabold mb-4'>
              {slides[current].title}
            </h1>

            <p className='text-white/90 text-lg md:text-xl max-w-2xl mb-8'>
              {slides[current].subtitle}
            </p>

            <motion.button 
             whileHover={{scale:1.09}}
             whileTap={{scale:0.96}}
             transition={{duration:0.2}}
            className='mt-4 bg-white text-green-700 hover:bg-green-100 px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 flex items-center gap-2'>
              <ShoppingBasket className='w-5 h-5'/>
            {slides[current].btnText}
            </motion.button>
          </div>
          
        </motion.div>
      </AnimatePresence>

      <div className='absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10'>
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-3 rounded-full transition-all ${
              current === index
                ? 'w-8 bg-white'
                : 'w-3 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroSection