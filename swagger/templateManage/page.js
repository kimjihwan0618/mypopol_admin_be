/**
 * @swagger
 * /templateManage/page:
 *   put:
 *     summary: 관리자 유저 포폴사이트 정보 업데이트
 *     tags:
 *       - Admin_Site Management
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImg:
 *                 type: string
 *                 format: binary
 *                 description: 사이트에 게시되는 유저이미지 파일 | swagger 사용시 파일명 인코딩 필요
 *               thumbnailImg:
 *                 type: string
 *                 format: binary
 *                 description: 사이트 썸네일 이미지 | swagger 사용시 파일명 인코딩 필요
 *               fields:
 *                 type: string
 *                 description: 사이트 정보 JSON String
 *                 required: true
 *     responses:
 *       200:
 *         description: 포폴사이트 정보 업데이트 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *               description: 성공 true
 *       400:
 *         description: 유효하지 않은 JWT
 *       401:
 *         description: JWT 만료
 *       500:
 *         description: 서버 에러
 */