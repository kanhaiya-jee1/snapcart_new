'use client'
import React from 'react'
import {motion} from "motion/react"
import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'


const Footer = () => {
  return (
    <motion.div 
    initial={{opacity:0,y:40}}
    whileInView={{opacity:1, y:0}}
    viewport={{once: true, amount:0.3}}
    transition={{duration:0.6, ease: "easeOut"}}
    className='bg-linear-to-r  from-green-600 to-green-700  text-white mt-20'>
       <div className='w-[90%] md:w-[80%] mx-auto py-10 grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-green-500/40'>
            <div >
              <h2 className='text-2xl font-bold mb-3'>Snapcart</h2>
            <p className='text-sm text-green-100 leading-relaxed'>Your one-stop online grocery store delivering freshness to your doorstop.
                Shop smart, eat fresh, and save more every day!
            </p>
            </div>

             <div>
                 <h2 className='text-xl font-semibold mb-3'>Quick Links</h2>
                 <ul className='space-y-2 text-green-100 text-sm'>
                    <li><Link href={"/"} className='hover:text-white transition'>Home</Link></li>
                    <li><Link href={"/cart"}  className='hover:text-white transition'>Cart</Link></li>
                    <li><Link href={"/my-orders"} className='hover:text-white transition'>My orders</Link></li>
                 </ul>
             </div>
             
             <div>
                 <h3 className='text-xl font-semibold mb-3'>Contact Us</h3>
                 <ul className='space-y-2 text-green-100 text-sm'>
                    <li className='flex  items-center gap-2'>
                        <MapPin size={16}/> Mumbai, India

                    </li>
                     <li className='flex  items-center gap-2'>
                     <Phone size={16}/> +91 0000000000
                     </li>
                     <li className='flex items-center gap-2'>
                        <Mail size ={16} />snapcart59@gmail.com 

                     </li>
                 </ul>
                  <div className="flex gap-4">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="w-5 h-5 text-green-100"
                            >
                              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                            </svg>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="w-5 h-5 text-green-100"
                            >
                              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                            </svg>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="w-5 h-5 text-green-100"
                            >
                              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                            </svg>
                  </div>
             </div>

       </div>

       <div className='text-center py-4 text-sm text-green-100 bg-green-800/40'>
         © {new Date().getFullYear()}  <span className='font-semibold'>Snapcart</span> .All rights  reserved.

       </div>
    </motion.div>
  )
}

export default Footer
