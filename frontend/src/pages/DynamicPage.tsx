import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPublicPage } from '@/lib/public-api'
import { SEOHead } from '@/components/seo/SEOHead'
import { Section, Container } from '@/components/layout/Section'
import { Loading } from '@/components/ui/Loading'

const renderContent = (html: string): string => {
  if (!html.trim()) return ''
  if (/^<[a-z][\s\S]*>/i.test(html.trim())) return html
  return html.split('\n').filter(l => l.trim()).map(l => `<p>${l.trim()}</p>`).join('')
}

export const DynamicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()

  const { data: page, isLoading, error } = useQuery({
    queryKey: ['page', slug],
    queryFn: () => getPublicPage(slug!),
    enabled: !!slug,
  })

  if (isLoading) return <Loading text="Loading page..." />
  if (error || !page) return (
    <Section>
      <Container>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
          <p className="text-brand-muted">The page you are looking for does not exist.</p>
        </div>
      </Container>
    </Section>
  )

  return (
    <>
      <SEOHead
        title={page.title}
        description={page.meta_description}
        ogImage={page.meta_image_url}
        schemaType={page.schema_type || 'WebPage'}
      />
      <Section padding="lg">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">{page.title}</h1>
            <div className="w-16 h-1 bg-brand-primary rounded-full mb-6" />
            {page.content ? (
              <div
                className="text-brand-white/90 leading-relaxed space-y-5 text-lg [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:mt-10 [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-4 [&_p]:leading-relaxed [&_a]:text-brand-primary [&_a]:underline [&_a:hover]:text-brand-accent [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-1 [&_img]:rounded-xl [&_img]:my-6 [&_img]:max-w-full [&_blockquote]:border-l-4 [&_blockquote]:border-brand-primary [&_blockquote]:pl-5 [&_blockquote]:py-2 [&_blockquote]:my-6 [&_blockquote]:text-brand-muted [&_blockquote]:italic [&_pre]:bg-brand-dark/80 [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:my-6 [&_code]:text-sm [&_code]:bg-brand-dark/60 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_hr]:border-brand-surface [&_hr]:my-8"
                dangerouslySetInnerHTML={{ __html: renderContent(page.content) }}
              />
            ) : (
              <p className="text-brand-muted text-lg">No content yet.</p>
            )}
          </div>
        </Container>
      </Section>
    </>
  )
}
