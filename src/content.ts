// src/content.ts
console.log("Context-Lab: 저장 엔진(Storage Engine) 가동 중...");

document.addEventListener('submit', async (event) => {
  const target = event.target as HTMLFormElement;
  
  // 비밀번호 필드가 있는지 확인하여 '가입/로그인' 상황인지 판단
  const hasPassword = target.querySelector('input[type="password"]');

  if (hasPassword) {
    // 1. 추출할 데이터 객체 생성
    const newData = {
      id: Date.now(), // 고유 ID로 타임스탬프 사용
      title: document.title,
      url: window.location.href,
      // 메타 데이터(설명) 추출, 없으면 기본값 설정
      description: document.querySelector('meta[name="description"]')?.getAttribute('content') || "상세 설명 없음",
      timestamp: new Date().toLocaleString()
    };

    try {
      // 2. 기존에 저장된 데이터 가져오기 (없으면 빈 배열)
      const result = await chrome.storage.local.get(['contextLogs']);
      
      // [수정 포인트] result.contextLogs가 undefined일 수 있으므로 빈 배열을 기본값으로 주고, 
      // 명시적으로 배열 타입(any[])임을 알려주어 .push() 에러를 방지합니다.
      const logs = (result.contextLogs || []) as any[];

      // 3. 새 데이터 추가
      logs.push(newData);

      // 4. 다시 로컬 저장소에 저장
      await chrome.storage.local.set({ contextLogs: logs });

      console.log("✅ [Context-Lab] 데이터가 로컬 저장소에 성공적으로 인덱싱되었습니다:", newData);
      alert(`Context-Lab 알림: '${newData.title}' 정보가 기록되었습니다.`);
    } catch (error) {
      console.error("❌ 데이터 저장 중 오류 발생:", error);
    }
  }
});