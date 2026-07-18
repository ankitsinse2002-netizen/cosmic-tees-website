"use client"

import { type ReactNode } from "react"
import { motion, useReducedMotion, type Variants } from "motion/react"

type RevealProps = {
  children: ReactNode
  className?: string
  /** Stagger delay in seconds */
  delay?: number
  /** Direction the element travels in from */
  y?: number
  as?: "div" | "section" | "article" | "li" | "span"
}

/**
 * Lightweight scroll-reveal wrapper. Fades and slides content into view once,
 * and fully respects the user's reduced-motion preference for accessibility.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  as = "div",
}: RevealProps) {
  const reduceMotion = useReducedMotion()

  const variants: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : y },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    },
  }

  const MotionTag = motion[as]

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </MotionTag>
  )
}
