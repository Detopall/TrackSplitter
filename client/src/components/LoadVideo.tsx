import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

interface LoadVideoProps {
	videoId: string;
	videoUrl: string;
	handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleConversion: () => void;
	handleSubmit: () => void;
}

function LoadVideo({
	videoId,
	videoUrl,
	handleInputChange,
	handleConversion,
	handleSubmit,
}: LoadVideoProps) {
	return (
		<>
			<div className="flex flex-col sm:flex-row gap-2 mb-4">
				<Input
					className="flex-grow mb-5"
					color="primary"
					label="YouTube Link"
					placeholder="Enter your YouTube link"
					type="text"
					value={videoUrl}
					onChange={handleInputChange}
				/>
			</div>
			<div className="mt-4 flex justify-center mb-5">
				<Button color="danger" variant="shadow" onPress={handleSubmit}>
					Load Video
				</Button>
			</div>
			{videoId && (
				<>
					<div
						className="relative w-full mb-5"
						style={{ paddingTop: "56.25%" }}
					>
						<iframe
							className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
							src={`https://www.youtube.com/embed/${videoId}`}
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
						></iframe>
					</div>
					<div className="mt-4 flex justify-center">
						<Button color="primary" variant="shadow" onPress={handleConversion}>
							Convert Video
						</Button>
					</div>
				</>
			)}
		</>
	);
}

export default LoadVideo;
