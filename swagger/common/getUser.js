/**
 * @swagger
 * /common/user:
 *   get:
 *     summary: 유저 조회
 *     tags : [Admin Public]
 *     requestBody:
 *       description:
 *           유저 생성 단계에서 유저 ID 유효한지 체크
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: "유저 ID"
 *     responses:
 *       200:
 *         description: 유저생성, 사이트 생성 성공
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
