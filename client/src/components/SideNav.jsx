import { LibraryBig, LineChart, MessageSquare, Shield } from 'lucide-react'
import React, { useEffect } from 'react'
import { useLocation } from "react-router-dom"
import ProgressBar from './ProgessBar'
import { Link } from 'react-router-dom'

function SideNav() {
  const menulist = [
    { id: 1, name: "My Forms", icon: LibraryBig, path: "/dashboard" },
    { id: 2, name: "Responses", icon: MessageSquare, path: "/dashboard/responses" },
    { id: 3, name: "Analytics", icon: LineChart, path: "/dashboard/analytics" },
    { id: 4, name: "Upgrade", icon: Shield, path: "/dashboard/upgrade" }
  ]

  const location = useLocation()
  const path = location.pathname

  useEffect(() => {
    // console.log(path)
  }, [path])

  return (
    <div className="h-screen shadow-md border flex flex-col gap-20">
      {/* Top Menu */}
      <div className="p-5">
        {menulist.map((menu, index) => (
          <Link
            to={menu.path}
            key={index}
            className={`flex items-center mb-3 cursor-pointer text-gray-500 gap-3 p-4 hover:bg-primary hover:text-white rounded-lg 
              ${path === menu.path ? 'bg-primary text-white' : ''}`}
          >
            <menu.icon />
            {menu.name}
          </Link>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="p-6 space-y-4">
        <button className="w-full bg-white px-6 py-3 rounded-lg border border-gray-300 hover:scale-105 active:scale-95 transition cursor-pointer hover:bg-primary hover:text-white">
          + Create Form
        </button>

        {/* Progress Bar */}
        <div className="">
          <ProgressBar value={65} /> {/* Example: 65% */}
          <h2 className='text-sm mt-2 text-gray-600'><strong>2 </strong>out of<strong> 3 </strong>Form Created</h2>
          <h2 className=' text-xs mt-3 text-gray-600'>Upgrade your plan for unlimted AI form generation</h2>
        </div>
      </div>
    </div>
  )
}

export default SideNav
