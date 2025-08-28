import '@lynx-js/preact-devtools'
import '@lynx-js/react/debug'
import { root } from '@lynx-js/react'

import { App } from './App.tsx'
import { Query } from './Query.tsx'

root.render(<Query />)

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
}
