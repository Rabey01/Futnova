import { useEffect, useState } from "react";

export default function ImagePreloader({ children }) {
  	const [allImagesLoaded, setAllImagesLoaded] = useState(false);

	useEffect(() => {
		const imgs = document.images;
		let loadedCount = 0;
		const total = imgs.length;

		if (total === 0) {
			setAllImagesLoaded(true);
			return;
		}

		for (let i = 0; i < total; i++) {
			const img = imgs[i];
			if (img.complete) {
				loadedCount++;
				if (loadedCount === total) setAllImagesLoaded(true);
			} else {
				img.onload = img.onerror = () => {
					loadedCount++;
					if (loadedCount === total) setAllImagesLoaded(true);
				};
			}
		}
	}, []);

	if (!allImagesLoaded) {
		return (
			<div className="w-full h-screen flex justify-center items-center text-lg font-semibold">
				Loading...
			</div>
		);
	}
  	return children;
}
