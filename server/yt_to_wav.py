"""
Inspiration taken from
https://github.com/jschuhmann47/youtubeToWav/blob/master/youtubetowav.py
"""

import os
from yt_dlp import YoutubeDL

def download_youtube_audio(url: str, output_filename="audio.wav") -> bool:
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': 'temp_audio.%(ext)s',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'wav',
        }],
        'keepvideo': False, # Delete the original video file
    }

    try:
        with YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
            if os.path.exists("temp_audio.wav"):
                os.rename("temp_audio.wav", output_filename)
                return True
            else:
                print("Temporary WAV file not found.")
                return False

    except Exception as e:
        print(f"An error occurred: {e}")
        return False
