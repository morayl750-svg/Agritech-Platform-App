import { useState } from 'react'
import { Plus } from 'lucide-react'
import { FarmTabs } from '@/components/farm/FarmTabs'
import { DataTable, type Column } from '@/components/farm/DataTable'
import { StatusBadge } from '@/components/farm/StatusBadge'
import { AddFarmRecordModal } from '@/components/farm/AddFarmRecordModal'
import { Skeleton } from '@/components/ui/Skeleton'
import { useFarmData } from '@/hooks/useFarmData'
import type { FarmTab, LivestockRecord, CropRecord } from '@/types'

export default function LivestockCrops() {
  const [activeTab, setActiveTab] = useState<FarmTab>('livestock')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { livestock, crops, isLoading, refetchAll } = useFarmData()

  // Livestock Table Columns
  const livestockColumns: Column<LivestockRecord>[] = [
    {
      header: 'Animal Type',
      accessor: (item) => <span className="font-semibold text-gray-900">{item.animal_type}</span>,
    },
    {
      header: 'Herd Count',
      accessor: (item) => <span className="font-medium text-gray-800">{item.count} head</span>,
    },
    {
      header: 'Health Status',
      accessor: (item) => <StatusBadge status={item.health_status} />,
    },
    {
      header: 'Last Vaccination',
      accessor: (item) => item.last_vaccination || '—',
    },
    {
      header: 'Notes & Location',
      accessor: (item) => (
        <span className="text-gray-500 max-w-xs truncate block">{item.notes || '—'}</span>
      ),
    },
  ]

  // Crops Table Columns
  const cropsColumns: Column<CropRecord>[] = [
    {
      header: 'Crop Name',
      accessor: (item) => <span className="font-semibold text-gray-900">{item.crop_name}</span>,
    },
    {
      header: 'Plot Identifier',
      accessor: (item) => (
        <span className="font-mono text-[11px] bg-gray-100 px-2 py-0.5 rounded border border-gray-200 text-gray-700">
          {item.plot_number}
        </span>
      ),
    },
    {
      header: 'Growth Status',
      accessor: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: 'Planted Date',
      accessor: (item) => item.planted_date,
    },
    {
      header: 'Expected Yield',
      accessor: (item) => <span className="font-medium text-gray-800">{item.expected_yield}</span>,
    },
  ]

  return (
    <div className="w-full flex flex-col gap-6 items-stretch pb-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Livestock & Crops</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Farm management journal for Somali herds and crop plots.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 text-xs font-medium transition-colors cursor-pointer shadow-2xs self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>Add Record</span>
        </button>
      </div>

      {/* Farm Tabs */}
      <FarmTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        livestockCount={livestock.length}
        cropsCount={crops.length}
      />

      {/* Main Content Area */}
      {isLoading ? (
        <div className="w-full rounded-xl border border-gray-200 bg-white p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
            </div>
          ))}
        </div>
      ) : activeTab === 'livestock' ? (
        <DataTable
          columns={livestockColumns}
          data={livestock}
          emptyMessage="No livestock records found in database."
        />
      ) : (
        <DataTable
          columns={cropsColumns}
          data={crops}
          emptyMessage="No crop plot records found in database."
        />
      )}

      {/* Add Record Modal */}
      <AddFarmRecordModal
        isOpen={isModalOpen}
        activeTab={activeTab}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refetchAll}
      />
    </div>
  )
}
