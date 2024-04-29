/**
 * @swagger
 * /templateManage/page/work:
 *   post:
 *     summary: 포폴사이트 프로젝트(작품) 정보 추가
 *     tags:
 *       - Admin_Site Management
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titleImg:
 *                 type: string
 *                 format: binary
 *                 description: 사이트 기재될 프로젝트(작품) 로고 이미지 파일 | swagger 사용시 파일명 인코딩 필요
 *               posterImg:
 *                 type: string
 *                 format: binary
 *                 description: 사이트 기재될 프로젝트(작품) 포스터 이미지 파일 | swagger 사용시 파일명 인코딩 필요
 *                 required: true
 *               fields:
 *                 type: string
 *                 description: 프로젝트(작품) 정보 JSON String
 *                 required: true
 *     responses:
 *       200:
 *         description: 프로젝트(작품) 정보 추가/수정 성공
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   response:
 *                     type: object
 *                     description : "추가/수정된 프로젝트(작품 정보)"
 *       400:
 *         description: 유효하지 않은 JWT
 *       401:
 *         description: JWT 만료
 *       500:
 *         description: 서버 에러
 */