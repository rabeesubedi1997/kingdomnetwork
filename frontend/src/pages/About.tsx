import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Users, Film, Star, Sparkles, Handshake, Lightbulb, Target, Heart } from 'lucide-react'
import { Section, Container } from '@/components/layout/Section'
import { SEOHead } from '@/components/seo/SEOHead'
import { useTeam } from '@/hooks/useData'
import { TeamCard } from '@/components/team/TeamCard'
import { IconTile } from '@/components/ui/IconTile'
import { heroTitle, heroChild, staggerContainer, staggerItem, fadeUpViewport, cardHover, buttonTap } from '@/lib/motion'

export const Team = () => {
  const { data: team, isLoading } = useTeam()

  return (
    <>
      <SEOHead title="Our Team" />
      <Section id="team-hero" background="dark" padding="2xl" className="relative overflow-hidden">
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-brand-primary/20 to-transparent' />
        <Container>
          <div className='mx-auto max-w-3xl text-center'>
            <motion.span initial="initial" animate="animate" variants={heroTitle} className='eyebrow-pill'>
              <Users size={14} /> Our Creative Family
            </motion.span>
            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={heroChild(0.1)} className='heading-1 text-brand-white mt-6 mb-4'>
              Meet the People Behind the Magic
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={heroChild(0.2)} className='text-brand-white/70 text-lg max-w-2xl mx-auto'>
              Meet the passionate storytellers, visionaries, and craftspeople who bring Kingdom Network&apos;s films to life.
            </motion.p>
          </div>
        </Container>
      </Section>

      <Section id="team-members" padding="2xl">
        <Container>
          {isLoading ? (
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {[1, 2, 3].map(i => (
                <div key={i} className='card card-hover p-6'>
                  <div className='w-full aspect-square rounded-lg bg-brand-surface/50 mb-4' />
                  <div className='h-4 bg-brand-surface/50 rounded w-2/3 mb-2' />
                  <div className='h-3 bg-brand-surface/50 rounded w-1/2 mb-3' />
                  <div className='h-3 bg-brand-surface/50 rounded w-full' />
                </div>
              ))}
            </div>
          ) : team && team.length > 0 ? (
            <motion.div initial="initial" whileInView="whileInView" viewport={fadeUpViewport} variants={staggerContainer} className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {team.map((member, index) => (
                <motion.div key={member.id} variants={staggerItem}>
                  <TeamCard member={member} index={index} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className='text-center text-brand-muted dark:text-brand-white/60 py-12'>Team information coming soon.</p>
          )}
        </Container>
      </Section>
    </>
  )
}

export const About = () => {
  const { data: team } = useTeam()
  const aboutShort = "Kingdom Network is a leading film and media production company in Nepal, dedicated to creating world-class stories that inspire and connect audiences worldwide."

  const mission = {
    title: 'Our Mission',
    description: 'To revolutionize the Nepali and global entertainment industry by producing high-quality films, series, and creative media content that blend storytelling, technology, and cultural essence.',
    icon: Film,
  }

  const vision = {
    title: 'Our Vision',
    description: 'To be recognized as a global leader in film production, pushing creative boundaries and setting new standards in entertainment.',
    icon: Star,
  }

  const values = [
    { title: 'Creativity', description: 'Bringing imagination to reality', icon: Sparkles },
    { title: 'Collaboration', description: 'Working together with artists, talents & brands', icon: Handshake },
    { title: 'Innovation', description: 'Adapting new trends & technology', icon: Lightbulb },
    { title: 'Excellence', description: 'Maintaining world-class production standards', icon: Target },
    { title: 'Passion', description: 'Storytelling that touches hearts', icon: Heart },
  ]

  return (
    <>
      <SEOHead title="About Us" description={aboutShort} />
      <Section id="about-hero" background="dark" padding="2xl" className="relative overflow-hidden">
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-brand-primary/20 to-transparent' />
        <Container>
          <div className='mx-auto max-w-3xl text-center'>
            <motion.span initial="initial" animate="animate" variants={heroTitle} className='eyebrow-pill'>
              Our Story
            </motion.span>
            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={heroChild(0.1)} className='heading-1 text-brand-white mt-6 mb-4'>
              Redefining Nepali Cinema
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={heroChild(0.2)} className='text-brand-white/70 text-lg max-w-2xl mx-auto'>
              Kingdom Network is a leading film and media production company in Nepal, dedicated to creating world-class stories that inspire and connect audiences worldwide.
            </motion.p>
          </div>
        </Container>
      </Section>

      <Section id="mission-vision" padding="2xl">
        <Container>
          <motion.div initial="initial" whileInView="whileInView" viewport={fadeUpViewport} variants={staggerContainer} className='grid lg:grid-cols-2 gap-6'>
            {[
              { ...mission, icon: Film },
              { ...vision, icon: Star },
            ].map((item) => (
              <motion.div key={item.title} variants={staggerItem} {...cardHover} className='card p-8 lg:p-10'>
                <IconTile
                  icon={item.icon}
                  size='lg'
                  align='left'
                  titleAs='h2'
                  title={item.title}
                  titleClassName='heading-2 mb-4'
                  description={item.description}
                  descriptionClassName='text-brand-text dark:text-brand-white/90 leading-relaxed'
                />
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </Section>

      <Section id="core-values" padding="2xl" background="surface">
        <Container>
          <div className='text-center mb-12'>
            <span className='eyebrow text-brand-primary dark:text-brand-gold'>What Drives Us</span>
            <h2 className='heading-2 text-brand-primary dark:text-brand-white mt-3 mb-4'>Our Core Values</h2>
            <p className='text-brand-muted max-w-2xl mx-auto'>These principles guide everything we do, from development to distribution.</p>
          </div>
          <motion.div initial="initial" whileInView="whileInView" viewport={fadeUpViewport} variants={staggerContainer} className='grid sm:grid-cols-2 lg:grid-cols-5 gap-6'>
            {values.map((value) => (
              <motion.div key={value.title} variants={staggerItem} {...cardHover} className='card text-center p-6'>
                <IconTile
                  icon={value.icon}
                  title={value.title}
                  titleClassName='heading-3'
                  description={value.description}
                />
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </Section>

      <Section id="leadership" padding="2xl">
        <Container>
          <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10'>
            <div>
              <span className='eyebrow text-brand-primary dark:text-brand-gold'>The People</span>
              <h2 className='heading-2 text-brand-primary dark:text-brand-white mt-3'>Leadership Team</h2>
              <p className='text-brand-muted dark:text-brand-white/60 mt-2'>Visionaries behind Kingdom Network</p>
            </div>
            <motion.div {...buttonTap}>
              <Link to='/team' className='btn-secondary'>View Full Team</Link>
            </motion.div>
          </div>
          <motion.div initial="initial" whileInView="whileInView" viewport={fadeUpViewport} variants={staggerContainer} className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {(team || []).slice(0, 3).map((member, index) => (
              <motion.div key={member.id} variants={staggerItem}>
                <TeamCard member={member} index={index} />
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </Section>
    </>
  )
}
