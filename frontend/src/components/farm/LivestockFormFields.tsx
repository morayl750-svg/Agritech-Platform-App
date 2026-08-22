import type { AnimalType, AnimalHealthStatus } from '@/types'

interface LivestockFormFieldsProps {
  animalType: AnimalType
  setAnimalType: (val: AnimalType) => void
  animalCount: string
  setAnimalCount: (val: string) => void
  healthStatus: AnimalHealthStatus
  setHealthStatus: (val: AnimalHealthStatus) => void
  lastVaccination: string
  setLastVaccination: (val: string) => void
  notes: string
  setNotes: (val: string) => void
}

export function LivestockFormFields({
  animalType,
  setAnimalType,
  animalCount,
  setAnimalCount,
  healthStatus,
  setHealthStatus,
  lastVaccination,
  setLastVaccination,
  notes,
  setNotes,
}: LivestockFormFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Animal Type</label>
          <select
            value={animalType}
            onChange={(e) => setAnimalType(e.target.value as AnimalType)}
            className="w-full text-xs border border-gray-200 rounded-lg p-2 bg-white outline-none focus:border-gray-400"
          >
            <option value="Camel">Camel</option>
            <option value="Goat">Goat</option>
            <option value="Sheep">Sheep</option>
            <option value="Cattle">Cattle</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Herd Count</label>
          <input
            type="number"
            min="1"
            required
            value={animalCount}
            onChange={(e) => setAnimalCount(e.target.value)}
            className="w-full text-xs border border-gray-200 rounded-lg p-2 outline-none focus:border-gray-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Health Status</label>
          <select
            value={healthStatus}
            onChange={(e) => setHealthStatus(e.target.value as AnimalHealthStatus)}
            className="w-full text-xs border border-gray-200 rounded-lg p-2 bg-white outline-none focus:border-gray-400"
          >
            <option value="Healthy">Healthy</option>
            <option value="Sick">Sick</option>
            <option value="Recovering">Recovering</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Last Vaccination Date</label>
          <input
            type="date"
            value={lastVaccination}
            onChange={(e) => setLastVaccination(e.target.value)}
            className="w-full text-xs border border-gray-200 rounded-lg p-2 outline-none focus:border-gray-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Notes & Observations</label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Pasture region, vaccination details, or barn location..."
          className="w-full text-xs border border-gray-200 rounded-lg p-2 outline-none focus:border-gray-400 resize-none"
        />
      </div>
    </>
  )
}
