import Image from 'next/image'
import Link from 'next/link'

import { LOGO } from '@/lib/brand'
import { cn } from '@/lib/utils'

const sizeClasses = {
  xs: 'h-10',
  sm: 'h-24',
  md: 'h-[7.5rem]',
  lg: 'h-[10.5rem]',
  xl: 'h-48',
} as const

type LogoProps = {
  size?: keyof typeof sizeClasses
  href?: string | null
  className?: string
  imageClassName?: string
  priority?: boolean
  suffix?: string
}

export function Logo({
  size = 'md',
  href = '/',
  className,
  imageClassName,
  priority = false,
  suffix,
}: LogoProps) {
  const image = (
    <Image
      src={LOGO.src}
      alt={LOGO.alt}
      width={LOGO.width}
      height={LOGO.height}
      priority={priority}
      quality={95}
      sizes="(max-width: 768px) 480px, 720px"
      className={cn(sizeClasses[size], 'w-auto object-contain', imageClassName)}
    />
  )

  const content = (
    <span className={cn('inline-flex items-center gap-2', className)}>
      {image}
      {suffix ? (
        <span className="text-sm font-semibold text-muted-foreground">{suffix}</span>
      ) : null}
    </span>
  )

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0">
        {content}
      </Link>
    )
  }

  return <span className="inline-flex shrink-0">{content}</span>
}
