/**
 * @swagger
 * tags:
 *   name: Admin Public
 *   description: 로그인 전 관리자 유저에게 접근이 허용된 API
 */

/**
 * @swagger
* /common/login:
*   post:
*     summary: 유저 비밀번호 변경
*     tags : [Admin Public]
*     requestBody:
*       description: 비밀번호 잊어버렸을시, 본인인증 후 비밀번호 변경
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               userId:
*                 type: string
*                 description: 유저 ID
*               password:
*                 type: string
*                 description: 유저 비밀번호
*     responses:
*       200:
*         description: 유저 로그인 성공.
*         content:
*           application/json:
*             schema:
*                 type: object
*                 properties:
*                   accessToken:
*                     type: string
*                     description : JWT
*                   tokenExpiresIn:
*                     type: integer
*                   userKey:
*                     type: string
*                   userId:
*                     type: string
*                   profileImg:
*                     type: string
*                   username:
*                     type: string
*                   roleId:
*                     type: string
*                   role:
*                     type: string
*                   authType:
*                     type: string
*                   authValue:
*                     type: string
*       204:
*         description: 요청된 정보의 유저 없음. 
*       500:
*         description: 서버 에러
*/
