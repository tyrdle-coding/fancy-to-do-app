import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  onUpdateStatus: (cb: (msg: string) => void) =>
    ipcRenderer.on('update-status', (_e, msg) => cb(msg)),
  onUpdateAvailable: (cb: (version: string) => void) =>
    ipcRenderer.on('update-available', (_e, version) => cb(version)),
  onUpdateProgress: (cb: (percent: number) => void) =>
    ipcRenderer.on('update-progress', (_e, percent) => cb(percent)),
  downloadUpdate: () => ipcRenderer.send('download-update')
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api as unknown)
  } catch (e) {
    console.error(e)
  }
} else {
  ;(window as unknown as { electron: typeof electronAPI }).electron = electronAPI
  ;(window as unknown as { api: typeof api }).api = api
}
