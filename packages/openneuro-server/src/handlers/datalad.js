import request from 'superagent'
import { Readable } from 'node:stream'
import mime from 'mime-types'
import { getDatasetWorker } from '../libs/datalad-service'

/**
 * Handlers for datalad dataset manipulation
 *
 * Access and caching is handled here so that it can be coordinated with other
 * web nodes independent of the DataLad service.
 *
 * Unlike the other handlers, these use superagent for performance reasons
 */

/**
 * Get a file from a dataset
 */
export const getFile = (req, res) => {
  const { datasetId, snapshotId, filename } = req.params
  const worker = getDatasetWorker(datasetId)
  res.set('Content-Type', mime.lookup(filename) || 'application/octet-stream')
  const uri = snapshotId
    ? `http://${worker}/datasets/${datasetId}/snapshots/${snapshotId}/files/${filename}`
    : `http://${worker}/datasets/${datasetId}/files/${filename}`
  return (
    fetch(uri)
      .then(r => {
        // Set the content length (allow clients to catch HTTP issues better)
        res.setHeader('Content-Length', Number(r.headers.get('content-length')))
        return r.body
      })
      // @ts-expect-error
      .then(stream => Readable.fromWeb(stream).pipe(res))
      .catch(err => {
        console.error(err)
        res.status(500).send('Internal error transferring requested file')
      })
  )
}

/**
 * Get a file from a dataset
 */
export const getObject = (req, res) => {
  const { datasetId, key } = req.params
  const worker = getDatasetWorker(datasetId)
  // Backend depends on git object or git-annex key
  if (key.length === 40) {
    const uri = `${worker}/datasets/${datasetId}/objects/${key}`
    res.set('Content-Type', 'application/octet-stream')
    return request.get(uri).pipe(res)
  } else if (key.startsWith('SHA256E-') || key.startsWith('MD5E-')) {
    const uri = `${worker}/datasets/${datasetId}/annex/${key}`
    res.set('Content-Type', 'application/octet-stream')
    return request.get(uri).pipe(res)
  } else {
    res.set('Content-Type', 'application/json')
    res.status(400).send({
      error: 'Key must be a git object hash or git-annex key',
    })
  }
}
