export default function FootballField({ children }) {
	return (
		<div className="relative w-full max-w-4x1 aspect-[3/4] mx-auto bg-green-700 rounded-lg border-4 border-white overflow-hidden">
			<div className="absolute inset-0 flex flex-col px-4 z-10">
				<div className="flex flex-col flex-1 min-h-0 justify-center">
					{children[0]} {/* Home team lineup */}
				</div>
				<div className="flex flex-col flex-1 min-h-0 justify-center">
					{children[1]} {/* Away team lineup */}
				</div>
			</div>

			<div className="absolute top-1/2 left-0 w-full h-0.5 bg-white opacity-20 pointer-events-none z-0" />

			{/* Center circle */}
			<div className="absolute top-1/2 left-1/2 w-20 h-20 border border-white rounded-full -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none z-0" />

			{/* Top penalty box */}
			<div className="absolute top-0 left-[25%] w-[50%] h-[12%] border-2 border-white opacity-20 pointer-events-none z-0" />

			{/* Top 6-yard box */}
			<div className="absolute top-0 left-[37%] w-[26%] h-[5.5%] border-2 border-white opacity-20 pointer-events-none z-0" />

			{/* Bottom penalty box */}
			<div className="absolute bottom-0 left-[25%] w-[50%] h-[12%] border-2 border-white opacity-20 pointer-events-none z-0" />

			{/* Bottom 6-yard box */}
			<div className="absolute bottom-0 left-[37%] w-[26%] h-[5.5%] border-2 border-white opacity-20 pointer-events-none z-0" />

			{/* Top penalty spot */}
			<div className="absolute top-[9.5%] left-1/2 w-1.5 h-1.5 bg-white rounded-full -translate-x-1/2 opacity-20 pointer-events-none z-0" />

			{/* Bottom penalty spot */}
			<div className="absolute bottom-[9.5%] left-1/2 w-1.5 h-1.5 bg-white rounded-full -translate-x-1/2 opacity-20 pointer-events-none z-0" />

			{/* Top Arc */}
			<div className="absolute top-[12%] left-1/2 w-24 md:w-28 lg:w-32 h-10 -translate-x-1/2 overflow-hidden
			before:content-[''] before:absolute before:inset-x-0 before:bottom-0
			before:h-[350%] before:w-full before:rounded-full before:border before:border-white before:border-t-0 before:opacity-20 pointer-events-none z-0" />

			{/* Bottom Arc */}
			<div className="absolute bottom-[12%] left-1/2 w-24 md:w-28 lg:w-32 h-10 -translate-x-1/2 overflow-hidden
			before:content-[''] before:absolute before:inset-x-0 before:top-0
			before:h-[350%] before:w-full before:rounded-full before:border before:border-white before:border-b-0 before:opacity-20 pointer-events-none z-0" />

		</div>
	);
}
