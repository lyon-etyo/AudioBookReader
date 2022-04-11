const video = document.querySelector("video");
const button = document.querySelector("button");
const textElem = document.querySelector("pre[data-text]");

async function setup() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: { exact: "environment" } },
  });
  video.srcObject = stream;
  video.addEventListener("playing", async () => {
    const worker = Tesseract.createWorker();
    await worker.load();
    await worker.loadLanguage("ind");
    await worker.initialize("ind");

    const canvas = document.createElement("canvas");
    canvas.width = video.width;
    canvas.height = video.height;

    button.addEventListener("click", async event => {
      canvas.getContext("2d").drawImage(video, 0, 0, video.width, video.height);
      const {
        data: { text },
      } = await worker.recognize(canvas);

      speechSynthesis.speak(new SpeechSynthesisUtterance(text.replace(/\s/g, " ")));

      textElem.textContent = text;
    });
  });
}

setup();
