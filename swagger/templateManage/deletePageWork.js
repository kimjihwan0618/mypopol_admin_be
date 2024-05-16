/**
 * @swagger
 * /templateManage/page/work:
 *   delete:
 *     summary: 포폴사이트 프로젝트(작품) 정보 삭제
 *     tags:
 *       - Admin_Site Management
 *     parameters:
 *     - in: query
 *       name: popolSeq
 *       required: true
 *       description: 포폴 사이트 레코드 키값
 *       schema:
 *         type: string
 *     - in: query
 *       name: workSeq
 *       required: true
 *       description: 프로젝트(작품) 레코드 키값
 *       schema:
 *         type: string
 *     - in: query
 *       name: ptId
 *       required: true
 *       description: 포폴 사이트 타입 ID (ptid01 or ptid02)
 *     - in: query
 *       name: userId
 *       required: true
 *       description: 유저 ID
 *     - in: query
 *       name: src
 *       required: true
 *       description: 파일 스토리지 유저 이미지 경로 
 *       schema:
 *         type: string
 *     - in: query
 *       name: order
 *       required: true
 *       description: 해당 사이트 프로젝트(작품) 배치 순서 (재정렬 용도)
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         description: 프로젝트(작품) 정보 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   response:
 *                     type: object
 *                     description : "삭제 성공시, 빈 배열 반환"
 *       400:
 *         description: 유효하지 않은 JWT
 *       401:
 *         description: JWT 만료
 *       500:
 *         description: 서버 에러
 */