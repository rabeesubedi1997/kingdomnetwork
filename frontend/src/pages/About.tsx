import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Users, Film, Star, Sparkles, Handshake, Lightbulb, Target, Heart } from 'lucide-react'
import { Section, Container } from '@/components/layout/Section'

export const Team = () => {
  return (
    <>
      <Section id="team-hero" background="dark" padding="xl" className="relative overflow-hidden">
        <Container>
          <div className='mx-auto max-w-3xl text-center'>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='heading-1 text-brand-white mb-4'>
              Our Creative Family
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className='text-brand-white/70 text-lg max-w-2xl mx-auto'>
              Meet the passionate storytellers, visionaries, and craftspeople who bring Kingdom Network&apos;s films to life.
            </motion.p>
          </div>
        </Container>
      </Section>

      <Section id="team-members" padding="xl">
        <Container>
          <div className='grid md:grid-cols-2 gap-8'>
            {[
              {
                name: 'Subash Bhusal',
                role: 'Founder & Producer',
                bio: 'Distinguished producer and musician in the Nepali entertainment industry.',
              },
              {
                name: 'Bikash Subedi',
                role: 'Director',
                bio: 'Accomplished scriptwriter, film director, and music video director.',
              },
            ].map((member, index) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className='bg-brand-surface/50 rounded-xl p-6 border border-brand-surface'>
                <h3 className='heading-3 text-brand-primary mb-1'>{member.name}</h3>
                <p className='text-brand-gold font-medium mb-3'>{member.role}</p>
                <p className='text-brand-muted text-sm leading-relaxed'>{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}

export const About = () => {
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
      <Section id="about-hero" background="dark" padding="xl" className="relative overflow-hidden">
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-brand-primary/20 to-transparent' />
        <Container>
          <div className='mx-auto max-w-3xl text-center'>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='inline-flex items-center gap-2 bg-brand-white/10 px-4 py-2 rounded-full text-brand-gold text-sm font-medium mb-6'>
              <Users className='w-4 h-4' />
              About Kingdom Network
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className='heading-1 text-brand-white mb-4'>
              Redefining Nepali Cinema
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='text-brand-white/70 text-lg max-w-2xl mx-auto'>
              Kingdom Network is a leading film and media production company in Nepal, dedicated to creating world-class stories that inspire and connect audiences worldwide.
            </motion.p>
          </div>
        </Container>
      </Section>

      <Section id="mission-vision" padding="xl">
        <Container>
          <div className='grid lg:grid-cols-2 gap-12'>
            {[
              { ...mission, icon: Film },
              { ...vision, icon: Star },
            ].map((item, index) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className='bg-brand-surface/50 rounded-xl p-8 border border-brand-surface'>
                <div className='w-14 h-14 bg-brand-primary/10 rounded-xl flex items-center justify-center mb-6'>
                  <item.icon className='w-7 h-7 text-brand-primary' />
                </div>
                <h2 className='heading-2 text-brand-primary mb-4'>{item.title}</h2>
                <p className='text-brand-text leading-relaxed'>{item.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="core-values" padding="xl" background="surface">
        <Container>
          <div className='text-center mb-12'>
            <h2 className='heading-2 text-brand-primary mb-4'>Our Core Values</h2>
            <p className='text-brand-muted max-w-2xl mx-auto'>These principles guide everything we do, from development to distribution.</p>
          </div>
          <div className='grid sm:grid-cols-2 lg:grid-cols-5 gap-6'>
            {values.map((value, index) => (
              <motion.div key={value.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className='text-center p-6 bg-brand-surface/50 rounded-xl border border-brand-surface hover:border-brand-primary/50 transition-colors'>
                <div className='w-14 h-14 mx-auto mb-4 bg-brand-primary/10 rounded-xl flex items-center justify-center'>
                  <value.icon className='w-7 h-7 text-brand-primary' />
                </div>
                <h3 className='heading-3 text-brand-primary mb-2'>{value.title}</h3>
                <p className='text-brand-muted'>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="leadership" padding="xl">
        <Container>
          <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12'>
            <div>
              <h2 className='heading-2 text-brand-primary'>Leadership Team</h2>
              <p className='text-brand-muted mt-2'>Visionaries behind Kingdom Network</p>
            </div>
            <Link to='/team' className='btn-secondary'>View Full Team</Link>
          </div>
        </Container>
      </Section>
    </>
  )
}
