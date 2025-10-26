import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import api from '../utils/api';

export default function Documents() {
  const { t } = useTranslation();
  const [files, setFiles] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [meta, setMeta] = useState({ documentType: 'Land Documents', documentName: '' });

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    setLoading(true);
    try {
      const res = await api.get('/documents');
      if (res.data?.success) setDocuments(res.data.data || []);
    } catch (err) {
      console.error('Fetch docs', err);
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e) {
    setFiles(e.target.files);
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!files || files.length === 0) return alert('Please select a file');
    if (!meta.documentName) return alert('Please provide a document name');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', files[0]);
      formData.append('documentType', meta.documentType);
      formData.append('documentName', meta.documentName);

      const res = await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data?.success) {
        alert('Uploaded');
        setFiles(null);
        setMeta({ documentType: 'Land Documents', documentName: '' });
        fetchDocuments();
      }
    } catch (err) {
      console.error('Upload error', err);
      alert(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function downloadDocument(id) {
    try {
      const res = await api.get(`/documents/file/${id}`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: res.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error', err);
      alert('Failed to download');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        <Link to="/dashboard" className="flex items-center text-primary-600 hover:text-primary-700 mb-6">
          <FaArrowLeft className="mr-2" />
          Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="card p-4">
              <h1 className="text-2xl font-bold mb-4">{t('documents.title')}</h1>
              {loading ? <p>Loading...</p> : (
                documents.length === 0 ? <p>No documents uploaded yet.</p> : (
                  <ul className="space-y-3">
                    {documents.map(doc => (
                      <li key={doc._id} className="p-3 bg-white rounded shadow flex justify-between items-center">
                        <div>
                          <div className="font-medium">{doc.documentName}</div>
                          <div className="text-sm text-gray-500">{doc.documentType} • {doc.status}</div>
                        </div>
                        <div>
                          <button onClick={() => downloadDocument(doc._id)} className="btn btn-sm">View</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )
              )}
            </div>
          </div>

          <div className="col-span-1">
            <div className="card p-4">
              <h2 className="text-lg font-semibold mb-3">Upload Document</h2>
              <form onSubmit={handleUpload}>
                <label className="block mb-1">Document Name</label>
                <input value={meta.documentName} onChange={e => setMeta({ ...meta, documentName: e.target.value })} className="input mb-3" />

                <label className="block mb-1">Document Type</label>
                <select value={meta.documentType} onChange={e => setMeta({ ...meta, documentType: e.target.value })} className="input mb-3">
                  <option>Land Documents</option>
                  <option>Identity</option>
                  <option>Insurance</option>
                  <option>Other</option>
                </select>

                <label className="block mb-1">File</label>
                <input type="file" onChange={handleFileChange} className="mb-3" />

                <button type="submit" disabled={uploading} className="btn btn-primary w-full">{uploading ? 'Uploading...' : 'Upload'}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
