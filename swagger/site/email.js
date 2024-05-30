/**
 * @swagger
 * /email/send:
 *   post:
 *     summary: 사이트 CONTACT 이메일 전송 API
 *     tags : [User Public]
 *     requestBody:
 *       description: 이메일 전송에 쓰는 속성값
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 description: 발신자 휴대폰 번호(-제외)
 *               userId:
 *                 type: string
 *                 description: 수신자 유저 ID
 *               ptid:
 *                 type: string
 *                 description: 사이트 템플릿 ID (ptid01, ptid02)
 *               from:
 *                 type: string
 *                 description: 발신자 이메일
 *               to:
 *                 type: string
 *                 description: 수신자 이메일
 *               subject:
 *                 type: string
 *                 description: 이메일 내용 유형
 *               title:
 *                 type: string
 *                 description: 이메일 제목
 *               content:
 *                 type: string
 *                 description: 이메일 내용(body)
 *               html:
 *                 type: string
 *                 description: 실제 이메일이 보여질 html 입력
 *     responses:
 *       200:
 *         description: 이메일 전송 성공
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   popolInfo:
 *                     type: object
 *                     properties:
 *                       success:
 *                         type: boolean
 *                       message:
 *                         type: string
 *       500:
 *         description: 서버 에러
 */
