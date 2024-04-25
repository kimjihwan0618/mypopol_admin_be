/**
 * @swagger
 * /common/auth-code:
 *   post:
 *     summary: 본인 인증번호 발급
 *     tags : [Admin Public]
 *     requestBody:
 *       description:
 *           유저 생성 or 비밀번호 변경시 필요한 인증번호 발급 (유효기간 2분)
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               forgotPw:
 *                 type: boolean
 *                 description: "액션 타입 구분용 (비밀번호 변경)"
 *               userEmail:
 *                 type: string
 *                 description: "변경할 유저 패스워드 (유저 생성)"
 *               userId:
 *                 type: string
 *                 description: "유저 ID (비밀번호 변경)"
 *               userName:
 *                 type: string
 *                 description: "유저명 (비밀번호 변경)"
 *     responses:
 *       200:
 *         description: 인증번호 발급 성공
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   authValue:
 *                     type: string
 *                     description : "비밀번호 찾기 단계시 본인 인증 수단 조회"
 *                   authType:
 *                     type: string
 *                     description : "비밀번호 찾기 단계시 본인 인증 수단 조회"
 *                   userEmail:
 *                     type: string
 *                     description : "유저 생성 단계시 본인인증 이메일"
 *       404:
 *         description: 유효하지 않은 유저
 *       409:
 *         description: 이미 존재하는 유저
 *       500:
 *         description: 서버 에러
 */
