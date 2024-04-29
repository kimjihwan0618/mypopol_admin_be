/**
 * @swagger
* /auth/jwt/refresh:
*   post:
*     summary: JWT 재발급
*     tags : [Admin_Initialization]
*     responses:
*       200:
*         description: JWT 재발급 하고 유저정보를 재조회. Authorize 재세팅 필요.
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
*       400:
*         description: 유효하지않은 JWT
*       401:
*         description: JWT 만료
*       500:
*         description: 서버 에러
*/
