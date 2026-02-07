import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

// Constants
const REFRESH_INTERVAL_MS = 5000; // 5 seconds
const MAX_TEST_COST = 10;

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
      }).catch((err) => {
        console.error('Error fetching workflow runs:', err);
        return null;
      });

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
    const interval = setInterval(fetchRuns, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const triggerRun = async () => {
    try {
      setError(null);
      // Create a test workflow run
      await base44.entities.Workflow.create({
        name: `Test Run ${new Date().toISOString()}`,
        status: 'running',
        cost: Math.random() * MAX_TEST_COST,
        created_date: new Date().toISOString()
      }).catch((err) => {
        throw new Error(`Failed to create test run: ${err.message || 'Unknown error'}`);
      });
      
      // Refresh the data
      await fetchRuns();
    } catch (err) {
      console.error('Error triggering run:', err);
      setError(err.message || 'Failed to trigger test run');
    }
  };

  return (
    <>
      <style>{`
        .trigger-btn {
          padding: 12px 20px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
        }
        .trigger-btn:hover {
          background: #1d4ed8;
        }
        .refresh-btn {
          padding: 12px 20px;
          background: #1f2937;
          color: white;
          border: 1px solid #374151;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
        }
        .refresh-btn:hover {
          background: #374151;
        }
        .table-row {
          border-top: 1px solid #1f2937;
          transition: background 0.2s;
        }
        .table-row:hover {
          background: #334155;
        }
      `}</style>
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
          <button onClick={triggerRun} className="trigger-btn">
            Trigger Test Run
          </button>
          <button onClick={fetchRuns} className="refresh-btn">
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
                    className="table-row"
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
    </>
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
