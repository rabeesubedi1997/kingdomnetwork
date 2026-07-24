import DOMPurify from 'dompurify'

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['a', 'b', 'br', 'code', 'div', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr',
      'i', 'iframe', 'img', 'li', 'ol', 'p', 'pre', 'section', 'span', 'strong', 'sub', 'sup',
      'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul', 'video', 'source', 'blockquote',
      'figure', 'figcaption', 'cite', 'del', 'ins', 'mark', 's', 'u', 'small', 'address',
      'dl', 'dt', 'dd', 'abbr', 'acronym', 'details', 'summary'],
    ALLOWED_ATTR: ['href', 'target', 'src', 'alt', 'class', 'id', 'style', 'width', 'height',
      'rel', 'title', 'data-*', 'frameborder', 'allowfullscreen', 'allow', 'loading', 'decoding',
      'srcset', 'sizes', 'type', 'controls', 'autoplay', 'loop', 'muted', 'poster', 'playsinline',
      'colspan', 'rowspan', 'scope', 'headers', 'align', 'valign', 'border', 'cellpadding', 'cellspacing'],
    ALLOW_DATA_ATTR: true,
    ADD_ATTR: ['target'],
  })
}
