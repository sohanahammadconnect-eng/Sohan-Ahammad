import React, { useState } from 'react';
import {
  Mail,
  MessageSquare,
  Copy,
  Check,
  Sparkles,
  MapPin,
  Clock,
  Globe,
  ExternalLink,
  Edit3,
  X,
  Phone,
  Send,
  Laptop
} from 'lucide-react';
import { ThemeMode } from '../types';
import { usePortfolio } from '../context/PortfolioContext';

interface ContactSectionProps {
  theme: ThemeMode;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const { data, updatePersonalInfo } = usePortfolio();
  const personalInfo = data.personalInfo;

  // Copy states
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Quick edit modal states
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [emailInput, setEmailInput] = useState(personalInfo.email || '');
  const [phoneInput, setPhoneInput] = useState(personalInfo.whatsappNumber || '+880 1700-000000');
  const [locationInput, setLocationInput] = useState(personalInfo.location || 'Dhaka, Bangladesh');
  const [availabilityInput, setAvailabilityInput] = useState(
    personalInfo.availability || 'Available for Worldwide Remote & Freelance Projects'
  );
  const [responseTimeInput, setResponseTimeInput] = useState(
    personalInfo.responseTime || 'Quick Response (under 2 hours)'
  );
  const [customWaMessage, setCustomWaMessage] = useState(
    'Hi Sohan, I saw your video editing & design portfolio and would love to discuss a project!'
  );
  const [customWaUrlInput, setCustomWaUrlInput] = useState(personalInfo.whatsappUrl || '');
  const [useManualWaUrl, setUseManualWaUrl] = useState(false);

  // Helper to generate proper WhatsApp link from phone number + message
  const generateWaLink = (phone: string, msg: string) => {
    let cleanDigits = phone.replace(/\D/g, '');
    // If entered local Bangladeshi 11 digit number like 017xxxxxxxx -> convert to 88017xxxxxxxx
    if (cleanDigits.startsWith('01') && cleanDigits.length === 11) {
      cleanDigits = '88' + cleanDigits;
    }
    // If entered without country code but 10 digits
    if (!cleanDigits) {
      return 'https://wa.me/?text=' + encodeURIComponent(msg);
    }
    return `https://wa.me/${cleanDigits}?text=${encodeURIComponent(msg)}`;
  };

  const handleOpenEdit = () => {
    setEmailInput(personalInfo.email || '');
    setPhoneInput(personalInfo.whatsappNumber || '+880 1700-000000');
    setLocationInput(personalInfo.location || 'Dhaka, Bangladesh');
    setAvailabilityInput(
      personalInfo.availability || 'Available for Worldwide Remote & Freelance Projects'
    );
    setResponseTimeInput(
      personalInfo.responseTime || 'Quick Response (under 2 hours)'
    );
    setCustomWaUrlInput(personalInfo.whatsappUrl || '');
    setIsEditingContact(true);
  };

  const handleSaveContact = () => {
    const finalEmail = emailInput.trim() || 'sohanahammad.connect@gmail.com';
    const finalPhone = phoneInput.trim() || '+880 1700-000000';
    const finalLocation = locationInput.trim() || 'Dhaka, Bangladesh';
    const finalAvailability = availabilityInput.trim() || 'Available for Worldwide Remote & Freelance Projects';
    const finalResponseTime = responseTimeInput.trim() || 'Quick Response (under 2 hours)';

    let finalWaUrl = customWaUrlInput.trim();
    if (!useManualWaUrl || !finalWaUrl) {
      finalWaUrl = generateWaLink(finalPhone, customWaMessage);
    } else if (!finalWaUrl.startsWith('http://') && !finalWaUrl.startsWith('https://')) {
      finalWaUrl = 'https://' + finalWaUrl;
    }

    updatePersonalInfo({
      email: finalEmail,
      whatsappNumber: finalPhone,
      whatsappUrl: finalWaUrl,
      location: finalLocation,
      availability: finalAvailability,
      responseTime: finalResponseTime,
    });

    setIsEditingContact(false);
    setToastMessage('যোগাযোগ ও লোকেশনের তথ্য সফলভাবে আপডেট হয়েছে!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleCopyPhone = () => {
    const phone = personalInfo.whatsappNumber || personalInfo.whatsappUrl;
    navigator.clipboard.writeText(phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  // Gmail Web Compose Link (Opens directly in Chrome / Web Browser Gmail tab)
  const gmailWebComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    personalInfo.email
  )}&su=${encodeURIComponent('Video Editing & Design Project Inquiry')}&body=${encodeURIComponent(
    `Hi ${personalInfo.name},\n\nI visited your portfolio and I would love to discuss an editing project with you.\n\nProject details:\n- Video Type:\n- Estimated Duration:\n- Timeline / Deadline:\n\nLooking forward to hearing from you!`
  )}`;

  return (
    <section id="contact" className="py-16 sm:py-24 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Outer Container Card */}
        <div
          id="contact-container"
          className={`rounded-3xl p-6 sm:p-10 lg:p-12 border transition-all duration-300 relative overflow-hidden shadow-2xl ${
            isDark
              ? 'bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950 border-slate-800'
              : 'bg-gradient-to-b from-white via-slate-50 to-slate-100/70 border-slate-200'
          }`}
        >
          {/* Header Row: Availability Badge + Quick Edit Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>{personalInfo.availability || 'Available for Worldwide Remote & Freelance Projects'}</span>
            </div>

            {/* Quick Edit Contact & Location Button */}
            <button
              id="btn-quick-edit-contact"
              type="button"
              onClick={handleOpenEdit}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                isDark
                  ? 'bg-slate-800/90 border-slate-700 text-amber-400 hover:bg-slate-700 hover:border-amber-500/50'
                  : 'bg-white border-slate-300 text-amber-600 hover:bg-slate-50 hover:border-amber-400'
              }`}
              title="Gmail, WhatsApp নম্বর এবং লোকেশন তথ্য এডিট করুন"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-500" />
              <span>যোগাযোগ ও লোকেশন পরিবর্তন</span>
            </button>
          </div>

          {/* Heading and Intro */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2
              id="contact-heading"
              className={`text-2xl sm:text-4xl font-display font-extrabold tracking-tight mb-3 ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}
            >
              Let's Create Something Memorable
            </h2>
            <p
              className={`text-sm sm:text-base leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Have a YouTube video, commercial cut, teaser, or visual identity you want to bring to life?
              Reach out directly through <span className="font-semibold text-amber-400">Gmail</span> or{' '}
              <span className="font-semibold text-emerald-400">WhatsApp</span>.
            </p>
          </div>

          {/* 3 Core Contact & Location Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

            {/* CARD 1: GMAIL & EMAIL */}
            <div
              id="card-contact-gmail"
              className={`rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] ${
                isDark
                  ? 'bg-slate-950/80 border-slate-800/90 hover:border-red-500/40 shadow-lg'
                  : 'bg-white border-slate-200/90 hover:border-red-400 shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center font-bold">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                    Primary Mail
                  </span>
                </div>

                <h3 className="font-display font-bold text-base text-white mb-1">
                  Gmail / Email
                </h3>
                <p className="text-xs text-slate-400 mb-3">
                  {personalInfo.responseTime || 'Quick Response (under 2 hours)'}
                </p>

                {/* Email address display with click to copy */}
                <div
                  onClick={handleCopyEmail}
                  className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer mb-4 group transition-colors ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 hover:border-amber-500/40'
                      : 'bg-slate-50 border-slate-200 hover:border-amber-400'
                  }`}
                  title="Click to copy email address"
                >
                  <span className="text-xs font-mono text-slate-200 truncate pr-2">
                    {personalInfo.email}
                  </span>
                  <button
                    type="button"
                    className="shrink-0 p-1 text-slate-400 group-hover:text-amber-400 transition-colors"
                  >
                    {copiedEmail ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-800/60">
                <a
                  id="btn-open-gmail-web"
                  href={gmailWebComposeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/20 flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gmail-এ মেল লিখুন (Web)</span>
                  <ExternalLink className="w-3 h-3 text-white/80" />
                </a>

                <a
                  id="btn-mailto-app"
                  href={`mailto:${personalInfo.email}?subject=Video%20Editing%20Project%20Inquiry`}
                  className={`w-full py-2 px-3 rounded-xl font-semibold text-xs border flex items-center justify-center gap-1.5 transition-all ${
                    isDark
                      ? 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Default Mail App</span>
                </a>
              </div>
            </div>

            {/* CARD 2: WHATSAPP ACCOUNT */}
            <div
              id="card-contact-whatsapp"
              className={`rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] ${
                isDark
                  ? 'bg-slate-950/80 border-slate-800/90 hover:border-emerald-500/40 shadow-lg'
                  : 'bg-white border-slate-200/90 hover:border-emerald-400 shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                    <MessageSquare className="w-5 h-5 fill-current" />
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Direct Chat
                  </span>
                </div>

                <h3 className="font-display font-bold text-base text-white mb-1">
                  WhatsApp Direct
                </h3>
                <p className="text-xs text-slate-400 mb-3">
                  Instant messaging, video review & audio calls
                </p>

                {/* Phone number display with click to copy */}
                <div
                  onClick={handleCopyPhone}
                  className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer mb-4 group transition-colors ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/40'
                      : 'bg-slate-50 border-slate-200 hover:border-emerald-400'
                  }`}
                  title="Click to copy WhatsApp number"
                >
                  <span className="text-xs font-mono text-emerald-300 font-semibold truncate pr-2 flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-emerald-400" />
                    {personalInfo.whatsappNumber || '+880 1700-000000'}
                  </span>
                  <button
                    type="button"
                    className="shrink-0 p-1 text-slate-400 group-hover:text-emerald-400 transition-colors"
                  >
                    {copiedPhone ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-800/60">
                <a
                  id="btn-open-whatsapp-chat"
                  href={personalInfo.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/25 flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02]"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-current" />
                  <span>WhatsApp-এ চ্যাট করুন</span>
                  <ExternalLink className="w-3 h-3 text-white/80" />
                </a>

                <button
                  type="button"
                  onClick={handleCopyPhone}
                  className={`w-full py-2 px-3 rounded-xl font-semibold text-xs border flex items-center justify-center gap-1.5 transition-all ${
                    isDark
                      ? 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {copiedPhone ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">নম্বর কপি হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>নম্বর কপি করুন</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* CARD 3: LOCATION & AVAILABILITY */}
            <div
              id="card-contact-location"
              className={`rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] ${
                isDark
                  ? 'bg-slate-950/80 border-slate-800/90 hover:border-amber-500/40 shadow-lg'
                  : 'bg-white border-slate-200/90 hover:border-amber-400 shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    <span>Remote Worldwide</span>
                  </span>
                </div>

                <h3 className="font-display font-bold text-base text-white mb-1">
                  Location & Working
                </h3>
                <p className="text-xs text-slate-400 mb-3">
                  Based in <strong className="text-white">{personalInfo.location || 'Dhaka, Bangladesh'}</strong>
                </p>

                {/* Location & Timezone pills */}
                <div className="space-y-2 mb-4">
                  <div
                    className={`p-2 rounded-xl border flex items-center gap-2 text-xs ${
                      isDark ? 'bg-slate-900/90 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate font-medium">{personalInfo.location || 'Dhaka, Bangladesh'}</span>
                  </div>

                  <div
                    className={`p-2 rounded-xl border flex items-center gap-2 text-xs ${
                      isDark ? 'bg-slate-900/90 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate font-mono">Timezone: GMT+6 (BST)</span>
                  </div>
                </div>
              </div>

              {/* Workflow Details */}
              <div className="pt-2 border-t border-slate-800/60">
                <div
                  className={`p-2.5 rounded-xl border text-[11px] leading-snug flex items-start gap-2 ${
                    isDark ? 'bg-slate-900/40 border-slate-800/70 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <Laptop className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    Google Drive, Dropbox ও Frame.io এর মাধ্যমে ফুল এইচডি / ৪কে ফাইল ডেলিভারি।
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Footer Note */}
          <div className="text-center pt-4 border-t border-slate-800/60">
            <p className="text-xs text-slate-400">
              💡 সরাসরি প্রজেক্ট বা কাজের ব্যাপারে কথা বলতে উপরের যেকোনো একটি মাধ্যমে মেসেজ দিন।
            </p>
          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2 animate-fade-in">
              <Check className="w-4 h-4" />
              <span>{toastMessage}</span>
            </div>
          )}

        </div>

      </div>

      {/* ========================================================= */}
      {/* QUICK EDIT CONTACT & LOCATION MODAL                       */}
      {/* ========================================================= */}
      {isEditingContact && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto"
          onClick={() => setIsEditingContact(false)}
        >
          <div
            className="relative max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-100 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-white">
                    যোগাযোগ ও লোকেশন সেটআপ
                  </h3>
                  <p className="text-xs text-slate-400">
                    আপনার Gmail, WhatsApp এবং লোকেশন তথ্য মনের মতো সাজিয়ে নিন
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditingContact(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">

              {/* 1. Gmail Address */}
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-red-400" />
                  <span>Gmail / Email Address:</span>
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  ক্লায়েন্টরা এই ইমেইলে সরাসরি মেসেজ পাঠাবে বা কপি করবে।
                </p>
              </div>

              {/* 2. WhatsApp Phone Number & Generator */}
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp ফোন নম্বর:</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setUseManualWaUrl(!useManualWaUrl)}
                    className="text-[10px] text-amber-400 hover:underline"
                  >
                    {useManualWaUrl ? 'নম্বর দিয়ে অটো লিংক' : 'কাস্টম লিংক বসাতে চান?'}
                  </button>
                </div>

                {!useManualWaUrl ? (
                  <>
                    <input
                      type="text"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="+880 1700-000000 অথবা 017xxxxxxxx"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />

                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">
                        হোয়াটসঅ্যাপে ক্লায়েন্টের অটো মেসেজ (Default Message):
                      </label>
                      <input
                        type="text"
                        value={customWaMessage}
                        onChange={(e) => setCustomWaMessage(e.target.value)}
                        placeholder="Hi Sohan, I want to discuss a video project..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="text-[11px] text-emerald-400/90 font-mono bg-emerald-950/30 p-2 rounded-xl border border-emerald-800/40 break-all">
                      🔗 Generated Link: {generateWaLink(phoneInput, customWaMessage)}
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">
                      Direct WhatsApp URL (যেমন: wa.link/xxxxxx):
                    </label>
                    <input
                      type="url"
                      value={customWaUrlInput}
                      onChange={(e) => setCustomWaUrlInput(e.target.value)}
                      placeholder="https://wa.me/8801700000000"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                )}
              </div>

              {/* 3. Location (City, Country) */}
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>বর্তমান লোকেশন (Location):</span>
                </label>
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder="Dhaka, Bangladesh"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  উদাহরণ: "Dhaka, Bangladesh" অথবা "Chittagong, Bangladesh"
                </p>
              </div>

              {/* 4. Availability & Response Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    কাজের স্ট্যাটাস (Availability):
                  </label>
                  <input
                    type="text"
                    value={availabilityInput}
                    onChange={(e) => setAvailabilityInput(e.target.value)}
                    placeholder="Available for Remote Projects"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    রেসপন্স টাইম (Response Time):
                  </label>
                  <input
                    type="text"
                    value={responseTimeInput}
                    onChange={(e) => setResponseTimeInput(e.target.value)}
                    placeholder="Replies in under 2 hours"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-4 mt-5 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsEditingContact(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleSaveContact}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>তথ্য সংরক্ষণ করুন</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
