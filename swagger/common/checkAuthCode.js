/**
 * @swagger
 * /common/auth-code:
 *   get:
 *     summary: 인증번호 체크
 *     tags : [Admin_Public]
 *     parameters:
 *     - in: query
 *       name: authCode
 *       required: true
 *       description: 인증번호
 *       schema:
 *         type: string
 *     - in: query
 *       name: authValue
 *       required: true
 *       description: 이메일 or 휴대전화번호
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         description: 인증번호 체크 성공
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   authCode:
 *                     type: string
 *                     description : "인증번호"
 *       400:
 *         description: 유효하지 않은 인증번호
 *       500:
 *         description: 서버 에러
 */
