import { motion } from 'framer-motion'
import { Linkedin, Twitter, Instagram, Mail } from 'lucide-react'
import type { TeamMember } from '@/types'

interface TeamCardProps {
  member: TeamMember
  index?: number
}

export const TeamCard = ({ member, index = 0 }: TeamCardProps) => {
  const socialLinks = member.social_links || {}
  const imageUrl = member.photo?.url || '/storage/team/default.jpg'

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className='card group'
    >
      <div className='relative aspect-square overflow-hidden'>
        <img src={imageUrl} alt={member.name} className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105' loading='lazy' />
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
        <div className='absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex justify-center gap-3'>
          {socialLinks.linkedin && (
            <a href={socialLinks.linkedin} target='_blank' rel='noopener noreferrer' className='p-2 bg-brand-white/90 text-brand-primary rounded-full hover:bg-brand-primary hover:text-white transition-colors' aria-label='LinkedIn'>
              <Linkedin className='w-5 h-5' />
            </a>
          )}
          {socialLinks.twitter && (
            <a href={socialLinks.twitter} target='_blank' rel='noopener noreferrer' className='p-2 bg-brand-white/90 text-brand-primary rounded-full hover:bg-brand-primary hover:text-white transition-colors' aria-label='Twitter'>
              <Twitter className='w-5 h-5' />
            </a>
          )}
          {socialLinks.instagram && (
            <a href={socialLinks.instagram} target='_blank' rel='noopener noreferrer' className='p-2 bg-brand-white/90 text-brand-primary rounded-full hover:bg-brand-primary hover:text-white transition-colors' aria-label='Instagram'>
              <Instagram className='w-5 h-5' />
            </a>
          )}
          {socialLinks.email && (
            <a href={`mailto:${socialLinks.email}`} className='p-2 bg-brand-white/90 text-brand-primary rounded-full hover:bg-brand-primary hover:text-white transition-colors' aria-label='Email'>
              <Mail className='w-5 h-5' />
            </a>
          )}
        </div>
      </div>
      <div className='p-6 text-center'>
        <h3 className='heading-3 text-brand-primary mb-1'>{member.name}</h3>
        <p className='text-brand-gold font-medium mb-3'>{member.role}</p>
        {member.bio && (
          <p className='text-brand-muted text-sm leading-relaxed line-clamp-3'>{member.bio}</p>
        )}
      </div>
    </motion.article>
  )
}
