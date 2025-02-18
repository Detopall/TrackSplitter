import TrackSplitter from "@/assets/track-splitter.svg";
import { GithubSvg } from "@/components/GithubSvg";
import { Tooltip } from "@heroui/tooltip";

function Header() {
	return (
		<header className="w-full p-4 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-between shadow-md rounded-md mb-5">
			<div className="flex items-center space-x-3 flex-row">
				<h1 className="text-3xl font-semibold tracking-wide">TrackSplitter</h1>
				<div className="relative overflow-hidden">
					<img src={TrackSplitter} alt="TrackSplitter" className="w-8 h-8" />
				</div>
				<Tooltip className="capitalize" color="foreground" content="GitHub Project">
					<a
						href="https://github.com/Detopall/TrackSplitter"
						target="_blank"
						rel="noopener noreferrer"
						className="w-9 h-9"
					>
						<GithubSvg fill="#fff" />
					</a>
				</Tooltip>
			</div>
		</header>
	);
}

export default Header;
