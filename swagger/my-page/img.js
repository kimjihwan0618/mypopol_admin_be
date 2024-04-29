/**
 * @swagger
 * /my-page/profile/img:
 *   post:
 *     summary: 관리자 유저 프로필 이미지 변경
 *     tags:
 *       - Admin_Profile
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImg:
 *                 type: string
 *                 format: binary
 *                 description: 파일명 인코딩 필요                    
 *               oldFileName:
 *                 type: string
 *                 description: 이전 프로필 이미지 파일 이름
 *               userId:
 *                 type: string
 *                 description: 사용자 ID
 *     responses:
 *       200:
 *         description: 프로필 이미지 변경 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *               description: 성공 true 실패 false
 *       400:
 *         description: 유효하지 않은 JWT
 *       401:
 *         description: JWT 만료
 *       500:
 *         description: 서버 에러
 */