import { useState } from 'react'
import { Download, FileText, Image, Film, ExternalLink, Copy } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface AssetDownloadProps {
  assets: Record<string, any>
  filmTitle: string
}

export const AssetDownload = ({ assets }: AssetDownloadProps) => {
  const [copied, setCopied] = useState<string | null>(null)

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
    toast.success('Copied to clipboard!')
  }

  const posters = Array.isArray(assets.posters) ? assets.posters : []
  const stills = Array.isArray(assets.stills) ? assets.stills : []
  const clips = Array.isArray(assets.clips) ? assets.clips : []
  const logos = Array.isArray(assets.logos) ? assets.logos : []
  const oneSheets = Array.isArray(assets.one_sheets) ? assets.one_sheets : []

  return (
    <div className='space-y-6'>
      {posters.length > 0 && (
        <div>
          <h4 className='font-semibold text-brand-primary mb-3 flex items-center gap-2'>
            <Image className='w-5 h-5' />
            Posters ({posters.length})
          </h4>
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'>
            {posters.map((poster: any, i: number) => (
              <div key={i} className='card overflow-hidden'>
                <img src={poster.url} alt='Poster' className='w-full h-48 object-cover' />
                <div className='p-3 flex items-center justify-between'>
                  <span className='text-sm text-brand-muted'>{poster.name || 'Poster'}</span>
                  <div className='flex gap-2'>
                    <button onClick={() => handleDownload(poster.url, poster.name)} className='p-2 bg-brand-primary/10 text-brand-primary rounded-lg hover:bg-brand-primary/20' aria-label='Download poster'>
                      <Download className='w-4 h-4' />
                    </button>
                    <button onClick={() => handleCopy(poster.url, 'Poster URL')} className='p-2 bg-brand-primary/10 text-brand-primary rounded-lg hover:bg-brand-primary/20' aria-label='Copy poster URL'>
                      <Copy className='w-4 h-4' />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {stills.length > 0 && (
        <div>
          <h4 className='font-semibold text-brand-primary mb-3 flex items-center gap-2'>
            <Image className='w-5 h-5' />
            Production Stills ({stills.length})
          </h4>
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'>
            {stills.map((still: any, i: number) => (
              <div key={i} className='card overflow-hidden'>
                <img src={still.url} alt='Still' className='w-full h-48 object-cover' />
                <div className='p-3 flex items-center justify-between'>
                  <span className='text-sm text-brand-muted'>{still.name || 'Still'}</span>
                  <div className='flex gap-2'>
                    <button onClick={() => handleDownload(still.url, still.name)} className='p-2 bg-brand-primary/10 text-brand-primary rounded-lg hover:bg-brand-primary/20' aria-label='Download still'>
                      <Download className='w-4 h-4' />
                    </button>
                    <button onClick={() => handleCopy(still.url, 'Still URL')} className='p-2 bg-brand-primary/10 text-brand-primary rounded-lg hover:bg-brand-primary/20' aria-label='Copy still URL'>
                      <Copy className='w-4 h-4' />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {clips.length > 0 && (
        <div>
          <h4 className='font-semibold text-brand-primary mb-3 flex items-center gap-2'>
            <Film className='w-5 h-5' />
            Video Clips ({clips.length})
          </h4>
          <div className='space-y-3'>
            {clips.map((clip: any, i: number) => (
              <div key={i} className='card p-4 flex items-center gap-4'>
                <div className='w-16 h-9 bg-brand-dark rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden'>
                  <Film className='w-6 h-6 text-brand-primary' />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='font-medium text-brand-primary truncate'>{clip.name || 'Clip'}</p>
                  <p className='text-sm text-brand-muted'>{clip.duration || 'Video clip'} • {clip.format || 'MP4'}</p>
                </div>
                <div className='flex gap-2'>
                  <a href={clip.url} target='_blank' rel='noopener noreferrer' className='btn-secondary text-sm'>
                    <ExternalLink className='w-4 h-4 mr-2' />
                    View
                  </a>
                  <button onClick={() => handleDownload(clip.url, clip.name)} className='p-2 bg-brand-primary/10 text-brand-primary rounded-lg hover:bg-brand-primary/20' aria-label='Download clip'>
                    <Download className='w-4 h-4' />
                  </button>
                  <button onClick={() => handleCopy(clip.url, 'Clip URL')} className='p-2 bg-brand-primary/10 text-brand-primary rounded-lg hover:bg-brand-primary/20' aria-label='Copy clip URL'>
                    <Copy className='w-4 h-4' />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {logos.length > 0 && (
        <div>
          <h4 className='font-semibold text-brand-primary mb-3 flex items-center gap-2'>
            <FileText className='w-5 h-5' />
            Brand Assets & Logos ({logos.length})
          </h4>
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'>
            {logos.map((logo: any, i: number) => (
              <div key={i} className='card p-4 flex flex-col items-center justify-center aspect-square'>
                <img src={logo.url} alt='Logo' className='max-h-20 max-w-full object-contain mb-2' />
                <p className='text-sm text-brand-muted text-center'>{logo.name || 'Logo'}</p>
                <div className='flex gap-2 w-full mt-2'>
                  <button onClick={() => handleDownload(logo.url, logo.name)} className='btn-secondary text-xs flex-1'>
                    <Download className='w-3 h-3 mr-1' />
                    Download
                  </button>
                  <button onClick={() => handleCopy(logo.url, 'Logo URL')} className='p-2 bg-brand-primary/10 text-brand-primary rounded-lg hover:bg-brand-primary/20' aria-label='Copy logo URL'>
                    <Copy className='w-4 h-4' />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {oneSheets.length > 0 && (
        <div>
          <h4 className='font-semibold text-brand-primary mb-3 flex items-center gap-2'>
            <FileText className='w-5 h-5' />
            One Sheets ({oneSheets.length})
          </h4>
          <div className='space-y-3'>
            {oneSheets.map((sheet: any, i: number) => (
              <div key={i} className='card p-4 flex items-center gap-4'>
                <div className='w-20 h-28 bg-brand-dark rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden'>
                  <img src={sheet.thumbnail_url || sheet.url} alt='One Sheet' className='w-full h-full object-cover' />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='font-medium text-brand-primary truncate'>{sheet.name || 'One Sheet'}</p>
                  <p className='text-sm text-brand-muted'>{sheet.format || 'PDF'} • {sheet.size || 'High resolution'}</p>
                </div>
                <div className='flex gap-2'>
                  <a href={sheet.url} target='_blank' rel='noopener noreferrer' className='btn-secondary text-sm'>
                    <ExternalLink className='w-4 h-4 mr-2' />
                    View
                  </a>
                  <button onClick={() => handleDownload(sheet.url, sheet.name)} className='p-2 bg-brand-primary/10 text-brand-primary rounded-lg hover:bg-brand-primary/20' aria-label='Download one sheet'>
                    <Download className='w-4 h-4' />
                  </button>
                  <button onClick={() => handleCopy(sheet.url, 'One Sheet URL')} className='p-2 bg-brand-primary/10 text-brand-primary rounded-lg hover:bg-brand-primary/20' aria-label='Copy one sheet URL'>
                    <Copy className='w-4 h-4' />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
