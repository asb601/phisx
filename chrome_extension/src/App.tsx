import axios from 'axios';
import { useState, useEffect } from 'react';

function App() {
    const [status, setStatus] = useState<string | null>(null);
    const [url, setUrl] = useState<string | null>(null);

    useEffect(() => {
        const predict = async (url: string) => {
            try {
                const response = await axios.post('http://127.0.0.1:5000/predict', { url });
                setStatus(response.data.prediction);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0] && tabs[0].url) {
                setUrl(tabs[0].url);
                predict(tabs[0].url);
            }
        });
    }, []);

    return (
        <div className="App bg-gray-100 p-6 rounded-lg shadow-md w-96">
            <h1 className="text-2xl font-bold mb-4 text-blue-600">Phishing URL Detector</h1>
            {url ? (
                <p className="mb-2 text-sm">
                    <span className="font-semibold">Current URL:</span> 
                    <span className="ml-1 text-gray-600 break-all">{url}</span>
                </p>
            ) : (
                <p className="mb-2 text-sm text-gray-500">No URL detected</p>
            )}
            {status ? (
                <p className="mt-4">
                    <span className="font-semibold">Status:</span> 
                    <span className={`ml-1 ${status === "Legitimate website" ? 'text-green-600' : 'text-red-600'}`}>
                        {status}
                    </span>
                </p>
            ) : (
                <p className="mt-4 text-gray-500">Loading...</p>
            )}
        </div>
    );
}

export default App;