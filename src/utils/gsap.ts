import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register once, centrally. Using the same instance everywhere avoids the
// classic "ScrollTrigger not registered" bug.
gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }
