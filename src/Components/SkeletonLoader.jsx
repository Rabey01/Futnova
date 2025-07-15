import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function SkeletonLoader({ type = "card", count = 3 }) {
	switch (type) {
		case "card":
			return (
				<div className="space-y-4">
					{Array(count).fill(0).map((_, i) => (
						<div key={i} className="bg-white p-4 rounded-xl shadow-sm">
							<Skeleton height={20} width={180} className="mb-3" />
							<Skeleton height={30} count={2} />
						</div>
					))}
				</div>
			);

		case "table":
			return (
				<div className="overflow-x-auto rounded-lg shadow">
					<table className="w-full table-fixed border-collapse text-sm">
						<thead>
							<tr>{Array(6).fill(0).map((_, i) => <th key={i}><Skeleton height={24} /></th>)}</tr>
						</thead>
						<tbody>
							{Array(count).fill(0).map((_, i) => (
								<tr key={i}>
									{Array(6).fill(0).map((_, j) => (
										<td key={j} className="py-2 px-4">
											<Skeleton height={16} />
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			);

		default:
			return <Skeleton count={count} />;
	}
}