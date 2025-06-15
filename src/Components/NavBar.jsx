import { Disclosure } from "@headlessui/react";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <Disclosure as="nav" className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <div className="flex-shrink-0 text-xl font-bold text-gray-800">
            FootyLive
          </div>
          <div className="flex gap-4">
            <Link to="/" className="text-gray-700 hover:text-blue-600 text-sm font-medium">
              Home
            </Link>
            <Link to="/leagues" className="text-gray-700 hover:text-blue-600 text-sm font-medium">
              Leagues
            </Link>
            <button className="text-gray-700 hover:text-blue-600 text-sm font-medium">
              Settings
            </button>
          </div>
        </div>
      </div>
    </Disclosure>
  );
}