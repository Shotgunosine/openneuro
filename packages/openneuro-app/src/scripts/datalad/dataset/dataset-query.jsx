import * as Sentry from '@sentry/browser'
import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Spinner from '../../common/partials/spinner.jsx'
import DatasetPage from './dataset-page.jsx'
import * as DatasetQueryFragments from './dataset-query-fragments.js'

export const getDatasetPage = gql`
  query dataset($datasetId: ID!) {
    dataset(id: $datasetId) {
      id
      created
      public
      following
      starred
      ...DatasetDraft
      ...DatasetPermissions
      ...DatasetSnapshots
      ...DatasetComments
      ...DatasetIssues
      uploader {
        id
        name
        email
      }
      analytics {
        downloads
        views
      }
    }
  }
  ${DatasetQueryFragments.DRAFT_FRAGMENT}
  ${DatasetQueryFragments.PERMISSION_FRAGMENT}
  ${DatasetQueryFragments.DATASET_SNAPSHOTS}
  ${DatasetQueryFragments.DATASET_COMMENTS}
  ${DatasetQueryFragments.DATASET_ISSUES}
`

export const DatasetQueryRender = ({ loading, error, data, refetch }) => {
  if (loading) {
    return <Spinner text="Loading Dataset" active />
  } else if (error) {
    Sentry.captureException(error)
    throw new Error(error)
  } else {
    // Temporary refetch for validation
    if (data.dataset.draft.issues === null) {
      setTimeout(() => {
        refetch()
      }, 5000)
    }
    return <DatasetPage dataset={data.dataset} />
  }
}

DatasetQueryRender.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.object,
  data: PropTypes.object,
}

const DatasetQuery = ({ match }) => (
  <Query
    query={getDatasetPage}
    variables={{ datasetId: match.params.datasetId }}>
    {DatasetQueryRender}
  </Query>
)

DatasetQuery.propTypes = {
  match: PropTypes.object,
}

export default DatasetQuery