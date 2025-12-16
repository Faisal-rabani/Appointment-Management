import React, { useState } from 'react'
import {
    Search,
    LayoutDashboard,
    Menu,
    Activity,
    Calendar,
    Clock,
    Link,
    Users,
    Plus,
    Sparkles,
    Settings,
    Home,
    FileText,
    BarChart3,
    UserCheck,
    Stethoscope
} from 'lucide-react'

const VerticalSidebar = ( { activeSection, onSectionChange, user } ) => {
    const [isExpanded, setIsExpanded] = useState( false )

    const menuItems = [
        { id: 'search', icon: Search, label: 'Search', color: 'text-gray-600' },
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'text-blue-600' },
        { id: 'menu', icon: Menu, label: 'Menu', color: 'text-gray-600' },
        { id: 'analytics', icon: Activity, label: 'Analytics', color: 'text-green-600' },
        { id: 'appointments', icon: Calendar, label: 'Appointments', color: 'text-purple-600' },
        { id: 'schedule', icon: Clock, label: 'Schedule', color: 'text-orange-600' },
        { id: 'reports', icon: Link, label: 'Reports', color: 'text-indigo-600' },
        { id: 'patients', icon: Users, label: 'Patients', color: 'text-teal-600' }
    ]

    const bottomItems = [
        { id: 'add', icon: Plus, label: 'Add New', color: 'text-gray-800' },
        { id: 'ai', icon: Sparkles, label: 'AI Assistant', color: 'text-yellow-600' }
    ]

    const handleItemClick = ( itemId ) => {
        onSectionChange( itemId )
    }

    return (
        <div
            className={`fixed left-0 top-0 h-full bg-white shadow-lg border-r border-gray-200 transition-all duration-300 z-40 ${isExpanded ? 'w-64' : 'w-16'
                }`}
            onMouseEnter={() => setIsExpanded( true )}
            onMouseLeave={() => setIsExpanded( false )}
        >
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Stethoscope className="h-5 w-5 text-white" />
                    </div>
                    {isExpanded && (
                        <div>
                            <h1 className="text-lg font-semibold text-gray-900">EMR System</h1>
                            <p className="text-xs text-gray-500">Healthcare Management</p>
                        </div>
                    )}
                </div>
            </div>

            {/* User Info */}
            {isExpanded && user && (
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <UserCheck className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {user.fullName || user.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{user.role}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Menu Items */}
            <div className="flex-1 py-4">
                <nav className="space-y-1 px-2">
                    {menuItems.map( ( item ) => {
                        const Icon = item.icon
                        const isActive = activeSection === item.id

                        return (
                            <button
                                key={item.id}
                                onClick={() => handleItemClick( item.id )}
                                className={`w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 group ${isActive
                                        ? 'bg-blue-50 border-r-2 border-blue-600'
                                        : 'hover:bg-gray-50'
                                    }`}
                                title={!isExpanded ? item.label : ''}
                            >
                                <Icon
                                    className={`h-5 w-5 ${isActive ? 'text-blue-600' : item.color
                                        } group-hover:scale-110 transition-transform`}
                                />
                                {isExpanded && (
                                    <span className={`ml-3 text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-700'
                                        }`}>
                                        {item.label}
                                    </span>
                                )}
                            </button>
                        )
                    } )}
                </nav>
            </div>

            {/* Bottom Items */}
            <div className="border-t border-gray-200 p-2">
                {bottomItems.map( ( item ) => {
                    const Icon = item.icon
                    const isActive = activeSection === item.id

                    return (
                        <button
                            key={item.id}
                            onClick={() => handleItemClick( item.id )}
                            className={`w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 group mb-2 ${isActive
                                    ? 'bg-blue-50 border-r-2 border-blue-600'
                                    : 'hover:bg-gray-50'
                                }`}
                            title={!isExpanded ? item.label : ''}
                        >
                            <Icon
                                className={`h-5 w-5 ${isActive ? 'text-blue-600' : item.color
                                    } group-hover:scale-110 transition-transform`}
                            />
                            {isExpanded && (
                                <span className={`ml-3 text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-700'
                                    }`}>
                                    {item.label}
                                </span>
                            )}
                        </button>
                    )
                } )}

                {/* Settings */}
                <button
                    onClick={() => handleItemClick( 'settings' )}
                    className={`w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 group ${activeSection === 'settings'
                            ? 'bg-blue-50 border-r-2 border-blue-600'
                            : 'hover:bg-gray-50'
                        }`}
                    title={!isExpanded ? 'Settings' : ''}
                >
                    <Settings
                        className={`h-5 w-5 ${activeSection === 'settings' ? 'text-blue-600' : 'text-gray-600'
                            } group-hover:scale-110 transition-transform`}
                    />
                    {isExpanded && (
                        <span className={`ml-3 text-sm font-medium ${activeSection === 'settings' ? 'text-blue-600' : 'text-gray-700'
                            }`}>
                            Settings
                        </span>
                    )}
                </button>
            </div>

            {/* Expand/Collapse Indicator */}
            <div className="absolute top-1/2 -right-3 transform -translate-y-1/2">
                <div className="w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm">
                    <div className={`w-2 h-2 bg-gray-400 rounded-full transition-transform ${isExpanded ? 'scale-100' : 'scale-75'
                        }`} />
                </div>
            </div>
        </div>
    )
}

export default VerticalSidebar