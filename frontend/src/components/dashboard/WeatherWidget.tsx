import type { WeatherDay, WeatherMetric } from '@/types'

interface WeatherWidgetProps {
  location: string
  tempCelsius: number
  condition: string
  metrics: WeatherMetric[]
  forecast: WeatherDay[]
}

export function WeatherWidget({
  location,
  tempCelsius,
  condition,
  metrics,
  forecast,
}: WeatherWidgetProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900">Weather — {location}</h2>
      </div>
      <div className="px-5 py-5 flex flex-col gap-4">
        {/* Current temperature */}
        <div className="flex items-end gap-2">
          <span className="text-4xl font-semibold tracking-tight text-gray-900">
            {tempCelsius}°C
          </span>
          <span className="text-sm text-gray-400 mb-1.5">{condition}</span>
        </div>

        {/* Weather metrics */}
        <div className="grid grid-cols-3 gap-3">
          {metrics.map((metric) => (
            <div key={metric.label} className="bg-gray-50 rounded-md px-3 py-2.5">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">
                {metric.label}
              </p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">{metric.value}</p>
            </div>
          ))}
        </div>

        {/* 7-day forecast */}
        <div className="mt-1">
          <p className="text-xs font-medium text-gray-500 mb-2">7-Day Forecast</p>
          <div className="flex justify-between">
            {forecast.map((day) => (
              <div key={day.day} className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-gray-400">{day.day}</span>
                <div
                  className="w-1 rounded-full bg-sky-200"
                  style={{ height: `${day.rainHeight}px` }}
                  aria-hidden="true"
                />
                <span className="text-[10px] font-medium text-gray-700">{day.tempCelsius}°</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
