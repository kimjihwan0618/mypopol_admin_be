/**
 * @swagger
 * /dashboard/works:
 *   get:
 *     summary: 관리자 유저에 대한 전체 프로젝트 조회
 *     tags : [Admin_Dashboard]
 *     parameters:
 *     - in: query
 *       name: userKey
 *       required: true
 *       description: 유저 레코드 키값
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *                 type: array
 *                 items: 
 *                   type: object
 *                   properties:
 *                     etc:
 *                       type: string
 *                       description : "프로젝트 기타정보"
 *                     lastUpdated:
 *                       type: string
 *                       description : "최근수정일시"
 *                     logo:
 *                       type: string
 *                       description : "프로젝트 로고 이미지 파일명"
 *                     order:
 *                       type: integer
 *                       description : "사이트 게시 순서"
 *                     popolSeq:
 *                       type: integer
 *                       description : "포폴 레코드 키값"
 *                     poster:
 *                       type: string
 *                       description : "프로젝트 포스터 이미지 파일명"
 *                     src:
 *                       type: string
 *                       description : "프로젝트 이미지 파일 저장 경로"
 *                     subTitle:
 *                       type: string
 *                       description : "부제목"
 *                     title:
 *                       type: string
 *                       description : "제목"
 *                     summary:
 *                       type: string
 *                       description : "프로젝트 내용"
 *                     workId:
 *                       type: integer
 *                       description : "프로젝트 타입 ID"
 *                     workSeq:
 *                       type: integer
 *                       description : "프로젝트 레코드 키값"
*       400:
*         description: 유효하지않은 JWT
*       401:
*         description: JWT 만료
 *       500:
 *         description: 서버 에러
 */
