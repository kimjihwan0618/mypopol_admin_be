/**
 * @swagger
 * /common/user:
 *   post:
 *     summary: 유저 생성
 *     tags : [Admin_Public]
 *     requestBody:
 *       description:
 *           어드민 페이지를 통해 사이트를 관리할 수 있는 관리자 계정, 포폴사이트 생성
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 description: "유저명"
 *               userId:
 *                 type: string
 *                 description: "유저 ID"
 *               password:
 *                 type: string
 *                 description: "유저 패스워드"
 *               passwordCheck:
 *                 type: string
 *                 description: "유저 패스워드 확인"
 *               userEmail:
 *                 type: string
 *                 description: "본인인증 유저 이메일"
 *               authCode:
 *                 type: string
 *                 description: "인증번호"
 *               templateId:
 *                 type: string
 *                 description: "포폴 템플릿 ID (ptid01, ptid02)"
 *               popolName:
 *                 type: string
 *                 description: "포폴명"
 *               title:
 *                 type: string
 *                 description: "사이트 상단 인삿말"
 *               sns:
 *                 anyOf:
 *                   - type: string
 *                   - type: object
 *                     properties:
 *                       ptid01:
 *                         type : object
 *                       ptid02:
 *                         type : string
 *                 description: 사이트 부수 정보 ptid01 = null, ptid02 = {"job":"OOO Developer","aboutMe":"안녕하세요\\n 개발자 OOO입니다.","skills":{},"sns":{}}
 *               fakeName:
 *                 type: string
 *                 description: "사이트에 기재될 이름"
 *               defaultColor:
 *                 type: string
 *                 description: "사이트 메인 컬리 도메인='rgb(255, 182, 59)','rgb(75, 135, 224)','rgb(75, 224, 149)','rgb(55,65,81)'"
 *               userKey:
 *                 type: string
 *                 description: "yyyyMMddHHmmSS (유저 레코드키)"
 *               authType:
 *                 type: string
 *                 description: "본인인증 수단 (email or phone)"
 *               authValue:
 *                 type: string
 *                 description: "이메일 or 휴대전화번호"
 *               phone:
 *                 type: string
 *                 description: "사이트에 기재될 휴대전화"
 *               email:
 *                 type: string
 *                 description: "사이트에 기재될 이메일"
 *     responses:
 *       200:
 *         description: 유저생성, 사이트 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   accessToken:
 *                     type: string
 *                     description : "유저 생성후 로그인 JWT 발급"
 *                   tokenExpiresIn:
 *                     type: string
 *                     description : "JWT 생성일시"
 *                   userKey:
 *                     type: string
 *                     description : "유저 데이터 레코드키"
 *                   profileImg:
 *                     type: string
 *                     description : "유저 이미지 파일명"
 *                   userId:
 *                     type: string
 *                     description : "유저 ID"
 *                   username:
 *                     type: string
 *                     description : "유저명"
 *                   roleId:
 *                     type: string
 *                     description : "사용자 권한 ID"
 *                   role:
 *                     type: string
 *                     description : "사용자 권한 설명"
 *                   authType:
 *                     type: string
 *                     description : "본인인증 타입 email or phone"
 *                   authValue:
 *                     type: string
 *                     description : "이메일 or 휴대전화번호"
 *       400:
 *         description: 유효하지 않은 접근
 *       500:
 *         description: 서버 에러
 */
