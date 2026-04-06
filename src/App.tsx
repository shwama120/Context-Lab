import { useEffect, useState } from 'react'

// 데이터 구조 정의 (TypeScript 타입 안전성 확보)
interface Log {
  id: number;
  title: string;
  url: string;
  description: string;
  timestamp: string;
}

function App() {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    // 1. 팝업이 열릴 때 크롬 로컬 저장소에서 데이터 호출
    chrome.storage.local.get(['contextLogs'], (result) => {
      // result.contextLogs가 없으면 빈 배열 사용, 명시적으로 Log[] 타입임을 선언하여 에러 방지
      const savedLogs = (result.contextLogs || []) as Log[];
      
      // 2. 최신 가입 정보가 위로 오도록 역순 정렬하여 상태 업데이트
      setLogs([...savedLogs].reverse());
    });
  }, []);

  // 저장된 모든 기록 삭제 함수
  const clearLogs = () => {
    chrome.storage.local.set({ contextLogs: [] }, () => {
      setLogs([]);
    });
  };

  return (
    <div style={{ width: '350px', padding: '15px', fontFamily: 'sans-serif', backgroundColor: '#fff' }}>
      <h2 style={{ 
        color: '#2563eb', 
        fontSize: '1.2rem', 
        borderBottom: '2px solid #f3f4f6', 
        paddingBottom: '10px',
        margin: '0 0 15px 0'
      }}>
        Context-Lab 인덱스
      </h2>
      
      <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '5px' }}>
        {logs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af' }}>
            <p>아직 감지된 맥락이 없습니다.</p>
            <p style={{ fontSize: '0.8rem' }}>웹사이트에서 가입/로그인을 시도해보세요!</p>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} style={{ 
              border: '1px solid #e5e7eb', 
              borderRadius: '10px', 
              padding: '12px', 
              marginBottom: '10px',
              backgroundColor: '#f9fafb',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}>
              <strong style={{ display: 'block', fontSize: '14px', color: '#111827', marginBottom: '4px' }}>
                {log.title}
              </strong>
              <a 
                href={log.url} 
                target="_blank" 
                rel="noreferrer"
                style={{ fontSize: '12px', color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}
              >
                사이트 주소 확인 →
              </a>
              <p style={{ fontSize: '11px', color: '#4b5563', margin: '8px 0', lineHeight: '1.4' }}>
                {log.description}
              </p>
              <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '8px', textAlign: 'right' }}>
                📅 {log.timestamp}
              </div>
            </div>
          ))
        )}
      </div>

      {logs.length > 0 && (
        <button 
          onClick={clearLogs}
          style={{ 
            width: '100%', 
            padding: '10px', 
            marginTop: '15px', 
            backgroundColor: '#ef4444', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#dc2626')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#ef4444')}
        >
          데이터 초기화
        </button>
      )}
    </div>
  )
}

export default App