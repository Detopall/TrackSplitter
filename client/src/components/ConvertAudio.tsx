import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Button } from "@heroui/button";
import AudioPlayer from "@/components/AudioPlayer";

interface AudioFile {
	filename: string;
	url: string;
}

interface ConvertAudioProps {
	audioFiles: AudioFile[];
}

const ConvertAudio = ({ audioFiles }: ConvertAudioProps) => {
	const downloadAllAsZip = async () => {
		const zip = new JSZip();
		const downloadPromises = audioFiles.map(async (file) => {
			const response = await fetch(file.url);
			const blob = await response.blob();
			zip.file(file.filename, blob);
		});

		await Promise.all(downloadPromises);

		const zipBlob = await zip.generateAsync({ type: "blob" });
		const timestamp = new Date().toISOString().replace(/[-:T.]/g, "_");
		saveAs(zipBlob, `TrackSplitter_${timestamp}.zip`);
	};

	return (
		<>
			{audioFiles.length > 0 && (
				<div className="mt-8">
					<h2 className="text-xl font-semibold text-center mb-4">
						Audio Files
					</h2>
					<div className="grid gap-4">
						{audioFiles.map((file, index) => (
							<AudioPlayer key={index} file={file} />
						))}
					</div>
					<div className="mt-6 flex justify-center">
						<Button color="primary" variant="shadow" onPress={downloadAllAsZip}>
							Download All as ZIP
						</Button>
					</div>
				</div>
			)}
		</>
	);
};

export default ConvertAudio;
