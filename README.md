# Hobby Platform  

### **프로젝트 개요**  
사용자가 다양한 취미 활동을 공유하고 탐색할 수 있는 플랫폼.  
사용자는 자신만의 취미를 등록하거나, 다른 사람들의 취미를 검색하고 참여할 수 있으며, 채팅 및 화면 공유 기능을 통해 실시간으로 소통가능.  

---

### **학습 목표 및 배운 점**  
- **학습 목적**:  
  - 실시간 통신 기술(Socket.IO) 학습 및 구현  
  - NestJS와 MySQL의 연동을 통한 데이터 처리  
  - WebRTC를 이용한 화면 공유 기술 이해  

- **배운 점**:  
  - 실시간 데이터 송수신과 통합 구조 설계  
  - 화면 공유 기능 구현을 위한 WebRTC의 기초  
  - 백엔드와 프론트엔드의 통신 구조 효율화
  - 시그널링 서버 (Signaling Server)에 대해
    1. **Offer**:  
       - 한 클라이언트가 연결 요청을 보낼 때 생성되는 SDP(Session Description Protocol) 정보입니다.  
       - 이 정보를 상대방에게 전달해 연결을 제안합니다.  

    2. **Answer**:  
       - Offer를 받은 클라이언트가 생성하는 응답 SDP 정보입니다.  
       - 이를 통해 두 클라이언트가 서로 연결 설정을 완료합니다.  

    3. **ICE Candidate**:  
       - 두 클라이언트 간의 네트워크 경로를 설정하기 위해 필요한 후보군 정보입니다.  
       - 연결 가능한 IP 주소와 포트 정보가 포함됩니다.  
---

### **기술 스택**  
#### **프론트엔드 (예정)**  
- **React**: UI 컴포넌트 기반 개발  
- **Redux Toolkit**: 상태 관리 효율성 극대화  
- **MUI (Material-UI)**: 스타일링 및 UI 디자인  

#### **백엔드**  
- **NestJS**: 구조적인 백엔드 개발  
- **JWT (JSON Web Token)**: 사용자 인증 및 권한 관리  
- **MySQL**: 데이터 저장소로 활용  
- **Socket.IO**: 실시간 채팅 시스템 구현
- **WebSocket (NestJS)**: 실시간 채팅 시스템 및 화면 공유 기능 구현 (Signaling Server)  

---

### ✅ **To-Do 리스트**  
1. **백엔드**  
   - [x] 기본 API 설계 (CRUD)  
   - [x] JWT 기반 사용자 인증 구현  
   - [x] 실시간 채팅 기능 (Socket.IO) 구현  
   - [x] Signaling Server 기능구현
   - [ ] Redis를 이용해서 Room 관리
   - [ ] Chat 기능에 Message Queue 적용
   - [ ] Elastic Search를 이용한 검색기능 구현

2. **프론트엔드**  
   - [ ] React로 기본 레이아웃 설계  
   - [ ] Redux Toolkit으로 상태 관리 구현  
   - [ ] MUI를 이용한 UI 디자인  
   - [ ] 채팅 인터페이스와 화면 공유 UI 구현  

3. **기능 통합**  
   - [ ] 프론트엔드와 백엔드 연결  
   - [ ] API 테스트 및 디버깅  
   - [ ] 채팅 및 화면 공유 기능 통합 테스트
   - [ ] LocalStack 사용해보기

--- 
