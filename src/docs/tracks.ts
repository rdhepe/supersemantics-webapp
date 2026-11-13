import { buildSearchIndex, docPages } from './content'
import { typescriptPages } from './typescript'

export const docTracks = {
  python: {
    label: 'Python', badge: 'PYTHON', runtime: 'Python 3.10+',
    pages: docPages, searchIndex: buildSearchIndex(docPages),
  },
  typescript: {
    label: 'TypeScript / JavaScript', badge: 'TS / JS', runtime: 'Node.js 22 LTS · TS / JS',
    pages: typescriptPages, searchIndex: buildSearchIndex(typescriptPages, 'typescript'),
  },
}

export type DocTrack = keyof typeof docTracks
