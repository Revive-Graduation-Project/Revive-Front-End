// Central exports for the Profile feature directory
// Importers can use `import { Profile, ProfileLayout, Orders } from './pages/Profile'`

export { default as Profile } from './Profile';
export { default as ProfileLayout } from './ProfileLayout';
export { default as ProfileOrders } from './ProfileOrders';
export { default as Rewards } from './Rewards';
export { default as OrderCard } from './components/OrderCard';
export { default as OrderTracking } from './components/OrderTracking';

// Expose UI subcomponents if other features want to reuse them
export { default as Sidebar } from './components/Sidebar';
export { default as ProfileHeader } from './components/ProfileHeader';
export { default as InfoGrid } from './components/InfoGrid';

