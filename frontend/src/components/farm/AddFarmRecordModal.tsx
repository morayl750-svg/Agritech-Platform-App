import { useState, type FormEvent } from 'react'
import { X, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { LivestockFormFields } from '@/components/farm/LivestockFormFields'
import { CropFormFields } from '@/components/farm/CropFormFields'
import type { AddFarmRecordModalProps, AnimalType, AnimalHealthStatus, CropStatus } from '@/types'

export function AddFarmRecordModal({
  isOpen,
  activeTab,
  onClose,
  onSuccess,
}: AddFarmRecordModalProps) {
  const [animalType, setAnimalType] = useState<AnimalType>('Camel')
  const [animalCount, setAnimalCount] = useState('10')
  const [healthStatus, setHealthStatus] = useState<AnimalHealthStatus>('Healthy')
  const [lastVaccination, setLastVaccination] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [notes, setNotes] = useState('')

  const [cropName, setCropName] = useState('')
  const [plotNumber, setPlotNumber] = useState('Plot H-01')
  const [cropStatus, setCropStatus] = useState<CropStatus>('Growing')
  const [plantedDate, setPlantedDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [expectedYield, setExpectedYield] = useState('10 Sacks (1000kg)')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (activeTab === 'livestock') {
        const { error: err } = await supabase.from('livestock').insert([
          {
            animal_type: animalType,
            count: Number(animalCount),
            health_status: healthStatus,
            last_vaccination: lastVaccination || null,
            notes: notes.trim() || null,
          },
        ])
        if (err) throw err
      } else {
        if (!cropName.trim()) throw new Error('Crop name is required')
        const { error: err } = await supabase.from('crops').insert([
          {
            crop_name: cropName.trim(),
            plot_number: plotNumber.trim(),
            status: cropStatus,
            planted_date: plantedDate,
            expected_yield: expectedYield.trim(),
          },
        ])
        if (err) throw err
      }

      onSuccess()
      onClose()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save record'
      setError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Add {activeTab === 'livestock' ? 'Livestock Record' : 'Crop Plot Record'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Enter details to persist into farm management database.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          {activeTab === 'livestock' ? (
            <LivestockFormFields
              animalType={animalType}
              setAnimalType={setAnimalType}
              animalCount={animalCount}
              setAnimalCount={setAnimalCount}
              healthStatus={healthStatus}
              setHealthStatus={setHealthStatus}
              lastVaccination={lastVaccination}
              setLastVaccination={setLastVaccination}
              notes={notes}
              setNotes={setNotes}
            />
          ) : (
            <CropFormFields
              cropName={cropName}
              setCropName={setCropName}
              plotNumber={plotNumber}
              setPlotNumber={setPlotNumber}
              cropStatus={cropStatus}
              setCropStatus={setCropStatus}
              plantedDate={plantedDate}
              setPlantedDate={setPlantedDate}
              expectedYield={expectedYield}
              setExpectedYield={setExpectedYield}
            />
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
            >
              {isSubmitting && <Loader2 size={13} className="animate-spin" />}
              <span>Save Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
