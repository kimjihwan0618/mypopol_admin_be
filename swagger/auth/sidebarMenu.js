/**
 * @swagger
* /auth/sidebar/menu:
*   get:
*     summary: 사이드 메뉴바 데이터 조회
*     tags : [Admin_Initialization]
*     parameters:
*       - in: query
*         name : roleId
*         type : integer
*         required : true
*         description : 1 = 관리자 권한, 2 = 사용자 권한, 3 = 관리자 백업, 4 = 사용자 백업
*     responses:
*       200:
*         description: 조회 성공
*         content:
*           application/json:
*             schema:
*                 type: object
*                 properties:
*                   menuJson:
*                     type: string
*       400:
*         description: 유효하지않은 JWT
*       401:
*         description: JWT 만료
*       500:
*         description: 서버 에러
*/
