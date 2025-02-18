import os
import torch
import torchaudio
from torchaudio.pipelines import HDEMUCS_HIGH_MUSDB_PLUS
from torchaudio.transforms import Fade

from yt_to_wav import download_youtube_audio

bundle = HDEMUCS_HIGH_MUSDB_PLUS
model = bundle.get_model()
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
model.to(device)
sample_rate = bundle.sample_rate

def separate_sources(model: torch.nn.Module, mix: torch.Tensor, segment=10.0, overlap=0.1, device=None) -> torch.Tensor:
    """
    Apply model to a given mixture. Use fade, and add segments together in order to add model segment by segment.

    Args:
        segment (int): segment length in seconds
        device (torch.device, str, or None): if provided, device on which to
            execute the computation, otherwise `mix.device` is assumed.
            When `device` is different from `mix.device`, only local computations will
            be on `device`, while the entire tracks will be stored on `mix.device`.

    Returns:
        torch.Tensor: separated sources
    """
    if device is None:
        device = mix.device
    else:
        device = torch.device(device)

    batch, channels, length = mix.shape

    chunk_len = int(sample_rate * segment * (1 + overlap))
    start = 0
    end = chunk_len
    overlap_frames = overlap * sample_rate
    fade = Fade(fade_in_len=0, fade_out_len=int(overlap_frames), fade_shape="linear")

    final = torch.zeros(batch, len(model.sources), channels, length, device=device)

    while start < length - overlap_frames:
        chunk = mix[:, :, start:end]
        with torch.no_grad():
            out = model.forward(chunk)
        out = fade(out)
        final[:, :, :, start:end] += out
        if start == 0:
            fade.fade_in_len = int(overlap_frames)
            start += int(chunk_len - overlap_frames)
        else:
            start += chunk_len
        end += chunk_len
        if end >= length:
            fade.fade_out_len = 0
    return final

def separate_and_download(audio_path: str):
    """
    Separates audio into sources

    Args:
        audio_path (str): Path to audio file

    Returns:
        None
    """
    waveform, _ = torchaudio.load(audio_path)
    waveform = waveform.to(device)
    ref = waveform.mean(0)
    waveform = (waveform - ref.mean()) / ref.std()

    sources = separate_sources(model, waveform[None], device=device, segment=10, overlap=0.1)[0]
    sources = sources * ref.std() + ref.mean()

    sources_list = model.sources
    sources = list(sources)

    audios = dict(zip(sources_list, sources))

    os.makedirs("separated_audio", exist_ok=True)
    for source_name, audio_data in audios.items():
        torchaudio.save(f"separated_audio/{source_name}.wav", audio_data.cpu(), sample_rate)
    print(f"Separated audio files saved to: separated_audio/")


def generate_separation(yt_link: str) -> None:
    """
    Separates audio into sources. General process of the program

    Args:
        audio_path (str): Path to audio file

    Returns:
        None
    """
    audio_file_path = "audio.wav"

    if not os.path.exists(audio_file_path):
        print(f"Error: {audio_file_path} not found.")

        if not yt_link:
            print("YouTube link doesn't exist, or we can't find it")
            exit()

        success = download_youtube_audio(yt_link)
        if not success:
            print("Failed to download YouTube video")
            exit()

        print(f"Processing {audio_file_path}")
        separate_and_download(audio_file_path)

def remove_all_separated_audio(SEPARATED_AUDIO_DIR: str):
    """
    This function ensures that no audio files are left in the separated_audio directory. This is needed because the program will automatically create endpoints pointing to the files in this directory, without checking if they are new or not.
    """

    for file in os.listdir(SEPARATED_AUDIO_DIR):
        os.remove(os.path.join(SEPARATED_AUDIO_DIR, file))

    # Remove the audio.wav file
    if os.path.exists("audio.wav"):
        os.remove("audio.wav")

    os.rmdir(SEPARATED_AUDIO_DIR)

    os.mkdir(SEPARATED_AUDIO_DIR)
