const API_BASE = '';

export const analyzeContract = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/api/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'An error occurred during document analysis.');
  }

  return response.json();
};

export const analyzeSampleContract = async (sampleId) => {
  const response = await fetch(`${API_BASE}/api/analyze-sample/${sampleId}`, {
    method: 'POST',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to analyze sample document.');
  }

  return response.json();
};

export const chatWithContract = async (cache_name, message) => {
  const response = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cache_name, message })
  });

  if (!response.ok) {
    throw new Error("Failed to communicate with judicial ledger.");
  }

  return response.json();
};

export const streamChatWithContract = async (cache_name, message, onChunk) => {
  const response = await fetch(`${API_BASE}/api/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cache_name, message })
  });

  if (!response.ok) {
    throw new Error("Failed to communicate with judicial ledger.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop();

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') return;
        onChunk(data);
      }
    }
  }
};

export const fetchSamples = async () => {
  const response = await fetch(`${API_BASE}/api/samples`);
  if (!response.ok) throw new Error('Failed to fetch samples.');
  return response.json();
};
