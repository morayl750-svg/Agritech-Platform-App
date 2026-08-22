import { useState } from 'react'
import { MapPin, Phone, Mail, Award, Edit3, Sprout, ShoppingBag, MessageSquare } from 'lucide-react'
import { EditProfileModal } from '@/components/profile/EditProfileModal'

export default function Profile() {
  const [name, setName] = useState('Amina Barre')
  const [email, setEmail] = useState('amina.barre@agrismart.so')
  const [phone, setPhone] = useState('+252 61 555 0192')
  const [region, setRegion] = useState('Lower Shabelle (Afgooye Sector)')
  const [farmSize, setFarmSize] = useState('15 Hectares (Sorghum & Sesame)')
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="w-full flex flex-col gap-6 items-stretch pb-10 max-w-4xl mx-auto">
      {/* Page Title Header */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Enterprise Profile</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage your agricultural identity, contact details, and farm enterprise credentials.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-800 text-xs font-medium transition-colors cursor-pointer shadow-2xs"
        >
          <Edit3 size={14} />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Main Profile Card Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-900 text-white font-bold text-xl flex items-center justify-center shadow-md border-2 border-white flex-shrink-0">
            AB
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">{name}</h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Award size={10} /> Verified Enterprise Agronomist
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              <MapPin size={12} className="text-gray-400" /> {region}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gray-100 text-gray-800">
            <Sprout size={18} />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">23 Plots</p>
            <p className="text-[11px] text-gray-400">Active Herd & Crop Plots</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gray-100 text-gray-800">
            <ShoppingBag size={18} />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">4 Products</p>
            <p className="text-[11px] text-gray-400">Listed Marketplace Products</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gray-100 text-gray-800">
            <MessageSquare size={18} />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">12 Posts</p>
            <p className="text-[11px] text-gray-400">Community Advisory Contributions</p>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-3">
          Contact & Agronomic Credentials
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-gray-400 block font-medium mb-1">Email Address</span>
            <p className="text-gray-900 font-medium flex items-center gap-1.5">
              <Mail size={13} className="text-gray-400" /> {email}
            </p>
          </div>

          <div>
            <span className="text-gray-400 block font-medium mb-1">Phone / WhatsApp</span>
            <p className="text-gray-900 font-medium flex items-center gap-1.5">
              <Phone size={13} className="text-gray-400" /> {phone}
            </p>
          </div>

          <div>
            <span className="text-gray-400 block font-medium mb-1">Agricultural Region</span>
            <p className="text-gray-900 font-medium">{region}</p>
          </div>

          <div>
            <span className="text-gray-400 block font-medium mb-1">Farm Scale & Crops</span>
            <p className="text-gray-900 font-medium">{farmSize}</p>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal Component */}
      <EditProfileModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        phone={phone}
        setPhone={setPhone}
        region={region}
        setRegion={setRegion}
        farmSize={farmSize}
        setFarmSize={setFarmSize}
      />
    </div>
  )
}
