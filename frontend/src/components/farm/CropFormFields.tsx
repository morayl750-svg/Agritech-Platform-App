import type { CropStatus } from '@/types'

interface CropFormFieldsProps {
  cropName: string
  setCropName: (val: string) => void
  plotNumber: string
  setPlotNumber: (val: string) => void
  cropStatus: CropStatus
  setCropStatus: (val: CropStatus) => void
  plantedDate: string
  setPlantedDate: (val: string) => void
  expectedYield: string
  setExpectedYield: (val: string) => void
}

export function CropFormFields({
  cropName,
  setCropName,
  plotNumber,
  setPlotNumber,
  cropStatus,
  setCropStatus,
  plantedDate,
  setPlantedDate,
  expectedYield,
  setExpectedYield,
}: CropFormFieldsProps) {
  return (
    <>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Crop Name</label>
        <input
          type="text"
          required
          placeholder="e.g. Drought-Resistant Sorghum, White Sesame"
          value={cropName}
          onChange={(e) => setCropName(e.target.value)}
          className="w-full text-xs border border-gray-200 rounded-lg p-2 outline-none focus:border-gray-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Plot Identifier</label>
          <input
            type="text"
            required
            placeholder="e.g. Plot H-04"
            value={plotNumber}
            onChange={(e) => setPlotNumber(e.target.value)}
            className="w-full text-xs border border-gray-200 rounded-lg p-2 outline-none focus:border-gray-400"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Growth Status</label>
          <select
            value={cropStatus}
            onChange={(e) => setCropStatus(e.target.value as CropStatus)}
            className="w-full text-xs border border-gray-200 rounded-lg p-2 bg-white outline-none focus:border-gray-400"
          >
            <option value="Planted">Planted</option>
            <option value="Growing">Growing</option>
            <option value="Ready">Ready</option>
            <option value="Harvested">Harvested</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Planted Date</label>
          <input
            type="date"
            required
            value={plantedDate}
            onChange={(e) => setPlantedDate(e.target.value)}
            className="w-full text-xs border border-gray-200 rounded-lg p-2 outline-none focus:border-gray-400"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Expected Yield</label>
          <input
            type="text"
            required
            placeholder="e.g. 15 Sacks (1,500 kg)"
            value={expectedYield}
            onChange={(e) => setExpectedYield(e.target.value)}
            className="w-full text-xs border border-gray-200 rounded-lg p-2 outline-none focus:border-gray-400"
          />
        </div>
      </div>
    </>
  )
}
