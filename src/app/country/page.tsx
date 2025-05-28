import { redirect } from 'next/navigation';

export default function CountryPage() {
  // Redirect to a default region (e.g., southern-asia)
  redirect('/');
}