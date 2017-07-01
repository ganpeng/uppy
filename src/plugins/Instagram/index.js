const html = require('yo-yo')
const Plugin = require('../Plugin')

const Provider = require('../../uppy-base/src/plugins/Provider')

const View = require('../../generic-provider-views/index')

module.exports = class Instagram extends Plugin {
  constructor (core, opts) {
    super(core, opts)
    this.type = 'acquirer'
    this.id = 'Instagram'
    this.title = 'Instagram'
    this.stateId = 'instagram'
    this.icon = () => html`
      <svg class="UppyIcon UppyModalTab-icon" width="28" height="28" viewBox="0 0 512 512">
        <path
          d="M256,49.471c67.266,0,75.233.257,101.8,1.469,24.562,1.121,37.9,5.224,46.778,8.674a78.052,78.052,0,0,1,28.966,18.845,78.052,78.052,0,0,1,18.845,28.966c3.45,8.877,7.554,22.216,8.674,46.778,1.212,26.565,1.469,34.532,1.469,101.8s-0.257,75.233-1.469,101.8c-1.121,24.562-5.225,37.9-8.674,46.778a83.427,83.427,0,0,1-47.811,47.811c-8.877,3.45-22.216,7.554-46.778,8.674-26.56,1.212-34.527,1.469-101.8,1.469s-75.237-.257-101.8-1.469c-24.562-1.121-37.9-5.225-46.778-8.674a78.051,78.051,0,0,1-28.966-18.845,78.053,78.053,0,0,1-18.845-28.966c-3.45-8.877-7.554-22.216-8.674-46.778-1.212-26.564-1.469-34.532-1.469-101.8s0.257-75.233,1.469-101.8c1.121-24.562,5.224-37.9,8.674-46.778A78.052,78.052,0,0,1,78.458,78.458a78.053,78.053,0,0,1,28.966-18.845c8.877-3.45,22.216-7.554,46.778-8.674,26.565-1.212,34.532-1.469,101.8-1.469m0-45.391c-68.418,0-77,.29-103.866,1.516-26.815,1.224-45.127,5.482-61.151,11.71a123.488,123.488,0,0,0-44.62,29.057A123.488,123.488,0,0,0,17.3,90.982C11.077,107.007,6.819,125.319,5.6,152.134,4.369,179,4.079,187.582,4.079,256S4.369,333,5.6,359.866c1.224,26.815,5.482,45.127,11.71,61.151a123.489,123.489,0,0,0,29.057,44.62,123.486,123.486,0,0,0,44.62,29.057c16.025,6.228,34.337,10.486,61.151,11.71,26.87,1.226,35.449,1.516,103.866,1.516s77-.29,103.866-1.516c26.815-1.224,45.127-5.482,61.151-11.71a128.817,128.817,0,0,0,73.677-73.677c6.228-16.025,10.486-34.337,11.71-61.151,1.226-26.87,1.516-35.449,1.516-103.866s-0.29-77-1.516-103.866c-1.224-26.815-5.482-45.127-11.71-61.151a123.486,123.486,0,0,0-29.057-44.62A123.487,123.487,0,0,0,421.018,17.3C404.993,11.077,386.681,6.819,359.866,5.6,333,4.369,324.418,4.079,256,4.079h0Z"/>
        <path
          d="M256,126.635A129.365,129.365,0,1,0,385.365,256,129.365,129.365,0,0,0,256,126.635Zm0,213.338A83.973,83.973,0,1,1,339.974,256,83.974,83.974,0,0,1,256,339.973Z"/>
        <circle cx="390.476" cy="121.524" r="30.23"/>
      </svg>
    `

    // writing out the key explicitly for readability the key used to store
    // the provider instance must be equal to this.id.
    this.Instagram = new Provider({
      host: this.opts.host,
      provider: 'instagram',
      authProvider: 'instagram'
    })

    this.files = []

    this.onAuth = this.onAuth.bind(this)
    // Visual
    this.render = this.render.bind(this)

    // set default options
    const defaultOptions = {}

    // merge default options with the ones set by user
    this.opts = Object.assign({}, defaultOptions, opts)
  }

  install () {
    this.view = new View(this)
    // Set default state for Google Drive
    this.core.setState({
      // writing out the key explicitly for readability the key used to store
      // the plugin state must be equal to this.stateId.
      instagram: {
        authenticated: false,
        files: [],
        folders: [],
        directories: [],
        activeRow: -1,
        filterInput: ''
      }
    })

    const target = this.opts.target
    const plugin = this
    this.target = this.mount(target, plugin)

    // catch error here.
    this[this.id].auth().then(this.onAuth).catch(this.view.handleError)
    return
  }

  uninstall () {
    this.unmount()
  }

  onAuth (authenticated) {
    this.view.updateState({authenticated})
    if (authenticated) {
      this.view.getFolder('recent')
    }
  }

  isFolder (item) {
    return false
  }

  getItemData (item) {
    return item
  }

  getItemIcon (item) {
    return html`<img width="100px" src=${item.images.thumbnail.url}/>`
  }

  getItemSubList (item) {
    return item.data
  }

  getItemName (item) {
    return ''
  }

  getMimeType (item) {
    return item.type === 'video' ? 'video/mp4' : 'image/jpeg'
  }

  getItemId (item) {
    return item.id
  }

  getItemRequestPath (item) {
    return this.getItemId(item)
  }

  getItemModifiedDate (item) {
    return item.created_time
  }

  getItemThumbnailUrl (item) {
    return item.images.thumbnail.url
  }

  getNextPagePath () {
    const { files } = this.core.getState()[this.stateId]
    return `recent?max_id=${this.getItemId(files[files.length - 1])}`
  }

  render (state) {
    return this.view.render(state)
  }
}