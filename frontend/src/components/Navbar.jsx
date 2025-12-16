import React from 'react'
import { Calendar } from 'lucide-react'

const Navbar = ( { selectedDate, onDateClick } ) => {
    const CalendarWidget = () => {
        const currentDate = new Date( '2024-11-06' )
        const currentMonth = currentDate.getMonth()
        const currentYear = currentDate.getFullYear()

        const daysInMonth = new Date( currentYear, currentMonth + 1, 0 ).getDate()
        const firstDayOfMonth = new Date( currentYear, currentMonth, 1 ).getDay()

        const days = []

        // Empty cells for days before month starts
        for ( let i = 0; i < firstDayOfMonth; i++ ) {
            days.push( <div key={`empty-${i}`} className="p-2"></div> )
        }

        // Days of the month
        for ( let day = 1; day <= daysInMonth; day++ ) {
            const dateStr = `${currentYear}-${String( currentMonth + 1 ).padStart( 2, '0' )}-${String( day ).padStart( 2, '0' )}`
            const isSelected = selectedDate === dateStr
            const isToday = day === currentDate.getDate()

            days.push(
                <div
                    key={day}
                    className={`p-2 text-center cursor-pointer rounded hover:bg-blue-50 ${isSelected ? 'bg-blue-500 text-white' : ''
                        } ${isToday ? 'font-bold border border-blue-300' : ''}`}
                    onClick={() => onDateClick( dateStr )}
                >
                    {day}
                </div>
            )
        }

        return (
            <div className="bg-white rounded-lg p-4 shadow">
                <h3 className="font-semibold mb-4">November 2024</h3>
                <div className="grid grid-cols-7 gap-1 text-sm">
                    <div className="p-2 text-center font-medium text-gray-500">Su</div>
                    <div className="p-2 text-center font-medium text-gray-500">Mo</div>
                    <div className="p-2 text-center font-medium text-gray-500">Tu</div>
                    <div className="p-2 text-center font-medium text-gray-500">We</div>
                    <div className="p-2 text-center font-medium text-gray-500">Th</div>
                    <div className="p-2 text-center font-medium text-gray-500">Fr</div>
                    <div className="p-2 text-center font-medium text-gray-500">Sa</div>
                    {days}
                </div>

                <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span>Confirmed</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        <span>Scheduled</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                        <span>Completed</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        <span>Cancelled</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="lg:col-span-1">
            <CalendarWidget />
        </div>
    )
}

export default Navbar;