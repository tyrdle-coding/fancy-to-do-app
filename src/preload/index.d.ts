import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      onUpdateStatus: (cb: (msg: string) => void) => void
      onUpdateAvailable: (cb: (version: string) => void) => void
      onUpdateProgress: (cb: (percent: number) => void) => void
      downloadUpdate: () => void
    }
  }
}

export {}
