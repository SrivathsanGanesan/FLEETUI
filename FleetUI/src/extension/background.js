chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'startRecording') {
      chrome.tabCapture.capture({ audio: true, video: true }, (stream) => {
        if (chrome.runtime.lastError) {
          sendResponse({ error: chrome.runtime.lastError.message });
          return;
        }
        sendResponse({ streamId: stream.id });
      });
      return true; // Indicate that the response is asynchronous
    }
  });
  