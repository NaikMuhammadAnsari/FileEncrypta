import { useEffect, useState } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { FiLock, FiMenu, FiX } from "react-icons/fi"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const linkClassName = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "bg-indigo-50 text-indigo-700"
        : "text-slate-600 hover:bg-slate-50 hover:text-indigo-700"
    }`

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="mr-2 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <FiLock className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-xl font-bold tracking-tight text-slate-900">FileEncrypta</span>
            </Link>
          </div>

          <div className="hidden items-center gap-1 md:flex">
            <NavLink
              to="/"
              end
              className={linkClassName}
            >
              Home
            </NavLink>
            <NavLink to="/encrypt" className={linkClassName}>
              Encrypt
            </NavLink>
            <NavLink to="/decrypt" className={linkClassName}>
              Decrypt
            </NavLink>
            <Link
              to="/encrypt"
              className="ml-3 inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Get Started
            </Link>
          </div>

          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMenuOpen ? "Close main menu" : "Open main menu"}
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6" aria-hidden="true" />
              ) : (
                <FiMenu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        id="mobile-navigation"
        className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}
      >
        <div className="space-y-1 border-t border-slate-100 bg-white px-4 py-3 sm:px-6">
          <NavLink to="/" end className={({ isActive }) => `${linkClassName({ isActive })} block`}>
            Home
          </NavLink>
          <NavLink to="/encrypt" className={({ isActive }) => `${linkClassName({ isActive })} block`}>
            Encrypt
          </NavLink>
          <NavLink to="/decrypt" className={({ isActive }) => `${linkClassName({ isActive })} block`}>
            Decrypt
          </NavLink>
          <Link
            to="/encrypt"
            className="mt-3 block rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  )
}
