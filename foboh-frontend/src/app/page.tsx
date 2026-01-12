'use client';

import { fetchPricingProfiles } from '@/api/api';
import Header from '@/components/Header';
import PricingProfile from '@/components/PricingProfile';
import Sidebar from '@/components/Sidebar';
import { useEffect, useState } from 'react';

export default function Home() {
  // States
  const [activeProfile, setActiveProfile] = useState<string>('default');
  const [pricingProfiles, setPricingProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newProfileDraft, setNewProfileDraft] = useState<any | null>(null);

  //GET Pricing Profiles
  useEffect(() => {
    reloadProfiles();
  }, []);

  const reloadProfiles = () => {
    fetchPricingProfiles().then((data) => {
      setPricingProfiles(data || []);
      setLoading(false);
    });
  };

  const handleCreateNew = () => {
    setNewProfileDraft({
      id: `new-${Date.now()}`,
      name: 'New Pricing Profile',
      description: '',
      status: 'Draft',
      products: [],
      selectionType: 'one',
      adjustmentType: 'fixed',
      adjustmentOperation: 'increment',
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white text-black">
      {/* Sidebar */}
      <Sidebar />

      {/* Maincontent */}
      <div className="flex min-h-screen w-full flex-col items-center justify-start ml-[200px]"> 
        {/* Header */}
        <Header />

        {/* Pricing Profile Editor */}
        <div className="w-full h-full p-4 flex items-center justify-center">
          <main className="flex flex-col items-start justify-start w-full max-w-7xl h-full bg-[#f1f1f1] rounded-xl p-6 gap-4">
            {/* Title */}
            <div className="flex flex-col items-start justify-start w-full h-full"> 
              <h1 className="text-2xl font-bold text-gray-800">Pricing Profiles</h1>
              <p className="text-sm text-gray-500 my-2">Setup your pricing profile, select the products, and assign customers to the pricing profile</p>
              <button onClick={handleCreateNew} className="mt-2 px-3 py-2 text-sm bg-green-700 text-white rounded-md hover:bg-green-600">Create New Profile</button>
            </div>
            {/* Pricing Profiles */}
            <div className="flex flex-col items-start justify-start w-full h-full gap-4">
              {loading ? <p>Loading...</p> :
                pricingProfiles.map((profile) => (
                  <PricingProfile key={profile.id} profile={profile} pricingProfiles={pricingProfiles} onSaved={reloadProfiles} />
                ))
              }
              {newProfileDraft && (
                <PricingProfile
                  key={newProfileDraft.id}
                  profile={newProfileDraft}
                  pricingProfiles={pricingProfiles}
                  isNew
                  defaultOpen
                  onSaved={() => { reloadProfiles(); setNewProfileDraft(null); }}
                  onCancelNew={() => setNewProfileDraft(null)}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

