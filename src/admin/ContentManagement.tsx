import React from 'react';
import {
  Save,
  User,
  Store,
  Phone,
  Mail,
  MapPin,
  Clock3,
  Camera,
  BadgeCheck,
  Instagram,
  Facebook,
  Globe,
} from 'lucide-react';
import {
  OwnerProfile,
  defaultOwnerProfile,
  getOwnerProfile,
  saveOwnerProfile,
} from '../utils/ownerProfile';
import { api } from '../services/api';

const ContentManagement = () => {
  const [activeSection, setActiveSection] = React.useState<'owner' | 'shop' | 'contact' | 'social'>('owner');
  const [saved, setSaved] = React.useState(false);
  const [uploadingPhoto, setUploadingPhoto] = React.useState(false);
  const [uploadError, setUploadError] = React.useState('');
  const [profile, setProfile] = React.useState<OwnerProfile>(() => ({ ...defaultOwnerProfile, ...getOwnerProfile() }));
  const ownerPhotoInputRef = React.useRef<HTMLInputElement | null>(null);

  const updateField = (field: keyof OwnerProfile, value: string) => {
    setSaved(false);
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const saveProfile = () => {
    saveOwnerProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleOwnerPhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setUploadingPhoto(true);

    try {
      const result = await api.uploadImage(file);
      if (!result?.success || !result?.imageUrl) {
        throw new Error(result?.error || 'Upload failed');
      }
      updateField('profileImageUrl', result.imageUrl);
    } catch (error: any) {
      setUploadError(error?.message || 'Failed to upload image');
    } finally {
      setUploadingPhoto(false);
      if (ownerPhotoInputRef.current) {
        ownerPhotoInputRef.current.value = '';
      }
    }
  };

  const sectionButton = (id: 'owner' | 'shop' | 'contact' | 'social', label: string, Icon: React.ComponentType<any>) => (
    <button
      key={id}
      onClick={() => setActiveSection(id)}
      className={`w-full flex items-center space-x-3 px-5 py-4 rounded-2xl border text-sm font-bold transition-all ${
        activeSection === id
          ? 'bg-[#C5A059]/90 text-white border-[#f5deb1] shadow-[0_10px_26px_rgba(197,160,89,0.30)]'
          : 'bg-white text-zinc-700 border-[#C5A059]/20 hover:border-[#C5A059]/45 hover:text-zinc-900'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tighter">Shop Owner Profile</h1>
          <p className="text-zinc-600 text-sm mt-1">Manage professional owner details shown across your salon brand channels.</p>
        </div>
        <button
          onClick={saveProfile}
          className="px-6 py-3 bg-[#C5A059]/90 border border-[#f5deb1] text-white text-sm font-bold rounded-xl hover:bg-[#B48F48] transition-all flex items-center"
        >
          <Save className="h-4 w-4 mr-2" />
          {saved ? 'Saved' : 'Save Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation */}
        <div className="lg:col-span-1 space-y-4">
          {sectionButton('owner', 'Owner Details', User)}
          {sectionButton('shop', 'Shop Identity', Store)}
          {sectionButton('contact', 'Contact & Hours', Clock3)}
          {sectionButton('social', 'Social Presence', Globe)}
        </div>

        {/* Editor */}
        <div className="lg:col-span-2 space-y-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#C5A059]/20 space-y-8 shadow-[0_20px_60px_rgba(197,160,89,0.10)]">
            <h3 className="text-xl font-bold text-zinc-900 flex items-center">
              {activeSection === 'owner' && <User className="h-5 w-5 mr-3 text-[#C5A059]" />}
              {activeSection === 'shop' && <Store className="h-5 w-5 mr-3 text-[#C5A059]" />}
              {activeSection === 'contact' && <Clock3 className="h-5 w-5 mr-3 text-[#C5A059]" />}
              {activeSection === 'social' && <Globe className="h-5 w-5 mr-3 text-[#C5A059]" />}
              {activeSection === 'owner' && 'Owner Details'}
              {activeSection === 'shop' && 'Shop Identity'}
              {activeSection === 'contact' && 'Contact & Working Hours'}
              {activeSection === 'social' && 'Social & Public Presence'}
            </h3>

            {activeSection === 'owner' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Owner Full Name</label>
                  <input
                    type="text"
                    value={profile.ownerName}
                    onChange={(e) => updateField('ownerName', e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#C5A059]/25 rounded-xl px-4 py-3 text-zinc-900 focus:border-[#C5A059] outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Professional Role</label>
                    <input
                      type="text"
                      value={profile.role}
                      onChange={(e) => updateField('role', e.target.value)}
                      className="w-full bg-[#FDFBF7] border border-[#C5A059]/25 rounded-xl px-4 py-3 text-zinc-900 focus:border-[#C5A059] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Years of Experience</label>
                    <input
                      type="text"
                      value={profile.yearsExperience}
                      onChange={(e) => updateField('yearsExperience', e.target.value)}
                      className="w-full bg-[#FDFBF7] border border-[#C5A059]/25 rounded-xl px-4 py-3 text-zinc-900 focus:border-[#C5A059] outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Profile Summary</label>
                  <textarea
                    rows={4}
                    value={profile.bio}
                    onChange={(e) => updateField('bio', e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#C5A059]/25 rounded-xl px-4 py-3 text-zinc-900 focus:border-[#C5A059] outline-none transition-all resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Owner Photo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-[#C5A059]/25 bg-[#F5EEE0]">
                      <img src={profile.profileImageUrl} alt="Owner" className="w-full h-full object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={() => ownerPhotoInputRef.current?.click()}
                      disabled={uploadingPhoto}
                      className="px-4 py-3 rounded-xl border border-[#f5deb1] bg-[#C5A059]/90 text-white text-xs font-bold shadow-[0_10px_24px_rgba(197,160,89,0.35)] hover:bg-[#B48F48] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {uploadingPhoto ? 'Uploading...' : 'Upload Image'}
                    </button>
                    <Camera className="h-5 w-5 text-[#C5A059]" />
                    <input
                      ref={ownerPhotoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleOwnerPhotoUpload}
                    />
                  </div>
                  <p className="text-[11px] text-zinc-500">Upload directly from your device. Manual URL editing is disabled.</p>
                  {uploadError && (
                    <p className="text-xs text-red-600 font-medium">{uploadError}</p>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'shop' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Shop Name</label>
                  <input
                    type="text"
                    value={profile.shopName}
                    onChange={(e) => updateField('shopName', e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#C5A059]/25 rounded-xl px-4 py-3 text-zinc-900 focus:border-[#C5A059] outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Business Registration Number</label>
                  <input
                    type="text"
                    value={profile.businessRegNo}
                    onChange={(e) => updateField('businessRegNo', e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#C5A059]/25 rounded-xl px-4 py-3 text-zinc-900 focus:border-[#C5A059] outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Core Specialties (comma separated)</label>
                  <input
                    type="text"
                    value={profile.specialties}
                    onChange={(e) => updateField('specialties', e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#C5A059]/25 rounded-xl px-4 py-3 text-zinc-900 focus:border-[#C5A059] outline-none transition-all"
                  />
                </div>
                <div className="rounded-2xl border border-[#C5A059]/20 bg-[#FDFBF7] p-4 text-sm text-zinc-700 flex items-start gap-2">
                  <BadgeCheck className="h-5 w-5 text-[#C5A059] mt-0.5" />
                  Keep details accurate for invoices, social trust, and Google Business consistency.
                </div>
              </div>
            )}

            {activeSection === 'contact' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Shop Address</label>
                  <input
                    type="text"
                    value={profile.shopAddress}
                    onChange={(e) => updateField('shopAddress', e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#C5A059]/25 rounded-xl px-4 py-3 text-zinc-900 focus:border-[#C5A059] outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Google Maps Link</label>
                  <input
                    type="text"
                    value={profile.googleMapsUrl}
                    onChange={(e) => updateField('googleMapsUrl', e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#C5A059]/25 rounded-xl px-4 py-3 text-zinc-900 focus:border-[#C5A059] outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> Contact Phone</label>
                    <input
                      type="text"
                      value={profile.contactPhone}
                      onChange={(e) => updateField('contactPhone', e.target.value)}
                      className="w-full bg-[#FDFBF7] border border-[#C5A059]/25 rounded-xl px-4 py-3 text-zinc-900 focus:border-[#C5A059] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">WhatsApp</label>
                    <input
                      type="text"
                      value={profile.whatsapp}
                      onChange={(e) => updateField('whatsapp', e.target.value)}
                      className="w-full bg-[#FDFBF7] border border-[#C5A059]/25 rounded-xl px-4 py-3 text-zinc-900 focus:border-[#C5A059] outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> Public Email</label>
                  <input
                    type="text"
                    value={profile.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#C5A059]/25 rounded-xl px-4 py-3 text-zinc-900 focus:border-[#C5A059] outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2"><Clock3 className="h-3.5 w-3.5" /> Opening Hours</label>
                  <textarea
                    rows={3}
                    value={profile.openingHours}
                    onChange={(e) => updateField('openingHours', e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#C5A059]/25 rounded-xl px-4 py-3 text-zinc-900 focus:border-[#C5A059] outline-none transition-all resize-none"
                  />
                </div>
              </div>
            )}

            {activeSection === 'social' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2"><Instagram className="h-3.5 w-3.5" /> Instagram URL</label>
                  <input
                    type="text"
                    value={profile.instagram}
                    onChange={(e) => updateField('instagram', e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#C5A059]/25 rounded-xl px-4 py-3 text-zinc-900 focus:border-[#C5A059] outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2"><Facebook className="h-3.5 w-3.5" /> Facebook URL</label>
                  <input
                    type="text"
                    value={profile.facebook}
                    onChange={(e) => updateField('facebook', e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#C5A059]/25 rounded-xl px-4 py-3 text-zinc-900 focus:border-[#C5A059] outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Website URL</label>
                  <input
                    type="text"
                    value={profile.website}
                    onChange={(e) => updateField('website', e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#C5A059]/25 rounded-xl px-4 py-3 text-zinc-900 focus:border-[#C5A059] outline-none transition-all"
                  />
                </div>
                <div className="rounded-2xl border border-[#C5A059]/20 bg-[#FDFBF7] p-4 text-sm text-zinc-700 flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-[#C5A059] mt-0.5" />
                  Keep social URLs active and updated to increase booking trust and search visibility.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;
