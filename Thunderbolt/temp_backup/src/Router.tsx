import { MemoryRouter, Routes, Route } from 'react-router';
import { App } from './App.tsx';
import { Query } from './Query.tsx';
import { HomeGpt } from './HomeGpt.tsx';
import { ThunderboltGpt } from './ThunderboltGpt.tsx';

export function Router() {
  return (
    <MemoryRouter>
      <Routes>
        {/* default page */}
        <Route path="/" element={<HomeGpt />} />
        {/* optional alias so nav('/HomeGpt') still works */}
        <Route path="/HomeGpt" element={<HomeGpt />} />

        <Route path="/Query" element={<Query />} />
        <Route path="/ThunderboltGpt" element={<ThunderboltGpt />} />

        {/* keep App route only if you still need it */}
        <Route path="/App" element={<App />} />
      </Routes>
    </MemoryRouter>
  );
}
