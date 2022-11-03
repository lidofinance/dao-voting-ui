// Ipfs next.js configuration reference:
// https://github.com/Velenir/nextjs-ipfs-example

let insertIpfsBase: string = ''

// #!if IPFS_MODE === "true"
insertIpfsBase = `
(function () {
  const { pathname } = window.location
  const ipfsMatch = /.*\\/Qm\\w{44}\\//.exec(pathname)
  const base = document.createElement('base')
  base.href = ipfsMatch ? ipfsMatch[0] : '/'
  document.head.append(base)
})();
`
// #!endif

export function ScriptInsertIpfsBase() {
  return insertIpfsBase ? (
    <script dangerouslySetInnerHTML={{ __html: insertIpfsBase }} />
  ) : null
}
