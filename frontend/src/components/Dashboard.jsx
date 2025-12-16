import React from 'react'
import {
    Calendar,
    Users,
    Clock,
    TrendingUp,
    Activity,
    UserCheck,
    Video,
    MapPin
} from 'lucide-react'

const Dashboard = ( { stats } ) => {
    const quickStats = [
        {
            title: "Today's Appointments",
            value: stats?.today || 0,
            icon: Calendar,
            color: "bg-blue-500",
            change: "+12%"
        },
        {
            title: "Total Patients",
            value: "1,234",
            icon: Users,
            color: "bg-green-500",
            change: "+5%"
        },
        {
            title: "Confirmed Today",
            value: stats?.confirmed || 0,
            icon: UserCheck,
            color: "bg-purple-500",
            change: "+8%"
        },
        {
            title: "Telemedicine",
            value: stats?.telemedicine || 0,
            icon: Video,
            color: "bg-orange-500",
            change: "+15%"
        }
    ]

    const recentActivity = [
        {
            id: 1,
            action: "New appointment scheduled",
            patient: "Sarah Johnson",
            time: "2 minutes ago",
            type: "appointment"
        },
        {
            id: 2,
            action: "Appointment confirmed",
            patient: "Michael Chen",
            time: "5 minutes ago",
            type: "confirmation"
        },
        {
            id: 3,
            action: "Patient checked in",
            patient: "Emily Rodriguez",
            time: "10 minutes ago",
            type: "checkin"
        }
    ]

    return (
        <div className="p-6 space-y-6">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                <h1 className="text-2xl font-bold mb-2">Welcome to EMR Dashboard</h1>
                <p className="text-blue-100">Here's what's happening with your appointments today</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickStats.map( ( stat, index ) => {
                    const Icon = stat.icon
                    return (
                        <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-sm text-green-600 font-medium">{stat.change} from yesterday</p>
                                </div>
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </div>
                    )
                } )}
            </div>

            {/* Charts and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <button className="w-full flex items-center p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                            <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                            <div>
                                <p className="font-medium text-gray-900">Schedule New Appointment</p>
                                <p className="text-sm text-gray-500">Book a new patient appointment</p>
                            </div>
                        </button>
                        <button className="w-full flex items-center p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                            <Users className="h-5 w-5 text-green-600 mr-3" />
                            <div>
                                <p className="font-medium text-gray-900">Add New Patient</p>
                                <p className="text-sm text-gray-500">Register a new patient</p>
                            </div>
                        </button>
                        <button className="w-full flex items-center p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                            <Activity className="h-5 w-5 text-purple-600 mr-3" />
                            <div>
                                <p className="font-medium text-gray-900">View Reports</p>
                                <p className="text-sm text-gray-500">Check analytics and reports</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {recentActivity.map( ( activity ) => (
                            <div key={activity.id} className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Activity className="h-4 w-4 text-blue-600" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                                    <p className="text-sm text-gray-500">{activity.patient}</p>
                                </div>
                                <div className="text-xs text-gray-400">{activity.time}</div>
                            </div>
                        ) )}
                    </div>
                </div>
            </div>

            {/* Upcoming Appointments Preview */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View All
                    </button>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div>
                                <p className="font-medium text-gray-900">Sarah Johnson</p>
                                <p className="text-sm text-gray-500">Diabetes Management Review</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">9:00 AM</p>
                            <p className="text-xs text-gray-500">Dr. Rajesh Kumar</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div>
                                <p className="font-medium text-gray-900">Michael Chen</p>
                                <p className="text-sm text-gray-500">Annual Physical Examination</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">10:00 AM</p>
                            <p className="text-xs text-gray-500">Dr. Maya Sharma</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard