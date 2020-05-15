/* eslint-disable @typescript-eslint/no-var-requires */
import { ipcRenderer as ipc } from "electron";

ipc.on("update_progress", (_event, state) => {
  // console.log(state);

  const progress = state.percent;
  const speed = Math.round(state.bytesPerSecond / 1024);
  const progressBar = document.getElementById("progressBar");
  if (progressBar) {
    progressBar.style.width = Math.round(progress) + "%";
  }

  state.total = Math.round((state.total / 1024 / 1024) * 100) / 100;
  state.transferred = Math.round((state.transferred / 1024 / 1024) * 100) / 100;

  const progressText = document.getElementById("progressText");
  if (progressText) {
    progressText.innerHTML = ` ${state.transferred}mb / ${state.total}mb (${speed}kb/s)`;
  }
});
