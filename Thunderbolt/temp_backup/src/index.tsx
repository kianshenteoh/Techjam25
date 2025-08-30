import '@lynx-js/preact-devtools';
import '@lynx-js/react/debug';
import { root } from '@lynx-js/react';

import { Router } from './Router.tsx';

root.render(<Router />);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
