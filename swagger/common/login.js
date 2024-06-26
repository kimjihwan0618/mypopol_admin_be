/**
 * @swagger
* /common/login:
*   post:
*     summary: 유저 로그인
*     tags : [Admin_Public]
*     requestBody:
*       description: 로그인에 필요한 정보
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
