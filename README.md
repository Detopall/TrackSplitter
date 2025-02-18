# TrackSplitter

TrackSplitter allows you to separate the audio sources of a YouTube video (vocal, drums, bass, etc.) and present them in a web app with the possibility to download them as a zip file or individually.

## Table of Contents

- [Technologies](#technologies)
- [Installation](#installation)
  - [Docker](#docker)
    - [Run](#run)
    - [Stop](#stop)
    - [Remove Container](#remove-container)
    - [Remove Image](#remove-image)
  - [Server](#server)
  - [Client](#client)
- [Examples](#examples)
- [License](#license)

## Technologies

- React
- HeroUI (with TailwindCSS)
- TypeScript
- Python
- FastAPI
- Torch, TorchAudio
- yt-dlp

## Installation

### Docker

Execute the following command:

Make sure the bash script has the right permission by running chmod +x run.sh

#### Run

```bash
./run.sh
```

- Build the Docker image (if not already built)
- Run the container (if it isn't already running)
- Open the app in your default web browser at `http://localhost:5173/`

#### Stop

```bash
./run.sh --stop
```

- Stop the running container

#### Remove Container

```bash
./run.sh --remove-container
```

- Stops the running container (if not already stopped)
- Remove the container

#### Remove Image

```bash
./run.sh --remove-all
```

- Stops the running container (if not already stopped)
- Remove the container
- Remove the Docker image

You can also individually run the server and client in the next two sections.

### Server

```bash
cd ./server
pip install -r requirements.txt
python server.py
```

### Client

```bash
cd ./client
npm install
npm run dev
```

Then just open the link that is printed in the console. This should be `http://127.0.0.1:5173/`

After the server is running, you can go to the client and start using the website.

## Examples

You can find some examples in the [assets](./assets) folder of how the website looks like.

Demo Video:

[https://youtu.be/YjCT-ZbKaoY](https://youtu.be/YjCT-ZbKaoY)

## License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).

```plaintext
MIT License

Copyright (c) [2025] [Denis Topallaj]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
