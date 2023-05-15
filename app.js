// 입장토크만 만들어서 로그인 검증했는데

// 엑세스 토크만 사용한 방식

// 1. 이용자가 로그인 시도를 하고
// 2. 서버에서 이용자를 확인하고 입장권을 발급해주고
// JWT토큰 인증정보를 payload에 할당 하고 생성
// 3. 생성한 토큰을 클라이언트에 반환해주고 클라이언트는 이 입장권을 가지고 있는다.
// 4. 클라이언트가 서버에 요청을 할때 이 입장권도 같이 보내서 요청을 시도한다.
// 5. 서버는 요청을 받아서 그 입장권이 유효한지 확인하고 유효한 입장권이면 요청을 처리하고
//       요청에 대한 응답을 해준다.
// 6. 입장권이 정상적인지 확인하고 썩었는지 변조가 되었는지 (변조가 되었고 썩었으면 다시 재로그인 시킨다.)
// (입장권 새로 산다.)

// Refresh token을 같이 사용하면 
// Access token만 사용하면 인증 보안이 취약할수 있어서 다른 사람이 엑세스 토큰을 탈취했을때 
// 토큰의 유효 기간이 끝날때까지는 막을수가 없다.  그래서 유효기간을 짧게 주고 짧게 주면 
// 로그인을 계속 해야하는 번거로움이 생기고 (사용자가 이용하기 힘들다.) Refresh token의 유효기간을 길게 주고 
// Access token의 유효기간을 짧게 주어서 너무 어려운 개념은 아니고 JWT토큰을 그냥 2개 사용하는것
// Refresh token은 유효기간을 길게 주고 Access token이 유효기간이 끝났을때 발급해주는 역할만 하면 된다.

// Access token과 refresh token을 같이 사용한 인증 방식
// 1. 클라이언트가 로그인
// 2. 서버에서 사용자를 확인하고 입장권 권한 인증 정보를 payload에 할당하고 생성
// refresh token을 만들어서 데이터베이스에 저장해주고 2개의 토큰 전부 클라이언트에 전달 해준다.
// 3. 클라이언트도 두 토큰을 가지고 있고 
// 4. 클라이언트가 요청을 할때 Access 토큰을 전달해서 요청한다.
// 5. 서버는 전달받은 토큰을 확인하고 Access token을 디코드 해서 사용자 정보를 확인하고 
// 6. 토큰이 만약 정상적인지 확인(썩은 토큰인지.)
// 7. 날짜가 지난 토큰이거나 변조된 토큰이면 새로 로그인 시킬수있게 한다.
// 8. 만약에 날짜가 지난 토큰이면 refresh token으로 다시 재발급 해준다.

// 쉽게 엑세스 토큰은 우리가 사용하는 그대로이고 refresh token만 추가되었는데 Access token의 발급 용도로만 알고있자.

// 오늘 사용할 모듈 
// dotenv express cookie-parser jsonwebtoken 

// 1. package.json
// 2. 서버 객체 만들고
// 3. 서버 대기상태
// 4. view engine 경로 설정
// 5. view engine ejs 사용
// 6. body 객체 사용

const express = require("express");
const path = require("path");
const app = express();
const dot = require("dotenv").config()
const jwt = require("jsonwebtoken")

const port = 8000;
app.listen(8000,()=>{
    console.log("server open");
});

app.set("views",path.join(__dirname,"page"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:false}))// 6. body 객체 사용
// 더미로 회원가입 한사람의 정보 객체
const user = {
    id : "shin",
    password: "123"
}

app.get('/',(req,res)=>{
    res.render("login");
})

app.post("/login", (req,res)=>{
    // 요청 객체의 body에 user_id랑 user_pw
    const{user_id, user_pw}= req.body;
    if(user_id === user.id && user_pw === user.password){
        // access token 발급
        const accessToken = jwt.sign({
            id : user.id
        },process.env.ACCESS_TOKEN_KEY,{
            expiresIn : "20s",

        });
        const refreshToken = jwt.sign({
            id : user.id
        },process.env.REFRESH_TOKEN_KEY,{
            expiresIn : "1d",
        })

        res.cookie("refresh",refreshToken,{maxAge :24 *60 *60 * 1000 })
        res.render("join",{accessToken});
    } 
})









