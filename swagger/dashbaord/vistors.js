/**
 * @swagger
 * /dashboard/vistors:
 *   get:
 *     summary: 사이트 전체 방문자 이력 조회
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
 *                     countSeq:
 *                       type: integer
 *                       description : "방문 이력 데이터 레코드 키값"
 *                     popolName:
 *                       type: string
 *                       description : "접속 사이트 포폴명"
 *                     popolSeq:
 *                       type: string
 *                       description : "포폴 레코드 키값"
 *                     ptId:
 *                       type: integer
 *                       description : "사이트 타입 ID (ptid01 or ptid02)"
 *                     timeStamp:
 *                       type: integer
 *                       description : "방문 일시"
 *                     userId:
 *                       type: string
 *                       description : "방문 사이트 관리자 유저 ID"
 *                     userIp:
 *                       type: string
 *                       description : "접속 방문자 IP"
*       400:
*         description: 유효하지않은 JWT
*       401:
*         description: JWT 만료
 *       500:
 *         description: 서버 에러
 */
