import { useState } from "react";
import ConvertAudio from "@/components/ConvertAudio";
import LoadVideo from "@/components/LoadVideo";
import Header from "./components/Header";

import { Switch } from "@heroui/switch";
import { MoonIcon, SunIcon } from "@/components/moonSunIcons";
import { useTheme } from "@/hooks/use-theme";

function App() {
	const { theme, toggleTheme } = useTheme();
	const [videoUrl, setVideoUrl] = useState("");
	const [videoId, setVideoId] = useState("");
	const [audioFiles, setAudioFiles] = useState<
		{ filename: string; url: string }[]
	>([]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setVideoUrl(e.target.value);
	};

	const handleSubmit = () => {
		const id = extractVideoId(videoUrl);
		if (id) {
			setVideoId(id);
		}
	};

	const extractVideoId = (url: string) => {
		const regExp =
			/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
		const match = url.match(regExp);
		return match && match[2].length === 11 ? match[2] : null;
	};

	const handleConversion = async () => {
		if (videoId) {
			const response = await fetch("http://localhost:8000/convert", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ url: videoUrl }),
			});
			const data = await response.json();
			setAudioFiles(data.files || []);
		}
	};

	return (
		<main
			className={`green-${theme} text-foreground bg-background w-full overflow-x-hidden`}
		>
			<div className="flex flex-col">
				<div className="flex flex-col items-end py-4">
					<Switch
						defaultSelected
						endContent={<MoonIcon />}
						startContent={<SunIcon />}
						onChange={toggleTheme}
						size="lg"
					/>
				</div>
			</div>
			<div className="min-h-screen flex flex-col items-center justify-start p-4 overflow-y-auto">
				<div className="w-full max-w-2xl">
					<Header />
					<LoadVideo
						videoId={videoId}
						handleConversion={handleConversion}
						videoUrl={videoUrl}
						handleInputChange={handleInputChange}
						handleSubmit={handleSubmit}
					/>

					<ConvertAudio audioFiles={audioFiles} />
				</div>
			</div>
		</main>
	);
}

export default App;
