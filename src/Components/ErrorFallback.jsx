import { useNavigate } from "react-router-dom";

export default function ErrorFallback({ message = "Something went wrong.", errorCode = null, onRetry = null }) {
  	const navigate = useNavigate();

	return (
		<div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
			<h1 className="text-7xl font-light tracking-widest text-black mb-2">OOPS!</h1>
			<p className="text-lg text-gray-700 mb-6">
				{errorCode ? `${errorCode} – ${message}` : message}
			</p>
			<div className="flex gap-4 flex-wrap justify-center">
				{onRetry && (
					<button onClick={onRetry} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded font-semibold text-sm transition">
						Try Again
					</button>
				)}
				<button onClick={() => navigate("/")} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded font-semibold text-sm transition">
					Go to Homepage
				</button>
			</div>
		</div>
	);
}
