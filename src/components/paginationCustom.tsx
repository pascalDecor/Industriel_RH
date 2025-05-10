import React from 'react'
import Button from './ui/button'
import clsx from 'clsx'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  /** Nombre de pages voisines affichées autour de la page courante */
  siblingCount?: number,
  className?: string
}

type PageItem = number | 'LEFT_ELLIPSIS' | 'RIGHT_ELLIPSIS'

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}: PaginationProps) {
  // Helper pour générer une plage [start..end]
  const range = (start: number, end: number): number[] => {
    const length = end - start + 1
    return Array.from({ length }, (_, idx) => start + idx)
  }

  const paginationRange = React.useMemo<PageItem[]>(() => {
    const totalPageNumbers = siblingCount * 2 + 5

    // Si le nombre total de pages est petit, afficher toutes
    if (totalPages <= totalPageNumbers) {
      return range(1, totalPages)
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 2)
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPages - 1
    )

    const showLeftEllipsis = leftSiblingIndex > 2
    const showRightEllipsis = rightSiblingIndex < totalPages - 1

    const items: PageItem[] = [1]

    if (showLeftEllipsis) {
      items.push('LEFT_ELLIPSIS')
    } else {
      items.push(...range(2, leftSiblingIndex - 1))
    }

    items.push(...range(leftSiblingIndex, rightSiblingIndex))

    if (showRightEllipsis) {
      items.push('RIGHT_ELLIPSIS')
    } else {
      items.push(...range(rightSiblingIndex + 1, totalPages - 1))
    }

    items.push(totalPages)

    return items
  }, [currentPage, totalPages, siblingCount])

  // Gestionnaires prev / next
  const onPrev = () => onPageChange(Math.max(currentPage - 1, 1))
  const onNext = () => onPageChange(Math.min(currentPage + 1, totalPages))

  return (
    <nav className={clsx("flex items-center space-x-2", className)}>
      <Button
        onClick={onPrev}
        disabled={currentPage === 1}
        variant="light"
      >
        Précédent
      </Button>

      {paginationRange.map((item, idx) => {
        if (item === 'LEFT_ELLIPSIS' || item === 'RIGHT_ELLIPSIS') {
          return (
            <span key={idx} className="px-2">
              …
            </span>
          )
        }

        return (
          <Button
            key={item}
            onClick={() => onPageChange(item as number)}
            variant={item === currentPage ? 'dark' : 'light'}
          >
            {item}
          </Button>
        )
      })}

      <Button
        onClick={onNext}
        disabled={currentPage === totalPages}
        variant="light"
      >
        Suivant
      </Button>
    </nav>
  )
}
