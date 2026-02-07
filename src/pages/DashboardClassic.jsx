import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

export default function DashboardClassic() {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRuns = async () => {
    try {
      setError(null);
      // Try to fetch workflow runs from Base44
      // Using the entities API - checking if Workflow entity exists
      const result = await base44.entities.Workflow.list({
        limit: 25,
        orderBy: 'created_date',
        orderDirection: 'desc'
      }).catch(() => null);

      if (result && result.data) {
        setRuns(result.data);
      } else {
        // If no data or entity doesn't exist, use empty array
        setRuns([]);
      }
    } catch (err) {
      console.error('Error fetching runs:', err);
      setError(err.message || 'Failed to fetch workflow runs');
      setRuns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRuns();
    const interval = setInterval(fetchRuns, 5000);
    return () => clearInterval(interval);
  }, []);

  const triggerRun = async () => {
    try {
      setError(null);
      // Create a test workflow run
      await base44.entities.Workflow.create({
        name: `Test Run ${new Date().toISOString()}`,
        status: 'running',
        cost: Math.random() * 10,
        created_date: new Date().toISOString()
      }).catch(() => {
        throw new Error('Failed to create test run');
      });
      
      // Refresh the data
      await fetchRuns();
    } catch (err) {
      console.error('Error triggering run:', err);
      setError(err.message || 'Failed to trigger test run');
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh",
      padding: 40,
      background: "#0b1020",
      color: "white",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto"
    }}>
      {/* Header */}
      <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 8 }}>OpsVanta Dashboard</h1>
      <p style={{ opacity: 0.7, marginBottom: 24, fontSize: 16 }}>Live automation runs</p>

      {/* Action buttons */}
      <div style={{ margin: "20px 0", display: "flex", gap: 12 }}>
        <button 
          onClick={triggerRun} 
          style={{
            padding: "12px 20px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 14,
            transition: "background 0.2s"
          }}
          onMouseOver={(e) => e.target.style.background = "#1d4ed8"}
          onMouseOut={(e) => e.target.style.background = "#2563eb"}
        >
          Trigger Test Run
        </button>
        <button 
          onClick={fetchRuns} 
          style={{
            padding: "12px 20px",
            background: "#1f2937",
            color: "white",
            border: "1px solid #374151",
            borderRadius: 8,
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 14,
            transition: "background 0.2s"
          }}
          onMouseOver={(e) => e.target.style.background = "#374151"}
          onMouseOut={(e) => e.target.style.background = "#1f2937"}
        >
          Refresh
        </button>
      </div>

      {/* Error display */}
      {error && (
        <div style={{ 
          color: "#f87171", 
          marginBottom: 12, 
          padding: 12, 
          background: "#7f1d1d", 
          borderRadius: 8,
          fontSize: 14
        }}>
          Error: {error}
        </div>
      )}

      {/* Table or loading/empty states */}
      {loading ? (
        <p style={{ fontSize: 16, opacity: 0.7 }}>Loading…</p>
      ) : runs.length === 0 ? (
        <p style={{ fontSize: 16, opacity: 0.7 }}>No runs yet.</p>
      ) : (
        <div style={{ 
          background: "#1e293b", 
          borderRadius: 12, 
          overflow: "hidden",
          border: "1px solid #1f2937"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#1e293b" }}>
                <th style={thStyle}>Run ID</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Cost</th>
                <th style={thStyle}>Time</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((r, idx) => (
                <tr 
                  key={r.id || idx} 
                  style={{ 
                    borderTop: "1px solid #1f2937",
                    transition: "background 0.2s"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = "#334155"}
                  onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <td style={tdStyle}>{r.name || r.id || 'N/A'}</td>
                  <td style={tdStyle}>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 600,
                      background: r.status === 'completed' ? '#065f46' : 
                                 r.status === 'running' ? '#1e40af' : 
                                 r.status === 'failed' ? '#7f1d1d' : '#374151',
                      color: 'white'
                    }}>
                      {r.status || 'unknown'}
                    </span>
                  </td>
                  <td style={tdStyle}>${(r.cost || 0).toFixed(2)}</td>
                  <td style={tdStyle}>
                    {r.created_date ? new Date(r.created_date).toLocaleString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const thStyle = { 
  padding: 12, 
  textAlign: "left", 
  fontWeight: 600, 
  fontSize: 14,
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: "0.05em"
};

const tdStyle = { 
  padding: 12, 
  fontSize: 14,
  color: "#e2e8f0"
};
