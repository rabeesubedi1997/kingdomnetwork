import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Linkedin, Twitter, Instagram, Mail, Globe, ExternalLink } from 'lucide-react'
import type { TeamMember } from '@/types'
import type { MouseEvent } from 'react'
import { SafeImage } from '@/components/shared/SafeImage'

interface TeamCardProps {
  member: TeamMember
  index?: number
}

const stopProp = (e: MouseEvent) => e.stopPropagation()

export const TeamCard = ({ member, index = 0 }: TeamCardProps) => {
  const social = member.social_links || {}

  return (
    <Link to={`/team/${member.id}`} className='block'>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 }}
        className='card card-hover group cursor-pointer'
      >
        <div className='relative aspect-square overflow-hidden'>
          <SafeImage src={member.photo_url} alt={member.name} placeholderType='team' placeholderText={member.name} className='transition-transform duration-500 group-hover:scale-105' loading='lazy' />
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
          <div className='absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex justify-center gap-3' onClick={stopProp}>
            {member.linkedin_url && (
              <a href={member.linkedin_url} target='_blank' rel='noopener noreferrer' onClick={stopProp} className='p-2 bg-brand-white/90 text-brand-primary rounded-full hover:bg-brand-primary hover:text-white transition-colors' aria-label='LinkedIn'>
                <Linkedin className='w-5 h-5' />
              </a>
            )}
            {member.twitter_url && (
              <a href={member.twitter_url} target='_blank' rel='noopener noreferrer' onClick={stopProp} className='p-2 bg-brand-white/90 text-brand-primary rounded-full hover:bg-brand-primary hover:text-white transition-colors' aria-label='Twitter'>
                <Twitter className='w-5 h-5' />
              </a>
            )}
            {member.instagram_url && (
              <a href={member.instagram_url} target='_blank' rel='noopener noreferrer' onClick={stopProp} className='p-2 bg-brand-white/90 text-brand-primary rounded-full hover:bg-brand-primary hover:text-white transition-colors' aria-label='Instagram'>
                <Instagram className='w-5 h-5' />
              </a>
            )}
            {member.email && (
              <a href={`mailto:${member.email}`} onClick={stopProp} className='p-2 bg-brand-white/90 text-brand-primary rounded-full hover:bg-brand-primary hover:text-white transition-colors' aria-label='Email'>
                <Mail className='w-5 h-5' />
              </a>
            )}
            {member.website_url && (
              <a href={member.website_url} target='_blank' rel='noopener noreferrer' onClick={stopProp} className='p-2 bg-brand-white/90 text-brand-primary rounded-full hover:bg-brand-primary hover:text-white transition-colors' aria-label='Website'>
                <Globe className='w-5 h-5' />
              </a>
            )}
          </div>
        </div>
        <div className='p-6 text-center'>
          <h3 className='heading-3 text-brand-primary mb-1'>{member.name}</h3>
          <p className='text-brand-gold font-medium mb-3'>{member.role}</p>
          {member.imdb_url && (
            <a href={member.imdb_url} target='_blank' rel='noopener noreferrer' onClick={stopProp} className='inline-flex items-center gap-1 text-xs text-brand-muted hover:text-brand-primary mb-3 transition-colors'>
              <ExternalLink size={12} /> IMDb Profile
            </a>
          )}
          {member.bio && (
            <p className='text-brand-muted text-sm leading-relaxed line-clamp-3'>{member.bio}</p>
          )}
        </div>
      </motion.article>
    </Link>
  )
}
