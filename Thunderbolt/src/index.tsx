import '@lynx-js/preact-devtools'
import '@lynx-js/react/debug'
import { root } from '@lynx-js/react'

import { App } from './App.tsx'
import { Query } from './Query.tsx'
import { HomeGpt } from './HomeGpt.tsx'

root.render(<HomeGpt />)

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
}
