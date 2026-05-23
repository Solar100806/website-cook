import Image from 'next/image'
import React from 'react'

export default function StepCard({step, image, title, desc}: {step: string, image: string, title: string, desc: string}) {
    return (
        <article className='w-full max-w-[809px] flex justify-between rounded-2xl border border-[#E7E8E9] p-6'>
            <div className='flex flex-col flex-1 max-w-[511px] w-full'>
                <div className='flex items-baseline gap-3 mb-2'>
                    <span className='font-epilogue text-4xl font-semibold leading-none text-brand-orange/40'>{step}</span>
                    <span className='text-base font-epilogue font-semibold text-brand-orange'>{title}</span>
                </div>
                <p className=' text-base max-w-[511px] w-full text-brand-muted font-epilogue leading-[26px] whitespace-pre-line'>{desc}</p>
            </div>
            <div className='relative h-[160px] w-[224px] shrink-0 overflow-hidden rounded-[16px]'>
                <Image className='object-cover' src={image} alt={title} fill />
            </div>
        </article>
    )
}
