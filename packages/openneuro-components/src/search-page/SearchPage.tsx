import React from 'react'
import { ModalityHeader } from './ModalityHeader'
import { CommunityHeader } from './CommunityHeader'
import { Link } from 'react-router-dom'

import './search-page.scss'

export interface SearchPageProps {
  portalContent?: Record<string, any>
  renderSearchFacets: () => React.ReactNode
  renderSearchResultsList: () => React.ReactNode
  renderSortBy: () => React.ReactNode
  renderFilterBlock: () => React.ReactNode
  renderSearchHeader: () => React.ReactNode
  renderLoading: () => React.ReactNode
}

export const SearchPage = ({
  portalContent,
  renderSearchFacets,
  renderSearchResultsList,
  renderSortBy,
  renderFilterBlock,
  renderSearchHeader,
  renderLoading,
}: SearchPageProps) => {
  interface IProps {
    children: React.ReactNode
    getScrollTop: (scrollTop: number) => void
    // Your other Props
  }
  return (
    <>
      <section
        className={`search search-page ${portalContent?.className || ''}`}>
        {portalContent ? (
          <>
            {portalContent.portalName ? (
              <ModalityHeader
                portalName={portalContent.portalName}
                portalPrimary={portalContent.portalPrimary}
                publicDatasetStat={portalContent.publicDatasetStat}
                participantsStat={portalContent.participantsStat}
                hexBackgroundImage={portalContent.hexBackgroundImage}
              />
            ) : null}
            {portalContent.communityHeader ? (
              <CommunityHeader
                communityHeader={portalContent.communityHeader}
                communityPrimary={portalContent.communityPrimary}
                communitySecondary={portalContent.communitySecondary}
              />
            ) : null}
          </>
        ) : null}
        <div className="container">
          <div className="grid grid-nogutter">
            <div className="col col-12 search-heading">
              <h1>{renderSearchHeader()}</h1>
            </div>

            <div className="col col-12 search-wrapper">
              <div className="search-nav search-facet-wrapper">
                {renderSearchFacets()}
              </div>
              <div className="search-content">
                {renderLoading()}
                <div className="grid grid-nogutter">
                  <div className="col col-12">{renderFilterBlock()}</div>
                  <div className="col col-12">
                    <div className="grid grid-nogutter">{renderSortBy()}</div>
                  </div>
                  {renderSearchResultsList()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
