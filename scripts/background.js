// Listen for incoming messages
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'storeCode') {
    // Perform storage logic, e.g., store the code in localStorage
    try {
      localStorage.setItem('userCode', request.code);
      sendResponse({ success: true });
    } catch (error) {
      sendResponse({ success: false, error: 'Failed to store code' });
    }
    return true; // Indicates that a response will be sent asynchronously
  } else if(request.action === 'loadCode') {
    // Perform retrieval logic, e.g., retrieve the code from localStorage
    try {
      const code = localStorage.getItem('userCode');
      sendResponse({ success: true, code });
    } catch (error) {
      sendResponse({ success: false, error: 'Failed to load code' });
    }
    return true; // Indicates that a response will be sent asynchronously
  }
});