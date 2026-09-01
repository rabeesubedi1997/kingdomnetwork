import { useNewsDetail } from '@/hooks/useData'
import { useParams, Link } from 'react-router-dom'
import { Section, Container } from '@/components/layout/Section'
import { Article } from '@/components/news/Article'
import { Loading } from '@/components/ui/Loading'
import { SEOHead } from '@/components/seo/SEOHead'

export const NewsDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const { data: post, isLoading, error } = useNewsDetail(slug!)

  if (isLoading) {
    return (
      <Section padding='xl'>
        <Container>
          <div className='max-w-4xl mx-auto'>
            <Loading text='Loading article...' />
          </div>
        </Container>
      </Section>
    )
  }

  if (error || !post) {
    return (
      <Section padding='xl'>
        <Container>
          <div className='max-w-2xl mx-auto text-center'>
            <h1 className='heading-2 text-brand-primary dark:text-brand-white mb-4'>Article Not Found</h1>
            <p className='text-brand-muted dark:text-brand-white/60 mb-5'>The article you're looking for doesn't exist or has been removed.</p>
            <Link to='/news'>
              <button className='btn-primary'>Back to News</button>
            </Link>
          </div>
        </Container>
      </Section>
    )
  }

  return (
    <>
      <SEOHead
        title={post.title}
        description={post.excerpt}
        ogImage={post.featured_image?.url}
        ogType="article"
        schemaType="NewsArticle"
        publishedTime={post.published_at}
        modifiedTime={post.updated_at}
        author={post.author?.name}
        section={post.category?.name}
        tags={post.tags?.map((t: any) => t.name)}
      />
      <Section padding='xl'>
        <Container>
          <div className='max-w-4xl mx-auto'>
            <Article post={post} />
          </div>
        </Container>
      </Section>
    </>
  )
}