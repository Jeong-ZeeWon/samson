import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { BookOpen, Calendar, Tag } from 'lucide-react'

export default function SermonCard({ sermon }) {
  const dateStr = sermon.date
    ? format(new Date(sermon.date), 'yyyy년 M월 d일', { locale: ko })
    : ''

  return (
    <Link to={`/app/sermons/${sermon.id}`}>
      <div className="card p-5 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-semibold text-gray-900 text-base leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
            {sermon.title}
          </h3>
          {sermon.series && (
            <span className="flex-shrink-0 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
              {sermon.series}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
          {sermon.date && (
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {dateStr}
            </span>
          )}
          {sermon.scripture && (
            <span className="flex items-center gap-1 font-medium text-indigo-600">
              <BookOpen size={12} />
              {sermon.scripture}
            </span>
          )}
        </div>

        {sermon.theme && (
          <p className="text-sm text-gray-600 line-clamp-1 mb-3">{sermon.theme}</p>
        )}

        {sermon.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {sermon.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
            {sermon.tags.length > 4 && (
              <span className="text-xs text-gray-400">+{sermon.tags.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
