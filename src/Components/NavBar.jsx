import { Disclosure } from "@headlessui/react";
import { Link } from "react-router-dom";

export default function NavBar() {
	return (
		<Disclosure as="nav" className="bg-lime-200 shadow-sm">
			<div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-4">
				<div className="flex justify-between py-2 sm:py-0 h-auto sm:h-14 items-center">
					<div className="flex-shrink-0 text-xl sm:text-2xl md:text-3xl font-bold text-black"> FUTNOVA </div>
					<div className="flex gap-3 sm:gap-6 md:gap-8">
						<Link to="/" className="text-gray-700 hover:text-white text-sm sm:text-base md:text-lg font-medium"> Home </Link>
						<Link to="/leagues" className="text-gray-700 hover:text-white text-sm sm:text-base md:text-lg font-medium"> Leagues </Link>
						{/* <button className="text-gray-700 hover:text-white text-sm font-medium">
						Settings
						</button> */}
					</div>
				</div>
			</div>
		</Disclosure>
	);
}