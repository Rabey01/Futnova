import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import ImagePreloader from "./ImagePreloader";

export default function Layout() {
	return (
		<>
			<NavBar />
			<ImagePreloader>
				<main> <Outlet /> </main>
			</ImagePreloader>
		</>
	);
}
