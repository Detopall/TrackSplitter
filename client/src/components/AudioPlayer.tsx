import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Button } from "@heroui/button";
import { Play, Pause } from "lucide-react";

interface AudioPlayerProps {
	file: { filename: string; url: string };
}

function AudioPlayer({ file }: AudioPlayerProps) {
	const waveformRef = useRef<HTMLDivElement | null>(null);
	const wavesurfer = useRef<WaveSurfer | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);

	useEffect(() => {
		if (waveformRef.current) {
			// Append a timestamp to the URL to avoid caching
			const noCacheUrl = `${file.url}?t=${new Date().getTime()}`;

			wavesurfer.current = WaveSurfer.create({
				container: waveformRef.current,
				waveColor: "#ddd",
				progressColor: "#f87171",
				cursorColor: "#f87171",
				barWidth: 2,
				barHeight: 1,
				height: 100,
			});

			wavesurfer.current.load(noCacheUrl);

			wavesurfer.current.on("finish", () => setIsPlaying(false));
		}

		return () => wavesurfer.current?.destroy();
	}, [file.url]);

	const togglePlayPause = () => {
		if (wavesurfer.current) {
			wavesurfer.current.playPause();
			setIsPlaying(!isPlaying);
		}
	};

	const downloadFile = (url: string, filename: string) => {
		const link = document.createElement("a");
		link.href = url;
		link.download = filename;
		link.click();
		link.remove();
		setIsPlaying(false);
	};

	return (
		<div className="mb-4 p-4 rounded-lg shadow-md">
			<h3 className="text-lg font-semibold mb-2">{file.filename}</h3>
			<div
				ref={waveformRef}
				className="w-full h-24 rounded-md overflow-hidden mb-4"
			></div>

			<div className="flex justify-between items-center mt-4">
				<Button
					color="success"
					variant="shadow"
					onPress={togglePlayPause}
					className="p-2"
				>
					{isPlaying ? <Pause size={20} /> : <Play size={20} />}
				</Button>
				<Button
					color="secondary"
					variant="shadow"
					onPress={() => downloadFile(file.url, file.filename)}
				>
					Download
				</Button>
			</div>
		</div>
	);
}

export default AudioPlayer;
