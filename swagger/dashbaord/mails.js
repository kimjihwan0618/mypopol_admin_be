/**
 * @swagger
 * /dashboard/mails:
 *   get:
 *     summary: 사이트 전체 메일 이력 조회
 *     tags : [Admin_Dashboard]
 *     parameters:
 *     - in: query
 *       name: userId
 *       required: true
 *       description: 유저 ID
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
 *                     seq:
 *                       type: integer
 *                       description : "이메일 이력 데이터 레코드 키값"
 *                     userId:
 *                       type: string
 *                       description : "사이트 관리자 ID"
 *                     ptId:
 *                       type: string
 *                       description : "사이트 타입 ID"
 *                     email:
 *                       type: string
 *                       description : "발신자 이메일"
 *                     title:
 *                       type: string
 *                       description : "발신자 메일 제목"
 *                     content:
 *                       type: string
 *                       description : "발신자 메일 내용"
 *                     phone:
 *                       type: string
 *                       description : "발신자 휴대전화번호"
 *                     subject:
 *                       type: string
 *                       description : "메일 카테고리"
 *                     userIp:
 *                       type: string
 *                       description : "발신자 IP"
 *                     timeStamp:
 *                       type: string
 *                       description : "메일 보낸일시"
 *                     popolName:
 *                       type: string
 *                       description : "관리자 사이트 포폴명"
 *                     popolSeq:
 *                       type: integer
 *                       description : "관리자 포폴 데이터 레코드 키값"
*       400:
*         description: 유효하지않은 JWT
*       401:
*         description: JWT 만료
 *       500:
 *         description: 서버 에러
 */
