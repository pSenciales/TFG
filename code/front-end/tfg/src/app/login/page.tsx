import { redirect } from 'next/navigation';

export default function RedirectToDefaultLocale() {
  // Aquí defines tu defaultLocale (‘en’ en tu caso)
  redirect('/en/login');
}