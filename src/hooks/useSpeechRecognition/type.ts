export interface SpeechRecognitionCoreOptions {
  onRecognitionError?: (error: any) => void;
  onRecognitionFinish?: (value: string) => void;
  onRecognitionStart?: () => void;
  onRecognitionStop?: () => void;
  onTextChange?: (value: string) => void;
}

export interface SpeechRecognitionRecorderOptions extends SpeechRecognitionCoreOptions {
  onBlobAvailable?: (blob: Blob) => void;
  onStart?: () => void;
  onStop?: () => void;
}
