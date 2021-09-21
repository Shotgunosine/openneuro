import React from 'react'
import { Link } from 'react-router-dom'
import { useLocation, useHistory } from 'react-router-dom'
import { Tooltip } from '../tooltip/Tooltip'
import { Icon } from '../icon/Icon'
import { Button } from '../button/Button'

export interface DatasetToolsProps {
  hasEdit: boolean
  isPublic: boolean
  isSnapshot: boolean
  datasetId: string
}

export const DatasetTools = ({
  hasEdit,
  isSnapshot,
  isPublic,
  datasetId,
}: DatasetToolsProps) => {
  const history = useHistory()
  const location = useLocation()
  return (
    <>
      {hasEdit && !isPublic && !isSnapshot && (
        <Tooltip tooltip="Publish the dataset publicly" flow="up">
          <Link className="dataset-tool" to={`/datasets/${datasetId}/publish`}>
            <Icon icon="fa fa-globe" label="Publish" />
          </Link>
        </Tooltip>
      )}
      {hasEdit && !isSnapshot && (
        <Tooltip tooltip="Share this dataset with collaborators" flow="up">
          <Link className="dataset-tool" to={`/datasets/${datasetId}/share`}>
            <Icon icon="fa fa-user" label="Share" />
          </Link>
        </Tooltip>
      )}

      {hasEdit && !isSnapshot && (
        <Tooltip tooltip="Create a new version of the dataset" flow="up">
          <Link className="dataset-tool" to={`/datasets/${datasetId}/snapshot`}>
            <Icon icon="fa fa-camera" label="Snapshot" />
          </Link>
        </Tooltip>
      )}
      <span>
        <Link className="dataset-tool" to={`/datasets/${datasetId}/download`}>
          <Icon icon="fa fa-download" label="Download" />
        </Link>
      </span>
      <Tooltip
        wrapText={true}
        tooltip={
          hasEdit
            ? 'A form to describe your dataset (helps colleagues discover your dataset)'
            : 'View the dataset metadata'
        }
        flow="up">
        <Button
          icon="fa fa-file-code"
          label="Metadata"
          className="dataset-tool"
          nobg={true}
          onClick={() =>
            history.push({
              pathname: `/datasets/${datasetId}/metadata`,
              state: {
                submitPath: location.pathname,
              },
            })
          }
        />
      </Tooltip>
      {hasEdit && (
        <Tooltip tooltip="Remove your dataset from OpenNeuro" flow="up">
          <Link className="dataset-tool" to={`/datasets/${datasetId}/delete`}>
            <Icon icon="fa fa-trash" label="Delete" />
          </Link>
        </Tooltip>
      )}
    </>
  )
}