/**
 * @swagger
 * /common/user:
 *   get:
 *     summary: 유저 조회
 *     tags: [Admin_Public]
 *     parameters:
 *     - in: query
 *       name: userId
 *       required: true
 *       description: 중복체크할 유저 ID
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         description: 유저 ID 사용 가능 여부 정상 확인
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description : "유저 ID 사용가능 판별여부"
 *       409:
 *         description: 이미 사용중인 유저 ID
 *       500:
 *         description: 서버 에러
 */
