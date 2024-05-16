/**
 * @swagger
* /site/popol:
*   post:
*     summary: 포폴 이니셜라이징 하기위한 유저에 해당하는 사이트 데이터 조회
*     tags : [User Public]
*     requestBody:
*       description: 해당 포폴 유저 정보 조회 및 방문자 집계 여부 속성
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               userId:
*                 type: string
*                 description: 유저 ID
*               ptId:
*                 type: string
*                 description: 사이트 타입 ID (ptid01 or ptid02)
*               countFlag:
*                 type: boolean
*                 description: 사이트 방문자 카운트 집계 여부
*     responses:
*       200:
*         description: 해당 유저 포폴 사이트 데이터 조회 성공.
*         content:
*           application/json:
*             schema:
*                 type: object
*                 properties:
*                   popolInfo:
*                     type: object
*                     properties:
*                       domain: 
*                         type: string 
*                       email: 
*                         type: string 
*                       fakeName: 
*                         type: string 
*                       icon: 
*                         type: string 
*                       lastUpdated: 
*                         type: string 
*                       mainColor: 
*                         type: string 
*                       phone: 
*                         type: string 
*                       popolName: 
*                         type: string 
*                       popolSeq: 
*                         type: number 
*                       profileImg: 
*                         type: string 
*                       ptId: 
*                         type: string 
*                       renewalDate: 
*                         type: string 
*                       sns: 
*                         type: string 
*                       status: 
*                         type: string 
*                       thumbnail: 
*                         type: string 
*                       title: 
*                         type: string 
*                       usedDay: 
*                         type: number 
*                       userId: 
*                         type: string 
*                       userKey: 
*                         type: string 
*                     description : 사이트 기본 정보
*                   worksInfo:
*                     type: array
*                     items:
*                       type: object
*                       properties:
*                         etc:
*                           type: string
*                         lastUpdated:
*                           type: string
*                         logo:
*                           type: string
*                         order:
*                           type: number
*                         popolSeq:
*                           type: number
*                         poster:
*                           type: string
*                         src:
*                           type: string
*                         subTitle:
*                           type: string
*                         summary:
*                           type: string
*                         title:
*                           type: string
*                         workId:
*                           type: string
*                         workSeq:
*                           type: number
*                     description : 프로젝트(작품) 정보 리스트
*       204:
*         description: 요청된 정보의 유저 없음. 
*       500:
*         description: 서버 에러
*/
