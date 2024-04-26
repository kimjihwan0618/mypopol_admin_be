/**
 * @swagger
 * /common/user/password:
 *   post:
 *     summary: 유저 비밀번호 변경
 *     tags : [Admin_Public]
 *     requestBody:
 *       description:
 *         비밀번호 찾기 ->
 *         본인인증 ->
 *         유저 비밀번호 변경
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: "유저 ID"
 *               password:
 *                 type: string
 *                 description: "변경할 유저 패스워드"
 *               authValue:
 *                 type: string
 *                 description: "인증 수단 값 (폰번호 or 이메일)"
 *               authCode:
 *                 type: string
 *                 description: "본인 인증 번호"
 *     responses:
 *       200:
 *         description: 비밀번호 변경 성공
 *         content:
 *           application/json:
 *             schema:
 *                 type: boolean
 *                 description: "성공 true 실패 false"
 *       401:
 *         description: 유효하지 않은 인증정보.
 *       500:
 *         description: 서버 에러
 */
