/**
 * @swagger
 * /my-page/profile/info:
 *   put:
 *     summary: 유저 정보(유저명, 비밀번호) 변경
 *     tags : 
 *       - Admin_Profile
 *     requestBody:
 *       description:
 *         관리자 유저 계정 유저명, 비밀번호 변경
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
 *               username:
 *                 type: string
 *                 description: "변경할 계정의 유저명"
 *     responses:
 *       200:
 *         description: 유저 정보 변경 성공
 *         content:
 *           application/json:
 *             schema:
 *                 type: boolean
 *                 description: "성공 true"
 *       400:
 *         description: 유효하지 않은 JWT
 *       401:
 *         description: JWT 만료
 *       500:
 *         description: 서버 에러
 */
