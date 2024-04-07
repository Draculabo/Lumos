import { useCallback, useState } from 'react';

export const useAudioRecorder = (onBlobAvailable?: (blob: Blob) => void) => {
  const [isRecording, setIsRecording] = useState(false);

  const [time, setTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | undefined>();
  const [timerInterval, setTimerInterval] = useState<number | void>();
  const [blob, setBlob] = useState<Blob>();
  const [url, setUrl] = useState<string>();

  const _startTimer = useCallback(() => {
    const interval = window.setInterval(() => {
      setTime((time) => time + 1);
    }, 1000);
    setTimerInterval(interval);
  }, []);

  const _stopTimer = useCallback(() => {
    if (timerInterval === undefined) {
      return;
    }
    window.clearInterval(timerInterval);
    setTimerInterval();
  }, [timerInterval]);

  const start = useCallback(async () => {
    if (url) URL.revokeObjectURL(url);
    setUrl(undefined);
    setBlob(undefined);
    if (timerInterval !== undefined) return;
    try {
      const stream = await navigator.mediaDevices
        .getUserMedia({ audio: true })
      setIsRecording(true);

      const recorder: MediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/mp4",
      });
      setMediaRecorder(recorder);
      recorder.start();
      _startTimer();

      recorder.addEventListener('dataavailable', (event) => {
        const blobData = event.data;
        setBlob(blobData);
        setUrl(URL.createObjectURL(blobData));
        onBlobAvailable?.(event.data);
        recorder.stream.getTracks().forEach((t) => t.stop());
        setMediaRecorder(undefined);
      });
    } catch (error) {
      console.error('Error useAudioRecorder', error);
    }

  }, [timerInterval, _startTimer, url]);

  const stop = useCallback(() => {
    mediaRecorder?.stop();
    _stopTimer();
    setTime(0);
    setIsRecording(false);
  }, [mediaRecorder, _stopTimer]);

  return {
    blob,
    isRecording,
    mediaRecorder,
    start,
    stop,
    time,
    url,
  };
};
