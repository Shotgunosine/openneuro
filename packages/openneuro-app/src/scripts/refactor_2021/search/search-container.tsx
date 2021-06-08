import React, { FC, useContext } from 'react'
import { SearchParamsCtx } from './search-params-ctx'
import {
  SearchPage,
  SearchResultsList,
  sortBy,
  FacetSelect,
  FacetRadio,
  FacetRange,
  Button,
  FacetBlockContainerExample,
  SearchSortContainerExample,
} from '@openneuro/components'
import FiltersBlockContainer from './filters-block-container'
import KeywordInput from './keyword-input'
import ModalitySelect from './modality-select'
import ShowDatasetRadios from './show-datasets-radios'
import AgeRangeInput from './age-range-input'
import SubjectCountRangeInput from './subject-count-range-input'
import DiagnosisSelect from './diagnosis-select'
import TaskInput from './task-input'
import AuthorInput from './author-input'
import GenderRadios from './gender-radios'
import DateRangeInput from './date-range-input'
import SpeciesSelect from './species-select'
import SectionSelect from './section-select'
import StudyDomainSelect from './study-domain-select'

const SearchContainer: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)

  return (
    <SearchPage
      renderFilterBlock={() => <FiltersBlockContainer />}
      renderSortBy={() => (
        <>
          <div className="col">
            <b>
              100 Datasets found for "<span>Forrest Gump</span>"
            </b>
          </div>
          <div className="col">
            <div className="search-sort">
              <SearchSortContainerExample items={sortBy} />
            </div>
          </div>
        </>
      )}
      renderSearchFacets={() => (
        <>
          <KeywordInput />
          <ModalitySelect />
          <ShowDatasetRadios />
          <AgeRangeInput />
          <SubjectCountRangeInput />
          <DiagnosisSelect />
          <TaskInput />
          <AuthorInput />
          <GenderRadios />
          <DateRangeInput />
          <SpeciesSelect />
          <SectionSelect />
          <StudyDomainSelect />
        </>
      )}
      renderSearchResultsList={() => null}
    />
  )
}

export default SearchContainer
