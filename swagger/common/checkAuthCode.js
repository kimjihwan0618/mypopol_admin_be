/**
 * @swagger
 * /common/auth-code:
 *   get:
 *     summary: 인증번호 체크
 *     tags : [Admin Public]
 *     requestBody:
 *       description:
 *           유저 생성 or 비밀번호 변경시 발급한 인증번호 체크 (유효기간 2분)
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               authCode:
 *                 type: string
 *                 description: "인증번호"
 *               authValue:
 *                 type: string
 *                 description: "이메일 or 휴대전화번호"
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
