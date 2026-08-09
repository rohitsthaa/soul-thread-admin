import { redirect } from 'next/navigation';
import { getSettings, getPaymentGatewayConfig } from '@/lib/api';
import { getAdmin, can } from '@/lib/auth';
import { currentStoreId } from '@/lib/store-context';
import SettingsClient from './SettingsClient';

export default async function SettingsPage() {
  const admin = await getAdmin();
  if (!can(admin?.role, 'settings')) redirect('/dashboard'); // staff can't change store settings
  const [settings, paymentGateways] = await Promise.all([getSettings(), getPaymentGatewayConfig()]);
  const storeId = await currentStoreId();

  return (
    <main className="p-6 md:p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-400 mt-0.5">Site-wide content and appearance</p>
      </div>
      {/* key on the active store forces a fresh remount when switching stores,
          so the client form re-seeds its useState from the new store's values. */}
      <SettingsClient
        key={storeId}
        initialAboutImage={settings.about_image ?? ''}
        initialPaymentQr={settings.payment_qr ?? ''}
        initialBankTransferEnabled={settings.payment_bank_transfer_enabled === 'true'}
        initialPhone={settings.contact_phone ?? ''}
        initialInstagram={settings.contact_instagram ?? ''}
        initialContactEmail={settings.contact_email ?? ''}
        initialLocation={settings.contact_location ?? ''}
        initialCurrency={settings.currency_symbol ?? 'NPR'}
        initialTagline={settings.tagline ?? ''}
        initialMetaDescription={settings.meta_description ?? ''}
        initialFontFamily={settings.font_family ?? ''}
        initialLogoUrl={settings.logo_url ?? ''}
        initialOgImage={settings.og_image ?? ''}
        initialPaymentGateways={paymentGateways}
      />
    </main>
  );
}
