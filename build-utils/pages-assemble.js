const fs = require('fs')
const path = require('path')

const IPFS_MODE = process.env.IPFS_MODE === 'true'

const PATH_PROJECT = path.resolve(__dirname, '../')
const PATH_PAGES = path.join(PATH_PROJECT, '/pages')
const PATH_PAGES_SHARED = path.join(PATH_PROJECT, '/pages-shared')
const PATH_PAGES_INFRA = path.join(PATH_PROJECT, '/pages-infra')
const PATH_PAGES_IPFS = path.join(PATH_PROJECT, '/pages-ipfs')

function pagesAssemble() {
  fs.rmSync(PATH_PAGES, { recursive: true, force: true })
  fs.cpSync(PATH_PAGES_SHARED, PATH_PAGES, { recursive: true })

  if (IPFS_MODE) {
    fs.cpSync(PATH_PAGES_IPFS, PATH_PAGES, { recursive: true })
  } else {
    fs.cpSync(PATH_PAGES_INFRA, PATH_PAGES, { recursive: true })
  }
}

function pagesAssembleWatch() {
  const watchPagesDir = from => {
    fs.watch(from, { recursive: true }, (event, file) => {
      const pathFrom = path.join(from, file)
      const pathTo = path.join(PATH_PAGES, file)
      fs.cpSync(pathFrom, pathTo, { force: true })
    })
  }

  watchPagesDir(PATH_PAGES_SHARED)

  if (IPFS_MODE) {
    watchPagesDir(PATH_PAGES_IPFS)
  } else {
    watchPagesDir(PATH_PAGES_INFRA)
  }
}

module.exports = {
  pagesAssemble,
  pagesAssembleWatch,
}
