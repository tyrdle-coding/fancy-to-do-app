/// <reference types="vite/client" />
import { ElectronAPI } from '@electron-toolkit/preload'

interface Window {
  electron: ElectronAPI
  api: {
    onUpdateStatus: (cb: (msg: string) => void) => void
    onUpdateAvailable: (cb: (version: string) => void) => void
    onUpdateProgress: (cb: (percent: number) => void) => void
    downloadUpdate: () => void
  }
}
