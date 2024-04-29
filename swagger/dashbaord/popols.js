/**
 * @swagger
 * /dashboard/popols:
 *   get:
 *     summary: 관리자 유저에 대한 전체 사이트 조회
 *     tags : [Admin_Dashboard]
 *     parameters:
 *     - in: query
 *       name: userKey
 *       required: true
 *       description: 유저 레코드 키값
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *                 type: array
 *                 items: 
 *                   type: object
 *                   properties:
 *                     popolSeq:
 *                       type: integer
 *                       description : "포폴 레코드 키값"
 *                     popolName:
 *                       type: string
 *                       description : "포폴명"
 *                     fakeName:
 *                       type: string
 *                       description : "예명"
 *                     userKey:
 *                       type: strig
 *                       description : "유저 레코드 키값"
 *                     ptId:
 *                       type: string
 *                       description : "포폴 템플릿 ID"
 *                     phone:
 *                       type: string
 *                       description : "사이트에 기재될 휴대전화번호"
 *                     email:
 *                       type: string
 *                       description : "사이트에 기재될 이메일"
 *                     title:
 *                       type: string
 *                       description : "사이트에 기재될 인삿말"
 *                     sns:
 *                       type: string
 *                       description : "sns 정보 표시 여부"
 *                     icon:
 *                       type: string
 *                       description : "아이콘 타입"
 *                     mainColor:
 *                       type: string
 *                       description : "메인 테마 rgb 색상"
 *                     profileImg:
 *                       type: string
 *                       description : "프로필 이미지 파일명"
 *                     thumbnail:
 *                       type: string
 *                       description : "썸네일 이미지 파일명"
 *                     lastUpdated:
 *                       type: string
 *                       description : "마지막 수정 일시"
 *                     renewalDate:
 *                       type: string
 *                       description : "유휴기간 갱신일"
 *                     usedDay:
 *                       type: integer
 *                       description : "사이트 생성후 지난 일수"
 *                     status:
 *                       type: string
 *                       description : "사이트 게시 여부"
 *                     domain:
 *                       type: string
 *                       description : "도메인명 사용 여부"
 *                     description:
 *                       type: string
 *                       description : "템플릿 설명"
 *                     userId:
 *                       type: string
 *                       description : "유저 ID"
*       400:
*         description: 유효하지않은 JWT
*       401:
*         description: JWT 만료
 *       500:
 *         description: 서버 에러
 */
